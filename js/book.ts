import * as THREE from 'three';
import { Mesh } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const bookglb: string = require("url:../models/book.gltf");
const loader = new GLTFLoader();
let bookModel: GLTF | null = null;

const EDGE_CUTOFF = 0.13;

export class BookObject extends THREE.Object3D {
  constructor() {
    if (bookModel === null) {
      throw new Error("await book.ready first.");
    }
    super();
    let cloned = bookModel.scene.clone(true);
    let scale_factor = 0.2;
    cloned.traverse(child => {
      if (child instanceof Mesh) {
        let geom = child.geometry;
        console.log(geom);
        let posarr = geom.attributes.position;
        for (let i = 0; i < posarr.count; i ++) {
          let x = posarr.array[i*3];
          if (Math.abs(x) < EDGE_CUTOFF) {
            x *= scale_factor;
          } else {
            if (x < 0) {
              x += EDGE_CUTOFF * (1 - scale_factor);
            } else {
              x -= EDGE_CUTOFF * (1 - scale_factor);
            }
          }
          if (x < -EDGE_CUTOFF) {
            // TODO
          }
          if (x > EDGE_CUTOFF) {
            // TODO
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
