import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch  } from "vue-property-decorator";
import Konva from 'konva';

import "./sketch-canvas.scss";

@Component({
  template: require("./sketch-canvas.html"),
  components: {}
})
export default class SketchCanvas extends Vue {
    configKonva:any= {
        width: 224,
        height: 224
    };
    sketchmode:string="brush";
    
    width:number=800;
    height:number=500;
    stage:any= null;
    canvas:any= null;
    context:any=null;
    drawingLayer:any=null;
    drawingScope:any= null;
    lastPointerPosition:any={};
    localPos:any={};
    pos:any=null;
    isPaint:boolean=false;
    
    async mounted() {
        this.localPos={x:0,y:0};
        var container = this.$refs.container;
        this.stage = new Konva.Stage({
          container,
          width: this.width,
          height: this.height
        })
        this.drawingLayer = new Konva.Layer();
        this.stage.add(this.drawingLayer);

        this.canvas = this.$refs.canvas;
        this.drawingScope = new Konva.Image({
          image: this.canvas,
          x: this.width / 4,
          y: 5,
          stroke: 'black'
        })
        this.drawingLayer.add(this.drawingScope);
        this.stage.draw();

        this.context = this.canvas.getContext('2d');
        this.context.lineJoin = 'round';
        this.context.lineWidth = 10;

        // イベント追加
        this.drawingScope.on('mousedown', this.mousedown);
        this.stage.addEventListener('mouseup', this.mouseup);
        this.stage.addEventListener('mousemove', this.mousemove);
        this.drawingScope.on('touchstart', this.mousedown);
        this.stage.addEventListener('touchend', this.mouseup);
        this.stage.addEventListener('touchmove', this.mousemove);
    }
    
    mousedown() {
      this.isPaint = true;
      this.lastPointerPosition = this.stage.getPointerPosition();
    }
    mouseup() {
      this.isPaint = false;
    }
    mousemove() {
      if (!this.isPaint) {
        return;
      }
      // ペンモード時
      if (this.isTargetMode('brush')) {
        this.context.globalCompositeOperation = 'source-over';
      }
      // 消しゴムモード時
      if (this.isTargetMode('eraser')) {
        this.context.globalCompositeOperation = 'destination-out';
      }

      this.context.beginPath();

      this.localPos.x = this.lastPointerPosition.x - this.drawingScope.x();
      this.localPos.y = this.lastPointerPosition.y - this.drawingScope.y();

      // 描画開始座標を指定する
      this.context.moveTo(this.localPos.x, this.localPos.y);

      this.pos = this.stage.getPointerPosition();
      this.localPos.x = this.pos.x - this.drawingScope.x();
      this.localPos.y = this.pos.y - this.drawingScope.y();

      // 描画開始座標から、lineToに指定された座標まで描画する
      this.context.lineTo(this.localPos.x, this.localPos.y);
      this.context.closePath();
      this.context.stroke();
      this.drawingLayer.draw();
      this.lastPointerPosition = this.pos;
    }
    submitParent(){
      let context = this.canvas.getContext('2d');
      let image = context.getImageData(0, 0, this.configKonva.width, this.configKonva.height);
      //console.log(image.data);
      var buffer = [];
      for (var i = 0; i < image.data.length; i += 4){
          buffer.push(image.data[i + 3]);
          buffer.push(image.data[i + 3]);
          buffer.push(image.data[i + 3]);
          buffer.push(image.data[i + 3]);
      }
      this.$emit('canvas-img',new ImageData(new Uint8ClampedArray(buffer),  this.configKonva.width, this.configKonva.height));
    }
    onClearCanvas() {
      this.context.globalCompositeOperation = 'destination-out';
      this.context.fillRect(0, 0, this.width, this.height);
      this.drawingLayer.draw();
      //this.$emit('on-reset');
    }
    // 現在のモードが指定されたモードと一致するかどうか
    isTargetMode(targetMode) {
      return this.sketchmode === targetMode;
    }
}
