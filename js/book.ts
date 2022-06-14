import * as THREE from 'three';
import { BoxGeometry, Euler, Matrix4, Mesh, MeshStandardMaterial, Object3D, Quaternion, Texture, TextureLoader, Vector3 } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadModel } from "./utils"

const textureLoader = new TextureLoader();
let bookModel: GLTF | null = null;
let paperMaterial: MeshStandardMaterial | null = null;

const MESHNAME_BOOK = "book";
const MESHNAME_PAPER = "paper";
const EDGE_CUTOFF_X = 0.088;

const HITBOX_YMARGIN = 0.03;
const RAISE = 0.1;

const TRANSFORM_SPEED = 3;

const hitboxMaterial = new THREE.SpriteMaterial({
  visible: false
});

export const allBookHitboxes: BookHitbox[] = [];

export class BookHitbox extends THREE.Mesh {
  book: BookObject;
  constructor(book: BookObject) {
    super(new BoxGeometry(book.thickness, book.height + HITBOX_YMARGIN, book.width), hitboxMaterial);
    this.book = book;
    this.position.setY(HITBOX_YMARGIN / 2);
  }
}

export class BookObject extends THREE.Object3D {
  imgPromise: Promise<Texture>;
  bookMesh: Object3D;
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
  hitbox: BookHitbox;
  hovered: boolean = false;

  savedTransformMatrix: Matrix4 | null = null;
  transformFn: ((p: number) => void) | null = null;
  transformFrontTime: number = 0;
  transformingBack: boolean = false;
  overlayRotation: Quaternion = new Quaternion().identity();
  constructor(imgUrl, xscale, yscale, zscale) {
    super();
    if (bookModel === null) {
      throw new Error("await book.ready first.");
    }
    this.imgPromise = new Promise((resolve, reject) => {
      textureLoader.load(imgUrl, resolve, undefined, reject);
    });
    this.bookMesh = bookModel.scene.clone(true);
    this.bookMesh.traverse(child => {
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
    this.add(this.bookMesh);
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

    this.hitbox = new BookHitbox(this);
    this.add(this.hitbox);
    allBookHitboxes.push(this.hitbox);
  }

  update(delta: number) {
    if (delta > 0.3) {
      delta = 0.3;
    }
    if (this.transformFn) {
      if (this.transformingBack) {
        this.transformFrontTime -= delta * TRANSFORM_SPEED;
        if (this.transformFrontTime <= 0) {
          this.bookMesh.matrixAutoUpdate = false;
          this.bookMesh.matrix = this.savedTransformMatrix!;
          this.savedTransformMatrix = null;
          this.transformFn = null;
          this.transformFrontTime = 0;
          this.transformingBack = false;
          this.bookMesh.updateMatrixWorld();
          this.bookMesh.matrixAutoUpdate = true;
        }
      } else {
        this.transformFrontTime += delta * TRANSFORM_SPEED;
        if (this.transformFrontTime > 1) {
          this.transformFrontTime = 1;
        }
      }
      if (this.transformFn) {
        this.transformFn(this.transformFrontTime);
      }
      return;
    }
    let mesh_y = this.bookMesh.position.y;
    let diff = (this.hovered ? RAISE : 0) - mesh_y;
    if (Math.abs(diff) > 0.1) {
      diff = Math.sign(diff) * 0.1;
    }
    if (Math.abs(diff) > 0.001 && Math.abs(diff) < 0.02) {
      diff = Math.sign(diff) * 0.02;
    }
    mesh_y += delta * 15 * diff;
    this.bookMesh.position.setY(mesh_y);
  }

  transformToFront(targetPos: Vector3, targetRot: Euler) {
    if (this.savedTransformMatrix) {
      this.bookMesh.matrixAutoUpdate = false;
      this.bookMesh.matrix.copy(this.savedTransformMatrix);
      this.bookMesh.updateMatrixWorld();
      this.savedTransformMatrix = null;
      this.transformFn = null;
    }
    this.bookMesh.updateMatrix();
    this.savedTransformMatrix = this.bookMesh.matrix.clone();
    let curr_pos = new Vector3();
    let curr_rot = new Quaternion();
    let curr_scale = new Vector3();
    this.savedTransformMatrix.decompose(curr_pos, curr_rot, curr_scale);

    this.bookMesh.matrixAutoUpdate = false;
    this.bookMesh.matrix.identity();
    this.bookMesh.updateMatrixWorld();
    let m_world = this.bookMesh.matrixWorld;
    if (m_world.determinant() === 0) {
      throw new Error("unreachable");
    }
    let target_trans = m_world.invert();
    target_trans.multiply(new Matrix4().compose(targetPos, new Quaternion().setFromEuler(targetRot), curr_scale));
    let target_pos = new Vector3();
    let target_rot = new Quaternion();
    target_trans.decompose(target_pos, target_rot, new Vector3());
    this.bookMesh.matrix.copy(this.savedTransformMatrix);
    this.bookMesh.updateMatrixWorld();

    this.overlayRotation.identity();

    this.transformFn = (p => {
      let lerp_pos = new Vector3().lerpVectors(curr_pos, target_pos, 1 - Math.pow((1 - p), 3));
      let lerp_rot = new Quaternion().slerpQuaternions(curr_rot, target_rot, Math.pow(p, 4));
      let mat = new Matrix4().compose(lerp_pos, lerp_rot, curr_scale);
      mat.multiply(new Matrix4().makeRotationFromQuaternion(
        new Quaternion().identity().slerp(this.overlayRotation, Math.pow(p, 2))
      ));
      this.bookMesh.matrix.copy(mat);
      this.bookMesh.updateMatrixWorld();
    });
    this.transformFrontTime = 0;
  }

  transformBack() {
    if (!this.savedTransformMatrix) {
      return;
    }
    if (this.transformFrontTime > 1) {
      this.transformFrontTime = 1;
    }
    this.transformingBack = true;
  }
}

export class BookRow extends Object3D {
  books: BookObject[] = [];

  constructor(books: BookObject[]) {
    super();
    this.books = books;

    let xx = 0;
    books.reverse();
    for (let b of books) {
      this.add(b);
      b.position.setX(xx);
      b.position.add(new Vector3(b.thickness / 2, b.height / 2, b.width / 2 - 0.7));
      xx += b.thickness + 0.007;
    }
    if (books.length > 0) {
      let first_book = books[0];
      first_book.rotateZ(0.03);
      first_book.position.add(new Vector3(-0.025, 0, 0));
      if (books.length > 1) {
        let second_book = books[1];
        second_book.rotateZ(0.025);
        second_book.position.add(new Vector3(-0.015, 0, 0));
        if (books.length > 2) {
          let third_book = books[2];
          third_book.rotateZ(0.015);
          third_book.position.add(new Vector3(-0.005, 0, 0));
        }
      }
    }
    for (let book of books) {
      let zoff = (Math.random() - 0.3) * 0.05;
      book.position.add(new Vector3(0, 0, zoff));
    }
  }

  update(delta: number) {
    for (let b of this.books) {
      b.update(delta);
    }
  }
}

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

export const ready = Promise.all([
  loadModel(require("url:../models/book.gltf")).then(x => bookModel = x),
  loadPaperMaterial
]);
