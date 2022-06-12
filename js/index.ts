import * as THREE from 'three';
import { Vector3 } from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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

  debug_controls: OrbitControls | null;

  constructor(canvasElem: HTMLCanvasElement) {
    this.canvas = canvasElem;
    this.threeRenderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaaaaaa);
    this.camera = new THREE.PerspectiveCamera(this.fov, 1, 0.001, 1000);
    this.scene.add(this.camera);
    this.handleResize();
    window.addEventListener("resize", this.handleResize.bind(this));

    let ambient = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambient);

    let xx = 0;
    for (let i = 0; i < 100; i ++) {
      let testBook = new BookObject(require("url:../books/img/haruhi-1.png"), 0.5, 1, 1);
      testBook.position.setX(xx);
      xx += testBook.thickness + 0.002;
      this.scene.add(testBook);
    }

    this.camera.position.set(0, 0, 3);
    this.camera.lookAt(new Vector3(0, 0, 0));

    this.debug_controls = new OrbitControls(this.camera, this.canvas);
    this.debug_controls.update();

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
      this.debug_controls.update();
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
