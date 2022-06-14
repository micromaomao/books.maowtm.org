import { Object3D } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { loadModel } from "./utils";

let sceneModel: GLTF | null = null;

export class Frame extends Object3D {
  haruhi_no: Object3D | null;
  constructor() {
    super();
    if (sceneModel === null) {
      throw new Error("await ready first.");
    }
    this.add(sceneModel.scene);
    this.traverse(c => {
      if (c.name === "haruhi_no") {
        this.haruhi_no = c;
      }
    });
  }

  update(delta: number) {
    this.haruhi_no?.rotateY(delta * Math.PI * 1.5);
  }
}

export const ready = Promise.all([
  loadModel(require("url:../models/scene.gltf")).then(x => { sceneModel = x; }),
]);
