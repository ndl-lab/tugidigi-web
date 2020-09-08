/**
 * @license
 * Copyright 2019 AI Lab - Telkom University. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */ 
 
 
import * as tf from '@tensorflow/tfjs'
import coco_classes from './layout_classes'

/**
* A class that wraps TinyYoloV3.
*/
export default class TinyYoloV3 {	
	
	/**
	* @param {nObject} number of maximum object to recognize in one detection
	* @param {scoreTh} score threshold
	* @param {iouTh}   Intersect Over Union threshold
	*/
	constructor(nObject=1, scoreTh=0.01,  iouTh=0.1) {
		this.nObject = nObject
		this.scoreTh = scoreTh
		this.iouTh = iouTh
		this.anchor = [219,238, 255,268, 268,224, 272,251, 273,242, 284,293]
		this.mask = { "3": [[6, 7, 8], [3, 4, 5], [0, 1, 2]],  "2": [[3, 4, 5], [1, 2, 3]] }
		this.labels = coco_classes
		this.nClass = coco_classes.length
	}
	
	/**
	* Load the weights model from the specified url
	* @param {url} link path to model.json weights
	*/
	async load( url = 'https://raw.githubusercontent.com/adf-telkomuniv/tfjs-tiny-yolov3/master/model/model.json' ) {
		this.model = await tf.loadLayersModel(url)
	}
	
	/**
	* Forward Pass the input and returns the output feature volume
	* @param {input} image, canvas, or video element
	* @param {flipHorizontal} flip the input image tensor for webcam input
	*/
	async predict(input, flipHorizontal=true) {
		this.imgSize = input.constructor.name === 'HTMLVideoElement' ? [input.videoHeight, input.videoWidth] : [input.height, input.width]
		
		let features = tf.tidy(() => {			
			const canvas = document.createElement('canvas')
			canvas.width = 320
			canvas.height = 320
			const ctx = canvas.getContext('2d')
			ctx.drawImage(input, 0, 0, 320, 320)

			let imageTensor = tf.browser.fromPixels(canvas, 3)
			imageTensor = imageTensor.expandDims(0).toFloat().div(tf.scalar(255))
			if(flipHorizontal){
				imageTensor = imageTensor.reverse(2)
			}

			const features = this.model.predict(imageTensor)
			return features
		})

		return features		
	}
	
		
	/**
	* Forward Pass the input and returns the box of detected objects
	* @param {input} image, canvas, or video element
	* @param {flipHorizontal} flip the input image tensor for webcam input
	*/
	async detectAndBox(input, flipHorizontal=true){

		const features = await this.predict(input, flipHorizontal)
		
		let [boxes, boxScores] = tf.tidy(() => {
			let nFeature = features.length
			let anchorMask = this.mask[nFeature]
			let inputShape = features[0].shape.slice(1, 3).map(num => num * 32)

			const anchors_tf = tf.tensor1d(this.anchor).reshape([-1, 2])
			let fBoxes = []
			let fScores = []

			for (let i = 0; i < nFeature; i++) {
				const anchorFeature = anchors_tf.gather(tf.tensor1d(anchorMask[i], 'int32'))
				const [boxes, boxScores] = this.getFeatureBox( features[i], anchorFeature, inputShape)

				fBoxes.push(boxes)
				fScores.push(boxScores)
			}

			fBoxes = tf.concat(fBoxes)
			fScores = tf.concat(fScores)

			return [fBoxes, fScores]
		})
		
		let boxCoord = []
		let scores = []
		let labelIdx = []

		const yPred = tf.argMax(boxScores, -1)
		const boxPred = tf.max(boxScores, -1)

		const nmsIndex = await tf.image.nonMaxSuppressionAsync(boxes, boxPred, this.nObject, this.iouTh, this.scoreTh)

		if (nmsIndex.size) {
			tf.tidy(() => {
				const classBoxes = tf.gather(boxes, nmsIndex)
				const classBoxScores = tf.gather(boxPred, nmsIndex)

				classBoxes.split(nmsIndex.size).map(box => {
					boxCoord.push(box.dataSync())
				})
				classBoxScores.dataSync().map(score => {
					scores.push(score)
				})
				labelIdx = yPred.gather(nmsIndex).dataSync()
			})
		}
		boxPred.dispose()
		yPred.dispose()
		nmsIndex.dispose()

		boxes.dispose()
		boxScores.dispose()

		return boxCoord.map((box, i) => {
			const top = Math.max(0, box[0])
			const left = Math.max(0, box[1])
			const bottom = Math.min(this.imgSize[0], box[2])
			const right = Math.min(this.imgSize[1], box[3])
			const height = bottom - top
			const width = right - left
			return { top, left, bottom, right, height, width, score:scores[i], label:this.labels[labelIdx[i]] }
		})
	}
	
	getFeatureBox( feature, featAnchor, inputShape ) {
		const nAnchors = featAnchor.shape[0]
		const anchors_tf = tf.reshape(featAnchor, [1, 1, nAnchors, 2])

		const gridShape = feature.shape.slice(1, 3)

		const gridY = tf.tile(tf.reshape(tf.range(0, gridShape[0]), [-1, 1, 1, 1]), [1, gridShape[1], 1, 1])
		const gridX = tf.tile(tf.reshape(tf.range(0, gridShape[1]), [1, -1, 1, 1]), [gridShape[0], 1, 1, 1])
		const grid = tf.concat([gridX, gridY], 3).cast(feature.dtype)

		feature = feature.reshape([gridShape[0], gridShape[1], nAnchors, this.nClass + 5])

		const [xy, wh, con, probs] = tf.split(feature, [2, 2, 1, this.nClass], 3)
		const boxXy = tf.div(tf.add(tf.sigmoid(xy), grid), gridShape.reverse())
		const boxWh = tf.div(tf.mul(tf.exp(wh), anchors_tf), inputShape.reverse())
		const boxConfidence = tf.sigmoid(con)

		let boxClassProbs = tf.sigmoid(probs)

		let boxYx = tf.concat(tf.split(boxXy, 2, 3).reverse(), 3)
		let boxHw = tf.concat(tf.split(boxWh, 2, 3).reverse(), 3)

		const boxMins = tf.mul(tf.sub(boxYx, tf.div(boxHw, 2)), this.imgSize)
		const boxMaxes = tf.mul(tf.add(boxYx, tf.div(boxHw, 2)), this.imgSize)

		let boxes = tf.concat([
			...tf.split(boxMins, 2, 3),
			...tf.split(boxMaxes, 2, 3)
		], 3)

		boxes = boxes.reshape([-1, 4])
		
		let boxScores = tf.mul(boxConfidence, boxClassProbs)
		boxScores = tf.reshape(boxScores, [-1, this.nClass])

		return [boxes, boxScores]
	}
}


// @author ANDITYA ARIFIANTO
// AI LAB - 2019