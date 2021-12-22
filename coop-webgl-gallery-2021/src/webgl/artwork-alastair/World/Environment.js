import { SpotLight, Mesh, MeshStandardMaterial, SphereGeometry, Fog } from 'three';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';

import Experience from '../Experience.js';

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    this.debug.active && (this.debugFolder = this.debug.ui.addFolder('environment'));

    this.fogColor = '#436575';

    this.scene.fog = new Fog(this.fogColor, 10, 40);

    this.setSpotLight(7, 10, 0);
    this.setStudioModel();
    this.setEnvironmentMap();
  }

  setSpotLight(x, y, z) {
    this.spotLight = new SpotLight(0xffee88);
    const bulbGeometry = new SphereGeometry(0.15, 16, 8);
    const bulbMat = new MeshStandardMaterial({
      emissive: 0xffffff,
      emissiveIntensity: 1,
      color: 0x000000
    });
    this.spotLight.add(new Mesh(bulbGeometry, bulbMat));
    this.spotLight.position.set(x, y, z);
    this.spotLight.distance = 40;
    this.spotLight.decay = 1.5;
    this.spotLight.angle = Math.PI / 4;
    this.spotLight.penumbra = 0.5;
    this.spotLight.intensity = 150;
    this.setLensflare();
    this.scene.add(this.spotLight);
  }

  setStudioModel() {
    this.studioModel = this.resources.items.studioLights.children.filter((obj) => obj.name === 'spot_light')[0];

    this.studioModel.scale.set(0.145, 0.145, 0.145);
    this.studioModel.position.set(8, 7.4, 0);
    this.studioModel.rotation.set(0, -Math.PI * 0.5, 0);

    this.scene.add(this.studioModel);
  }

  setLensflare() {
    const lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(this.resources.items.lensflare0, 700, 0, this.spotLight.color));
    lensflare.addElement(new LensflareElement(this.resources.items.lensflare1, 60, 0.6));
    lensflare.addElement(new LensflareElement(this.resources.items.lensflare1, 70, 0.7));
    lensflare.addElement(new LensflareElement(this.resources.items.lensflare1, 120, 0.9));
    lensflare.addElement(new LensflareElement(this.resources.items.lensflare1, 70, 1));
    this.spotLight.add(lensflare);
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
  }
}
