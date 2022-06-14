import { Object3D } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { loadModel } from "./utils";

let sceneModel: GLTF | null = null;

export class Frame extends Object3D {
  constructor() {
    super();
    if (sceneModel === null) {
      throw new Error("await ready first.");
    }
    this.add(sceneModel.scene);
  }
}

export const ready = Promise.all([
  loadModel(require("url:../models/scene.gltf")).then(x => { sceneModel = x; }),
]);
