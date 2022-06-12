import * as THREE from 'three';
import { Mesh, MeshStandardMaterial, TextureLoader } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const bookglb: string = require("url:../models/book.gltf");
const meshLoader = new GLTFLoader();
const textureLoader = new TextureLoader();
let bookModel: GLTF | null = null;
let paperMaterial: MeshStandardMaterial | null = null;

const MESHNAME_BOOK = "book";
const MESHNAME_PAPER = "paper";
const EDGE_CUTOFF_X = 0.088;

const testImg = textureLoader.load(require("url:../books/img/haruhi-1.png"));
// const testImg = textureLoader.load(require("url:../models/cover-uv.png"));
testImg.flipY = false;
testImg.anisotropy = 2;

export class BookObject extends THREE.Object3D {
  constructor() {
    if (bookModel === null) {
      throw new Error("await book.ready first.");
    }
    super();
    let cloned = bookModel.scene.clone(true);
    let xscale = 0.5;
    let yscale = 1;
    let zscale = 1;
    cloned.traverse(child => {
      if (child.name === MESHNAME_BOOK || child.name === MESHNAME_PAPER) {
        let mchild = child as Mesh;
        let geom = mchild.geometry;
        let posarr = geom.attributes.position as any;
        for (let i = 0; i < posarr.count; i ++) {
          let x = posarr.array[i*3];
          if (Math.abs(x) < EDGE_CUTOFF_X) {
            x *= xscale;
          } else {
            if (x < 0) {
              x += EDGE_CUTOFF_X * (1 - xscale);
            } else {
              x -= EDGE_CUTOFF_X * (1 - xscale);
            }
          }
          posarr.array[i*3] = x;
          posarr[i*3 + 1] *= yscale;
          posarr[i*3 + 2] *= zscale;
        }

        if (mchild.name == MESHNAME_BOOK) {
          mchild.material = new THREE.MeshStandardMaterial({
            map: testImg,
            roughness: 0.3,
            metalness: 0,
          });
        } else {
          mchild.material = paperMaterial!;
        }
      }
    });
    this.add(cloned);
  }
}

const loadMesh = new Promise((resolve, reject) => {
  meshLoader.load(bookglb, gltf => {
    bookModel = gltf;
    resolve(null);
  }, undefined, err => {
    reject(new Error(`Failed to load book.glb: ${err}`));
  });
});

const loadPaperMaterial = new Promise((resolve, reject) => {
  textureLoader.load(require("url:../models/paper.png"), tex => {
    paperMaterial = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 1,
      metalness: 0,
    });
    resolve(null);
  }, undefined, err => {
    reject(new Error(`Failed to load paper.png: ${err}`));
  });
})

export const ready = Promise.all([loadMesh, loadPaperMaterial]);
