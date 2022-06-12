import * as THREE from 'three';
import { Mesh } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const bookglb: string = require("url:../models/book.gltf");
const loader = new GLTFLoader();
let bookModel: GLTF | null = null;

export class BookObject extends THREE.Object3D {
  constructor() {
    if (bookModel === null) {
      throw new Error("await book.ready first.");
    }
    super();
    let cloned = bookModel.scene.clone(true);
    cloned.traverse(child => {
      if (child instanceof Mesh) {
        let geom = child.geometry;
        console.log(geom);
        let posarr = geom.attributes.position;
        for (let i = 0; i < posarr.count; i ++) {
          let x = posarr.array[i*3];
          if (x < -0.1) {
            x -= -0.07;
          }
          if (x > 0.1) {
            x += -0.07;
          }
          posarr.array[i*3] = x;
        }
      }
    })
    this.add(cloned);
  }
}

export const ready = new Promise((resolve, reject) => {
  loader.load(bookglb, gltf => {
    bookModel = gltf;
    resolve(null);
  }, undefined, err => {
    reject(new Error(`Failed to load book.glb: ${err}`));
  });
});
