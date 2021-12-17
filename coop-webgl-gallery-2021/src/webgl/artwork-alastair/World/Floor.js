import { CircleGeometry, sRGBEncoding, RepeatWrapping, Mesh, MeshStandardMaterial } from 'three';

import Experience from '../Experience.js';

export default class Floor {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.physics = this.experience.physics;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new CircleGeometry(32, 64);
  }
  setTextures() {
    this.textures = {};

    this.textures.map = this.resources.items.cliffAlbedo;
    this.textures.map.encoding = sRGBEncoding;
    this.textures.map.repeat.set(1.5, 1.5);
    this.textures.map.wrapS = RepeatWrapping;
    this.textures.map.wrapT = RepeatWrapping;

    this.textures.displacementMap = this.resources.items.cliffDisplacement;
    this.textures.displacementMap.repeat.set(1.5, 1.5);
    this.textures.displacementMap.wrapS = RepeatWrapping;
    this.textures.displacementMap.wrapT = RepeatWrapping;

    this.textures.normalMap = this.resources.items.cliffNormal;
    this.textures.normalMap.repeat.set(1.5, 1.5);
    this.textures.normalMap.wrapS = RepeatWrapping;
    this.textures.normalMap.wrapT = RepeatWrapping;

    this.textures.roughnessMap = this.resources.items.cliffRoughness;
    this.textures.roughnessMap.repeat.set(1.5, 1.5);
    this.textures.roughnessMap.wrapS = RepeatWrapping;
    this.textures.roughnessMap.wrapT = RepeatWrapping;
  }
  setMaterial() {
    this.material = new MeshStandardMaterial({
      ...this.textures
    });
  }
  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }
}
