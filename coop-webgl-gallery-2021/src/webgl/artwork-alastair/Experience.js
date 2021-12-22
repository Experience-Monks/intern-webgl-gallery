import { Scene, Mesh } from 'three';

import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import Camera from './Camera.js';
import Renderer from './Renderer';
import World from './World/World';
import Resources from './Utils/Resources';
import Debug from './Utils/Debug';

import sources from './sources.js';

let instance = null;

export default class Experience {
  constructor(_canvas, reset = false) {
    if (instance && reset === false) {
      return instance;
    }

    instance = this;

    document.getElementById('controls-container').style.opacity = 0;
    document.getElementById('hide-controls').style.opacity = 0;

    this.canvas = _canvas;
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    this.sizes.on('resize', () => {
      this.resize();
    });

    this.time.on('tick', () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  destroy() {
    this.sizes.off('resize');
    this.time.off('tick');

    this.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];
          if (value && typeof value.dispose === 'function') {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if (this.debug.active) {
      this.debug.ui.destroy();
    }
  }
}
