import * as THREE from 'three';
import { Mesh, MeshStandardMaterial, TextureLoader } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const bookglb: string = require("url:../models/book.gltf");
const meshLoader = new GLTFLoader();
const textureLoader = new TextureLoader();
let bookModel: GLTF | null = null;

const MESHNAME_BOOK = "Cube";
const MESHNAME_PAPER = "Cube001";
const EDGE_CUTOFF_X = 0.145;

const testImg = textureLoader.load(require("url:../books/img/haruhi-1.png"));
testImg.flipY = false;

export class BookObject extends THREE.Object3D {
  constructor() {
    if (bookModel === null) {
      throw new Error("await book.ready first.");
    }
    super();
    let cloned = bookModel.scene.clone(true);
    let scale_factor = 0.5;
    cloned.traverse(child => {
      if (child instanceof Mesh && (child.name === MESHNAME_BOOK || child.name === MESHNAME_PAPER)) {
        let geom = child.geometry;
        let posarr = geom.attributes.position;
        for (let i = 0; i < posarr.count; i ++) {
          let x = posarr.array[i*3];
          if (Math.abs(x) < EDGE_CUTOFF_X) {
            x *= scale_factor;
          } else {
            if (x < 0) {
              x += EDGE_CUTOFF_X * (1 - scale_factor);
            } else {
              x -= EDGE_CUTOFF_X * (1 - scale_factor);
            }
          }
          posarr.array[i*3] = x;
        }

        if (child.name == MESHNAME_BOOK) {
          if (child.material instanceof MeshStandardMaterial) {
            let mat = child.material;
            console.log(mat.map);
            mat.map = testImg;
          }
        }
      }
    });
    this.add(cloned);
  }
}

export const ready = new Promise((resolve, reject) => {
  meshLoader.load(bookglb, gltf => {
    bookModel = gltf;
    resolve(null);
  }, undefined, err => {
    reject(new Error(`Failed to load book.glb: ${err}`));
  });
});
