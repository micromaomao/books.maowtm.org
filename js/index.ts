import * as THREE from 'three';
import { DirectionalLightShadow, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BookRow, ready as book_ready } from './book';
import { Frame, ready as frame_ready } from "./frames";
import { getBookList } from "../books/booklist";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass";
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
  last_time: number;
  composer: EffectComposer;

  fov = 75;

  debug_controls: OrbitControls | null;

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
    this.composer = new EffectComposer(this.renderer);

    this.handleResize();
    window.addEventListener("resize", this.handleResize.bind(this));

    let ambient = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambient);
    let dir = new THREE.DirectionalLight(0xffffff, 0.5);
    dir.castShadow = true;
    dir.shadow.mapSize.set(2048, 2048);
    dir.shadow.normalBias = 0.01;
    dir.position.set(1, 5, 3);
    this.scene.add(dir);

    let f = new Frame();
    this.scene.add(f);

    let bs = new BookRow(getBookList()["Haruhi Suzumiya"]);
    this.scene.add(bs);

    this.camera.position.set(1, 1, 3);
    this.camera.lookAt(new Vector3(1, 0.5, 0));

    this.debug_controls = new OrbitControls(this.camera, this.canvas);
    this.debug_controls.target = new Vector3(1, 0.5, 0);
    this.debug_controls.update();

    // this.scene.add(new THREE.DirectionalLightHelper(dir, 0.8));
    // this.scene.add(new THREE.CameraHelper(dir.shadow.camera));

    this.last_time = Date.now() - 1;
    this.render();
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
    let now = Date.now();
    let delta = (now - this.last_time) / 1000;
    this.last_time = now;

    if (this.debug_controls) {
      this.debug_controls.update();
    }

    // this.composer.render(delta);
    this.renderer.render(this.scene, this.camera);
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
