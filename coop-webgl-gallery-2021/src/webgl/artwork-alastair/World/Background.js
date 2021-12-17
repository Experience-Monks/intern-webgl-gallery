import { SphereGeometry, Mesh, MeshBasicMaterial, BackSide } from 'three';

import Experience from '../Experience.js';

import data from '../data.json';

export default class Background {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.data = data;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new SphereGeometry(...this.data.sizes.background);
  }
  setTextures() {
    this.textures = {};
    this.textures.color = this.data.colors.background;
  }
  setMaterial() {
    this.material = new MeshBasicMaterial({
      ...this.textures,
      side: BackSide
    });
  }
  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }
}
