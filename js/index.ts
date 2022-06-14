import * as THREE from 'three';
import { Euler, Quaternion, Raycaster, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BookRow, ready as book_ready, allBookHitboxes, BookHitbox, BookObject } from './book';
import { Frame, ready as frame_ready } from "./frames";
import { getBookList } from "../books/booklist";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

const dom_ready = new Promise((resolve) => {
  document.addEventListener("DOMContentLoaded", evt => {
    resolve(null);
  });
});

const loading_promise = Promise.all([
  book_ready,
  frame_ready,
  dom_ready
]);

class BooksApp {
  canvas: HTMLCanvasElement;
  pixelWidth: number;
  pixelHeight: number;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  clock: THREE.Clock;
  updateHandlers: ((delta: number) => void)[] = [];
  raycaster: Raycaster;

  currently_viewing: BookObject | null = null;

  fov = 75;

  debug_controls: OrbitControls | null;

  rotating_book: boolean = false;
  lastMouseX: number = 0;
  lastMouseY: number = 0;

  cameraTargetPos: Vector3;
  dragging_camera: boolean = false;

  constructor(canvasElem: HTMLCanvasElement) {
    this.pixelWidth = window.innerWidth;
    this.pixelHeight = window.innerHeight;
    this.canvas = canvasElem;
    this.canvas.width = this.pixelWidth;
    this.canvas.height = this.pixelHeight;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaaaaaa);
    this.camera = new THREE.PerspectiveCamera(this.fov, 1, 0.001, 1000);
    this.scene.add(this.camera);

    this.handleResize();
    window.addEventListener("resize", this.handleResize.bind(this));

    let ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambient);
    let dir = new THREE.DirectionalLight(0xffffff, 0.5);
    dir.castShadow = true;
    dir.shadow.mapSize.set(2048, 2048);
    dir.shadow.normalBias = 0.01;
    dir.position.set(1, 5, 3);
    this.scene.add(dir);

    let f = new Frame();
    this.scene.add(f);
    this.updateHandlers.push(f.update.bind(f));

    let bs = new BookRow(getBookList()["Haruhi Suzumiya"]);
    this.scene.add(bs);
    this.updateHandlers.push(bs.update.bind(bs));

    this.cameraTargetPos = new Vector3(1, 2, 3);
    this.camera.position.copy(this.cameraTargetPos);
    this.camera.lookAt(new Vector3(1, -0, 0));

    // this.debug_controls = new OrbitControls(this.camera, this.canvas);
    // this.debug_controls.target = new Vector3(1, 0.5, 0);
    // this.debug_controls.enableDamping = true;
    // this.debug_controls.enableRotate = false;
    // this.debug_controls.update();

    // this.scene.add(new THREE.DirectionalLightHelper(dir, 0.8));
    // this.scene.add(new THREE.CameraHelper(dir.shadow.camera));

    this.clock = new THREE.Clock(true);
    this.render();

    this.raycaster = new Raycaster();
    this.canvas.addEventListener("mousemove", this.handleMove.bind(this));
    this.canvas.addEventListener("touchmove", this.handleMove.bind(this))
    this.canvas.addEventListener("mousedown", this.handleDown.bind(this));
    this.canvas.addEventListener("touchstart", this.handleDown.bind(this));
    window.addEventListener("mouseup", this.handleUp.bind(this));
    window.addEventListener("touchend", this.handleUp.bind(this));
    window.addEventListener("touchcancel", this.handleUp.bind(this));
  }

  handleResize() {
    this.pixelWidth = window.innerWidth;
    this.pixelHeight = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // Don't update style, because canvas should always be 100vw/vh
    this.renderer.setSize(this.pixelWidth, this.pixelHeight, false);
    this.camera.aspect = this.pixelWidth / this.pixelHeight;
    this.camera.updateProjectionMatrix();
  }

  render() {
    let delta = this.clock.getDelta();

    if (this.debug_controls) {
      this.debug_controls.update();
    }

    for (let uh of this.updateHandlers) {
      uh(delta);
    }

    if (this.currently_viewing && !this.rotating_book) {
      this.currently_viewing.overlayRotation.premultiply(new Quaternion().setFromEuler(new Euler(0, delta * Math.PI / 180 * 20, 0, "XYZ")));
    }

    let targetCamPos = this.cameraTargetPos.clone();
    if (this.currently_viewing) {
      targetCamPos.add(new Vector3(0, 0.5, 0.8));
    }
    this.camera.position.lerp(targetCamPos, 10 * delta);

    // this.composer.render(delta);
    this.renderer.render(this.scene, this.camera);
  }

  raycastBooks(x: number, y: number): BookObject | null {
    this.raycaster.setFromCamera({ x, y }, this.camera);
    let res = this.raycaster.intersectObjects(allBookHitboxes, false);
    if (res.length > 0) {
      let obj = res[0].object;
      if (obj instanceof BookHitbox) {
        return obj.book;
      }
    }
    return null;
  }

  getCoordsFromEvent(evt: MouseEvent | TouchEvent): { x: number, y: number } | null {
    evt.preventDefault();
    let x: number, y: number;
    if (evt instanceof MouseEvent) {
      x = evt.clientX / this.pixelWidth * 2 - 1;
      y = -(evt.clientY / this.pixelHeight * 2 - 1);
    } else if (evt.touches.length === 1) {
      x = evt.touches[0].clientX / this.pixelWidth * 2 - 1;
      y = -(evt.touches[0].clientY / this.pixelHeight * 2 - 1);
    } else {
      return null;
    }
    return { x, y };
  }

  handleMove(evt: MouseEvent | TouchEvent) {
    let coords = this.getCoordsFromEvent(evt);
    if (!coords) {
      return;
    }
    let { x, y } = coords;
    this.canvas.style.cursor = "auto";
    let deltaX = x - this.lastMouseX;
    let deltaY = y - this.lastMouseY;
    this.lastMouseX = x;
    this.lastMouseY = y;

    if (this.rotating_book) {
      if (this.currently_viewing) {
        let rot = new Euler(0, 0, 0, "YXZ");
        let factor = 3;
        rot.y += deltaX * factor;
        rot.z += deltaY * factor;
        this.currently_viewing.overlayRotation.premultiply(new Quaternion().setFromEuler(rot));
      }
      return;
    }
    if (this.dragging_camera) {
      this.cameraTargetPos.add(new Vector3(deltaX, deltaY, 0).multiplyScalar(-3));
      if (this.cameraTargetPos.y > 2.5) {
        this.cameraTargetPos.setY(2.5);
      }
      if (this.cameraTargetPos.y < -3) {
        this.cameraTargetPos.setY(-3);
      }
      if (this.cameraTargetPos.x > 10) {
        this.cameraTargetPos.setX(10);
      }
      if (this.cameraTargetPos.x < -1) {
        this.cameraTargetPos.setX(-1);
      }
      return;
    }

    if (this.currently_viewing) {
      return;
    }

    for (let b of allBookHitboxes) {
      b.book.hovered = false;
    }
    let b = this.raycastBooks(x, y);
    if (b) {
      b.hovered = true;
      this.canvas.style.cursor = "pointer";
    }
  }

  handleDown(evt: MouseEvent | TouchEvent) {
    let coords = this.getCoordsFromEvent(evt);
    if (!coords) {
      return;
    }
    let { x, y } = coords;
    this.lastMouseX = x;
    this.lastMouseY = y;

    if (this.currently_viewing) {
      if (x > 0) {
        this.clearCurrentlyViewing();
      } else {
        this.rotating_book = true;
        if (this.debug_controls) {
          this.debug_controls.enabled = false;
        }
      }
      return;
    }

    let b = this.raycastBooks(x, y);
    if (b) {
      this.viewBook(b);
    } else {
      this.dragging_camera = true;
    }
  }

  handleUp() {
    this.rotating_book = false;
    this.dragging_camera = false;
    if (this.debug_controls) {
      this.debug_controls.enabled = true;
    }
  }

  viewBook(book: BookObject) {
    if (this.currently_viewing === book) {
      return;
    }
    if (this.currently_viewing) {
      this.clearCurrentlyViewing();
    }
    this.currently_viewing = book;
    let campos = this.cameraTargetPos;
    book.transformToFront(
      new Vector3(campos.x - (this.pixelWidth / this.pixelHeight) * 0.7, campos.y - 0.5, 2.2),
      new Euler(-Math.PI * 20 / 180, -Math.PI / 2, 0));
  }

  clearCurrentlyViewing() {
    if (this.currently_viewing) {
      this.currently_viewing.transformBack();
    }
    this.currently_viewing = null;
  }
}

function init() {
  let canvas = document.getElementById("scene") as HTMLCanvasElement;
  let app;
  try {
    app = new BooksApp(canvas);
    app.render();
  } catch (e) {
    console.error(e);
    alert(`Error: ${e.message}`);
    return;
  }

  function renderLoop() {
    requestAnimationFrame(renderLoop);
    app.render();
  }
  renderLoop();
}

loading_promise.then(() => {
  init();
});
