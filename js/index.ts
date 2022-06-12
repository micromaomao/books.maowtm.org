import * as THREE from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
import { BookObject, ready as book_ready } from './book';

const dom_ready = new Promise((resolve) => {
  document.addEventListener("DOMContentLoaded", evt => {
    resolve(null);
  });
});

const loading_promise = Promise.all([
  book_ready,
  dom_ready
]);

class BooksApp {
  canvas: HTMLCanvasElement;
  pixelWidth: number;
  pixelHeight: number;
  threeRenderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  last_time: number;

  fov = 75;

  debug_controls: FlyControls | null;

  constructor(canvasElem: HTMLCanvasElement) {
    this.canvas = canvasElem;
    this.threeRenderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(this.fov, 1, 0.001, 1000);
    this.scene.add(this.camera);
    this.handleResize();
    window.addEventListener("resize", this.handleResize.bind(this));

    let ambient = new THREE.AmbientLight(0xaaaaaa, 1);
    this.scene.add(ambient);

    let testBook = new BookObject();
    this.scene.add(testBook);

    this.camera.position.set(0, 0, 3);
    this.camera.lookAt(testBook.position);

    this.debug_controls = new FlyControls(this.camera, this.canvas);
    this.debug_controls.dragToLook = true;
    this.debug_controls.rollSpeed = 0.4;
    this.debug_controls.movementSpeed = 3;

    this.last_time = Date.now() - 1;
    this.render();
  }

  handleResize() {
    this.pixelWidth = window.innerWidth * window.devicePixelRatio;
    this.pixelHeight = window.innerHeight * window.devicePixelRatio;
    this.threeRenderer.setSize(this.pixelWidth, this.pixelHeight);
    this.camera.aspect = this.pixelWidth / this.pixelHeight;
    this.camera.updateProjectionMatrix();
  }

  render() {
    let now = Date.now();
    let delta = (now - this.last_time) / 1000;
    this.last_time = now;

    if (this.debug_controls) {
      this.debug_controls.update(delta);
    }

    this.threeRenderer.render(this.scene, this.camera);
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
