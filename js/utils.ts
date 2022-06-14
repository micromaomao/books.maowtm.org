import { Object3D } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

const meshLoader = new GLTFLoader();
export function loadModel(url: string): Promise<GLTF> {
  return new Promise((resolve, reject) => {
    meshLoader.load(url, gltf => {
      gltf.scene.traverse(c => {
        c.castShadow = true;
        c.receiveShadow = true;
      });
      resolve(gltf);
    }, undefined, err => {
      reject(new Error(`Failed to load book.glb: ${err}`));
    });
  });
}

export function generateColor(): number {
  let r = Math.floor(Math.random() * (256 - 70)) + 70;
  let g = Math.floor(Math.random() * (256 - 70)) + 70;
  let b = Math.floor(Math.random() * (256 - 70)) + 70;
  return r << 16 | g << 8 | b;
}
