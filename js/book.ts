import * as THREE from 'three';
import { Mesh, MeshStandardMaterial, Object3D, Texture, TextureLoader, Vector3 } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const bookglb: string = require("url:../models/book.gltf");
const bookshelfglb: string = require("url:../models/bookshelf.gltf");
const meshLoader = new GLTFLoader();
const textureLoader = new TextureLoader();
let bookModel: GLTF | null = null;
let bookshelfModel: GLTF | null = null;
let paperMaterial: MeshStandardMaterial | null = null;

const MESHNAME_BOOK = "book";
const MESHNAME_PAPER = "paper";
const EDGE_CUTOFF_X = 0.088;


export class BookObject extends THREE.Object3D {
  imgPromise: Promise<Texture>;
  bookObject: Mesh | null;
  /**
   * x length
   */
  thickness: number = 0;
  /**
   * z length
   */
  width: number = 0;
  /**
   * y length
   */
  height: number = 0;
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
      // child.castShadow = true;
      child.receiveShadow = true;
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

    this.height = 1.5 * zscale;
    this.width = yscale;
  }
}

export class BookShelf extends Object3D {
  books: BookObject[] = [];

  static generateColor(): number {
    let r = Math.floor(Math.random() * (256 - 70)) + 70;
    let g = Math.floor(Math.random() * (256 - 70)) + 70;
    let b = Math.floor(Math.random() * (256 - 70)) + 70;
    return r << 16 | g << 8 | b;
  }

  constructor(books: BookObject[]) {
    super();
    this.books = books;
    if (bookshelfModel === null) {
      throw new Error("await book.ready first.");
    }
    let cloned = bookshelfModel.scene.clone(true);
    let bs = cloned.children[0] as Mesh;
    bs.material = new THREE.MeshStandardMaterial({
      color: BookShelf.generateColor(),
      roughness: 0.9,
    });
    bs.castShadow = true;
    bs.receiveShadow = true;
    this.add(bs);

    let xx = 0;
    for (let b of books.reverse()) {
      this.add(b);
      b.position.setX(xx);
      b.position.add(new Vector3(b.thickness / 2, b.height / 2, b.width / 2 - 0.7));
      xx += b.thickness + 0.007;
    }
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

const loadBookshelf = new Promise((resolve, reject) => {
  meshLoader.load(bookshelfglb, gltf => {
    bookshelfModel = gltf;
    resolve(null);
  }, undefined, err => {
    reject(new Error(`Failed to load bookshelf.glb: ${err}`));
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

export const ready = Promise.all([loadMesh, loadPaperMaterial, loadBookshelf]);
