import { PerspectiveCamera } from 'three/build/three.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Experience from './Experience';

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.setInstance();
    this.setOrbitControls();

    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyC') {
        this.controls.enabled = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyC') {
        this.controls.enabled = false;
      }
    });
  }

  setInstance() {
    this.instance = new PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100);
    this.instance.position.set(3, 2, 4);
    this.scene.add(this.instance);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    this.controls.enabled = false;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
