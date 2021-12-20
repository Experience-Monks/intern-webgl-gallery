import { PlaneGeometry, ShaderMaterial, Mesh } from 'three';

import { gsap } from 'gsap';

import Experience from '../Experience.js';

import vertexShader from './shaders/loading/vertex.glsl.js';
import fragmentShader from './shaders/loading/fragment.glsl.js';

export default class LoadingScreen {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();

    this.resources.on('ready', () => {
      gsap.to(this.material.uniforms.uAlpha, { duration: 3, value: 0 });
    });
  }

  setGeometry() {
    this.geometry = new PlaneGeometry(2, 2, 1, 1);
  }
  setTextures() {
    this.textures = {
      uniforms: {
        uAlpha: { value: 1 }
      },
      vertexShader,
      fragmentShader
    };
  }

  setMaterial() {
    this.material = new ShaderMaterial({ ...this.textures, transparent: true });
  }
  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }
}
