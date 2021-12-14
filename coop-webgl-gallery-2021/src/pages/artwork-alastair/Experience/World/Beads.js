import {
  PlaneGeometry,
  BoxGeometry,
  SphereGeometry,
  ShaderMaterial,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  MeshBasicMaterial,
  DynamicDrawUsage
  // Raycaster
} from 'three/build/three.module';

import { Vector2 } from 'three/src/math/Vector2.js';
import { Matrix4 } from 'three/src/math/Matrix4.js';
import { Color } from 'three/src/math/Color.js';
import { BufferAttribute } from 'three/src/core/BufferAttribute.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

import Experience from '../Experience.js';

import beadVertexShader from './shaders/beads/vertex.glsl.js';
import beadFragmentShader from './shaders/beads/fragment.glsl.js';

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
    this.physics = this.experience.physics;
    this.vertices = [];
    this.matrix = new Matrix4();
    this.color = new Color();
    // this.raycaster = new Raycaster();
    this.mouse = new Vector2(1, 1);
    this.index = 0;
    console.log(this.camera);

    this.debug.active && (this.debugFolder = this.debug.ui.addFolder('beads'));

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.createMesh(this.resources.items.handModel, 1, 0.1);

    //===== EVENT LISTENERS =====

    // Desktop
    this.setDragControls();
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyC') {
        this.dragControls.activate();
      }

      if (e.code === 'KeyB') {
        this.createMesh(this.resources.items.handModel, 0.5, 0.1);
      }

      if (e.code === 'KeyR') {
        for (const object of this.objects) {
          this.scene.remove(object);
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyC') {
        this.dragControls.deactivate();
      }
    });

    const createMeshButton = document.getElementById('create-mesh');
    createMeshButton.addEventListener('click', () => {
      this.createMesh(this.resources.items.handModel, 0.5, 0.1);
    });

    const resetMeshButton = document.getElementById('reset-mesh');
    resetMeshButton.addEventListener('click', () => {
      this.dragControls.dispose();
      for (const object of this.objects) {
        this.scene.remove(object);
      }
      this.objects = [];
      this.setDragControls();
    });

    document.addEventListener('mousemove', (event) => {
      // event.preventDefault();

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }

  setGeometry() {
    this.boxGeometry = new BoxGeometry(1, 1, 1, 12, 12, 12);
    this.boxGeometry.deleteAttribute('normal');
    this.boxGeometry.deleteAttribute('uv');
    this.planeGeometry = new PlaneGeometry(2, 2, 25, 25);
    this.sphereGeometry = new SphereGeometry(1, 32, 32);
  }

  setMaterial() {
    this.shaderMaterial = new ShaderMaterial({
      uniforms: {
        color: { value: new Color(0xffffff) },
        pointTexture: { value: this.resources.items.beadParticle }
      },
      vertexShader: beadVertexShader,
      fragmentShader: beadFragmentShader,
      transparent: true
    });

    this.material = new MeshStandardMaterial({
      color: 0x804d71,
      metalness: 1.0,
      roughness: 0.0
    });
  }

  createSphere() {
    console.log(this.physics);
    const mesh = new Mesh(this.sphereGeometry, this.material);
    mesh.position.y = 5;
    mesh.castShadow = true;
    this.scene.add(mesh);
    this.objects.push(mesh);
    this.physics.addMesh(mesh, 1);
  }

  combineBuffer(model, bufferName) {
    let count = 0;

    model.traverse(function (child) {
      if (child.isMesh) {
        const buffer = child.geometry.attributes[bufferName];

        count += buffer.array.length;
      }
    });

    const combined = new Float32Array(count);

    let offset = 0;

    model.traverse(function (child) {
      if (child.isMesh) {
        const buffer = child.geometry.attributes[bufferName];

        combined.set(buffer.array, offset);
        offset += buffer.array.length;
      }
    });

    return new BufferAttribute(combined, 3);
  }

  createMesh(model, scale = 0.15, beadScale = 0.5, beadType = 'sphere') {
    const positions = this.combineBuffer(model, 'position');

    // ===== VERTICES =====
    const vertices = [];
    for (let i = 0; i < positions.array.length; i += 3) {
      vertices.push([positions.array[i], positions.array[i + 1], positions.array[i + 2]]);
    }

    let geometry;

    if (beadType === 'box') {
      geometry = new BoxGeometry(beadScale, beadScale, beadScale);
    } else {
      geometry = new SphereGeometry(beadScale, 10, 10);
    }

    this.mesh = new InstancedMesh(geometry, new MeshBasicMaterial() /* this.material */, vertices.length);
    this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);

    const matrix = new Matrix4();
    const color = new Color();
    let lowestVertexY = 0;
    let highestVertexY = 0;

    for (let i = 0; i < vertices.length; i++) {
      this.mesh.setMatrixAt(i, matrix.setPosition(vertices[i][0], 0.5, vertices[i][2]));
      if (i !== 0 && vertices[i][1] < lowestVertexY) {
        lowestVertexY = vertices[i][1];
      }

      if (i !== 0 && vertices[i][1] > highestVertexY) {
        highestVertexY = vertices[i][1];
      }
      this.mesh.setColorAt(i, color.setHex(0xffffff * Math.random()));
    }

    console.log(lowestVertexY);
    console.log(highestVertexY);
    const vertexDifference = highestVertexY - lowestVertexY;
    console.log(vertexDifference);
    const positionY = scale * (vertexDifference / 2);
    console.log(positionY);
    // this.physics.addMesh(this.mesh, 1);

    console.log({ vertices: vertices.length });
    this.vertices = vertices;

    this.mesh.scale.set(scale, scale, scale);
    this.mesh.position.set(0, scale * (vertexDifference / 2), 0);
    this.scene.add(this.mesh);
    this.objects.push(this.mesh);
  }

  setMesh() {
    //===== DEBUG =====
    if (this.debug.active) {
      const debugObject = {
        Sphere: () => {
          this.createSphere();
        },
        Mandalorian: () => {
          this.createMesh(this.resources.items.mandalorianModel);
        },
        CoffeeMug: () => {
          this.createMesh(this.resources.items.coffeeMugModel);
        },
        CustomMesh: () => {
          this.createMesh(this.resources.items.handModel, 1, 0.1, 'box');
        },
        Reset: () => {
          this.dragControls.dispose();
          for (const object of this.objects) {
            this.scene.remove(object);
          }
          this.objects = [];

          //====
          // Need to handle the reset of Oimo objects
          //====
          this.setDragControls();
        }
      };
      this.debugFolder.add(debugObject, 'Sphere');
      this.debugFolder.add(debugObject, 'Mandalorian');
      this.debugFolder.add(debugObject, 'CoffeeMug');
      this.debugFolder.add(debugObject, 'CustomMesh');
      this.debugFolder.add(debugObject, 'Reset');
    }
  }

  setDragControls() {
    this.dragControls = new DragControls(this.objects, this.camera.instance, this.canvas);
    this.dragControls.deactivate();
  }

  setAnimation() {
    //===== ANIMATIONS ======
    this.animation = {};

    this.animation.play = (name) => {
      console.log('playing animation');
    };
    this.animation.pause = (name) => {
      console.log('pausing animation');
    };

    //===== DEBUG =====
    if (this.debug.active) {
      const debugObject = {
        playAnimation: () => {
          this.animation.play();
        },
        pauseAnimation: () => {
          this.animation.pause();
        }
      };
      this.debugFolder.add(debugObject, 'playAnimation');
      this.debugFolder.add(debugObject, 'pauseAnimation');
    }
  }

  onMouseMove(event) {}

  update() {
    const matrix = new Matrix4();
    // this.raycaster.setFromCamera(this.mouse, this.camera.instance);
    // const intersection = this.raycaster.intersectObject(this.mesh);

    // if (intersection.length > 0) {
    //   const instanceId = intersection[0].instanceId;
    //   const position = intersection[0].point;

    //   this.mesh.setMatrixAt(instanceId, matrix.setPosition(position.x, (position.y -= 0.05), position.z));
    //   this.mesh.instanceMatrix.needsUpdate = true;

    //   // this.mesh.setColorAt(instanceId, new Color().setHex(Math.random() * 0xffffff));
    // }

    // Timed Animation
    // const condition = this.time.elapsed % 2 === 0;

    if (this.index < this.vertices.length) {
      this.mesh.setMatrixAt(this.index, matrix.setPosition(...this.vertices[this.index]));
      this.mesh.instanceMatrix.needsUpdate = true;

      this.index++;
    }
  }
}
