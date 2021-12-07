import { DirectionalLight, Mesh, MeshStandardMaterial } from 'three/build/three.module';
import { Color } from 'three/src/math/Color.js';
import { Fog } from 'three/src/scenes/Fog.js';

import Experience from '../Experience.js';

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    this.debug.active && (this.debugFolder = this.debug.ui.addFolder('environment'));

    this.backgroundColor = '#0793DA';
    this.fogColor = '#0793DA';

    this.scene.background = new Color(this.backgroundColor);
    this.scene.fog = new Fog(this.fogColor, 3, 20);

    this.setSunLight();
    this.setEnvironmentMap();
  }

  setSunLight() {
    this.sunLight = new DirectionalLight('#ffffff', 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3, 3, -2.25);
    this.scene.add(this.sunLight);
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

    if (this.debug.active) {
      this.debugFolder.add(this.sunLight, 'intensity').name('sunLightIntensity').min(0).max(10).step(0.001);
      this.debugFolder.add(this.sunLight.position, 'x').name('sunLightX').min(-5).max(5).step(0.001);
      this.debugFolder.add(this.sunLight.position, 'y').name('sunLightY').min(-5).max(5).step(0.001);
      this.debugFolder.add(this.sunLight.position, 'z').name('sunLightZ').min(-5).max(5).step(0.001);
    }
  }
}
