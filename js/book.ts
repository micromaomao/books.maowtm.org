import * as THREE from 'three';
import { Mesh, MeshStandardMaterial, Texture, TextureLoader } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const bookglb: string = require("url:../models/book.gltf");
const meshLoader = new GLTFLoader();
const textureLoader = new TextureLoader();
let bookModel: GLTF | null = null;
let paperMaterial: MeshStandardMaterial | null = null;

const MESHNAME_BOOK = "book";
const MESHNAME_PAPER = "paper";
const EDGE_CUTOFF_X = 0.088;


export class BookObject extends THREE.Object3D {
  imgPromise: Promise<Texture>;
  bookObject: Mesh | null;
  thickness: number = 0;
  constructor(imgUrl, xscale, yscale, zscale) {
    super();
    if (bookModel === null) {
      throw new Error("await book.ready first.");
    }
    this.imgPromise = new Promise((resolve, reject) => {
      textureLoader.load(imgUrl, resolve, undefined, reject);
    });
    let cloned = bookModel.scene.clone(true);
    cloned.traverse(child => {
      if (child.name === MESHNAME_BOOK || child.name === MESHNAME_PAPER) {
        let mchild = child as Mesh;
        mchild.geometry = mchild.geometry.clone();
        // TODO: cache
        let geom = mchild.geometry;
        let posarr = geom.attributes.position as any;
        let thickness = 0;
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
          if (x > thickness) {
            thickness = x;
          }
        }

        if (mchild.name == MESHNAME_BOOK) {
          this.bookObject = mchild;
          mchild.material = new THREE.MeshStandardMaterial({
            opacity: 0,
            roughness: 0.3,
            metalness: 0,
          });
          this.thickness = thickness * 2;
        } else {
          mchild.material = paperMaterial!;
        }
      }
    });
    this.add(cloned);
    this.imgPromise.then(tex => {
      let mat = this.bookObject!.material as THREE.MeshStandardMaterial;
      tex.flipY = false;
      tex.anisotropy = 2;
      mat.map = tex;
      mat.opacity = 1;
      mat.needsUpdate = true;
    }, err => {
      let mat = this.bookObject!.material as THREE.MeshStandardMaterial;
      mat.opacity = 1;
      mat.color = new THREE.Color(0xff0000);
      mat.needsUpdate = true;
    });

    console.log(this.thickness);
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
