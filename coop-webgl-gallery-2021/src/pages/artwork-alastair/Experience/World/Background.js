import { SphereGeometry, Mesh, MeshStandardMaterial, BackSide } from 'three/build/three.module';

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
    this.textures.color = '#ffffff';
  }
  setMaterial() {
    this.material = new MeshStandardMaterial({
      ...this.textures,
      side: BackSide
    });
  }
  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }
}
