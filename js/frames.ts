import { Object3D } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { loadModel } from "./utils";

let sceneModel: GLTF | null = null;

export class Frame extends Object3D {
  haruhi_no: Object3D | null;
  globe_rot_axis: Object3D | null;
  globe: Object3D | null;
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
      if (c.name === "globe_rot_axis") {
        this.globe_rot_axis = c;
      }
      if (c.name === "globe_globe") {
        this.globe = c;
      }
    });
    let globe = this.globe!;
    let globe_rot_axis = this.globe_rot_axis!;
    globe.removeFromParent();
    globe_rot_axis.add(globe);
    globe_rot_axis.updateMatrix();
    globe.updateMatrix();
    globe.matrixAutoUpdate = false;
    globe.matrix.premultiply(globe_rot_axis.matrix.clone().invert());
    globe.updateMatrixWorld();
  }

  update(delta: number) {
    this.haruhi_no?.rotateY(delta * Math.PI * 1.5);
    this.globe_rot_axis?.rotateY(delta * Math.PI * 0.3);
  }
}

export const ready = Promise.all([
  loadModel(require("url:../models/scene.gltf")).then(x => { sceneModel = x; }),
]);
