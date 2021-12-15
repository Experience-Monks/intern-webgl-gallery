import { SphereGeometry, Mesh, MeshBasicMaterial, BackSide } from 'three/build/three.module';

import Experience from '../Experience.js';

export default class Background {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new SphereGeometry(30, 32, 32);
  }
  setTextures() {
    this.textures = {};
    this.textures.color = '#ffcb47';
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
