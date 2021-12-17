import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { Vector3 } from 'three/src/math/Vector3.js';

import data from './data.json';

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
        this.controls.enabled = false;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyC') {
        this.controls.enabled = true;
      }
    });

    this.rotateToggleEventHandler = this.#rotateToggleEvent.bind(this);
    this.rotateToggleButton = document.getElementById('rotate-toggle');
    this.rotateToggleButton.addEventListener('click', this.rotateToggleEventHandler);
  }

  setInstance() {
    this.instance = new PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 10000);
    this.instance.position.set(10, 2, 16);
    this.scene.add(this.instance);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.target = new Vector3(0, 5, 0);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.screenSpacePanning = false;
    this.controls.maxPolarAngle = Math.PI / 1.8;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 22;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 2.0;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  #rotateToggleEvent() {
    this.controls.autoRotate = !this.controls.autoRotate;
    this.rotateToggleButton.style.background = this.controls.autoRotate
      ? data.colors.activeButton
      : data.colors.inactiveButton;
    this.rotateToggleButton.style.color = this.controls.autoRotate ? data.colors.activeText : data.colors.inactiveText;
    this.rotateToggleButton.innerHTML = this.controls.autoRotate
      ? data.buttons.autoRotateOn
      : data.buttons.autoRotateOff;
  }

  update() {
    this.controls.update();
  }
}
