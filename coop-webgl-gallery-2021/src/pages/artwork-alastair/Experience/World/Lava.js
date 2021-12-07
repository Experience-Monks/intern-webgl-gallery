import {
  PlaneGeometry,
  BoxGeometry,
  SphereGeometry,
  Mesh,
  ShaderMaterial,
  RepeatWrapping
} from 'three/build/three.module';

import { DragControls } from 'three/examples/jsm/controls/DragControls';

import { Vector2 } from 'three/src/math/Vector2.js';
import { Vector3 } from 'three/src/math/Vector3.js';

import Experience from '../Experience.js';

import lavaVertexShader from './shaders/lava/vertex.glsl.js';
import lavaFragmentShader from './shaders/lava/fragment.glsl.js';

export default class Beads {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.objects = [];

    this.debug.active && (this.debugFolder = this.debug.ui.addFolder('lava'));

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.boxGeometry = new BoxGeometry(1, 1, 1, 12, 12, 12);
    this.planeGeometry = new PlaneGeometry(2, 2, 256, 256);
    this.sphereGeometry = new SphereGeometry(1, 32, 32);
  }

  setMaterial() {
    const uniforms = {
      fogDensity: { value: 0.45 },
      fogColor: { value: new Vector3(0, 0, 0) },
      time: { value: 1.0 },
      uvScale: { value: new Vector2(3.0, 1.0) },
      texture1: { value: this.resources.items.lavaCloudTexture },
      texture2: { value: this.resources.items.lavaTexture }
    };

    uniforms['texture1'].value.wrapS = uniforms['texture1'].value.wrapT = RepeatWrapping;
    uniforms['texture2'].value.wrapS = uniforms['texture2'].value.wrapT = RepeatWrapping;

    // Lava
    this.material = new ShaderMaterial({
      uniforms,
      vertexShader: lavaVertexShader,
      fragmentShader: lavaFragmentShader
    });
  }

  //===== Objects =====
  createBox() {
    const mesh = new Mesh(this.boxGeometry, this.material);
    mesh.position.y = 1;
    mesh.castShadow = true;
    this.scene.add(mesh);
    this.objects.push(mesh);
  }

  createPlane() {
    const mesh = new Mesh(this.planeGeometry, this.material);
    mesh.rotation.x = -Math.PI * 0.5;
    mesh.position.y = 1;
    mesh.castShadow = true;
    this.scene.add(mesh);
    this.objects.push(mesh);
  }

  createSphere() {
    const mesh = new Mesh(this.sphereGeometry, this.material);
    mesh.position.y = 1;
    mesh.castShadow = true;
    this.scene.add(mesh);
    this.objects.push(mesh);
  }

  setMesh() {
    //===== DEBUG =====
    if (this.debug.active) {
      const debugObject = {
        Box: () => {
          this.createBox();
          console.log(this.objects);
        },
        Plane: () => {
          this.createPlane();
          console.log(this.objects);
        },
        Sphere: () => {
          this.createSphere();
          console.log(this.objects);
        },
        Reset: () => {
          for (const object of this.objects) {
            this.scene.remove(object);
          }
          this.objects = [];
          console.log(this.objects);
        }
      };
      this.debugFolder.add(debugObject, 'Box');
      this.debugFolder.add(debugObject, 'Plane');
      this.debugFolder.add(debugObject, 'Sphere');
      this.debugFolder.add(debugObject, 'Reset');
    }
  }

  setDragControls() {
    this.dragControls = new DragControls([this.mesh], this.camera.instance, this.canvas);
  }

  update() {
    //===== MATERIAL MOVEMENT =====
    // Placeholder
  }
}
