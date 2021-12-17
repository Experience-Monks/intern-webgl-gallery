import { PlaneGeometry, ShaderMaterial, Mesh } from 'three/build/three.module';

import { gsap } from 'gsap';

import Experience from '../Experience.js';

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
      vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
      fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
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
