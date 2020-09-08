/*import * as tf from "@tensorflow/tfjs";

const w: Worker = self as any;

export function load(tensor: tf.Tensor => void): void {
    tf.loadGraphModel(modelUrl).then((model): void => {
        console.log(`model was loaded. backend: ${tf.getBackend()}`)
        const result: tf.Tensor = model.predict(tensor) as tf.Tensor;
        model.dispose();
        console.log(tf.memory())
        sendMessage("finished.")
    });
}
w.addEventListener("message", (): void => {
    load("WebWorker", (message: string): void => {
        w.postMessage(message);
    });
});*/