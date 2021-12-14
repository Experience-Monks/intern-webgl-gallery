import {
  /*  DirectionalLight, */ PointLight,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry
} from 'three/build/three.module';
// import { Color } from 'three/src/math/Color.js';
// import { Fog } from 'three/src/scenes/Fog.js';

import Experience from '../Experience.js';

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    this.debug.active && (this.debugFolder = this.debug.ui.addFolder('environment'));

    // this.backgroundColor = '#000000';
    this.fogColor = '#8789c0';

    // this.scene.background = new Color(this.backgroundColor);
    // this.scene.fog = new Fog(this.fogColor, 20, 40);

    // this.setPointLight(6, 8, 0);
    // this.setPointLight(-6, 8, 0);
    this.setEnvironmentMap();
  }

  setPointLight(x, y, z) {
    this.pointLight = new PointLight(0xffee88, 1, 100, 2);
    const bulbGeometry = new SphereGeometry(0.5, 16, 8);
    const bulbMat = new MeshStandardMaterial({
      emissive: 0xffffee,
      emissiveIntensity: 1,
      color: 0x000000
    });
    this.pointLight.add(new Mesh(bulbGeometry, bulbMat));
    this.pointLight.position.set(x, y, z);
    this.pointLight.intensity = 150;
    this.scene.add(this.pointLight);
  }

  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = 0.4;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;

    this.scene.environment = this.environmentMap.texture;

    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };

    this.environmentMap.updateMaterials();

    // if (this.debug.active) {
    //   this.debugFolder.add(this.sunLight, 'intensity').name('sunLightIntensity').min(0).max(10).step(0.001);
    //   this.debugFolder.add(this.sunLight.position, 'x').name('sunLightX').min(-5).max(5).step(0.001);
    //   this.debugFolder.add(this.sunLight.position, 'y').name('sunLightY').min(-5).max(5).step(0.001);
    //   this.debugFolder.add(this.sunLight.position, 'z').name('sunLightZ').min(-5).max(5).step(0.001);
    // }
  }
}
