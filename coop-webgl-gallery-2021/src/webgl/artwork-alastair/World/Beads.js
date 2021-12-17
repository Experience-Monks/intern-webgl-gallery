import {
  PlaneGeometry,
  BoxGeometry,
  SphereGeometry,
  ShaderMaterial,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  DynamicDrawUsage,
  Vector2,
  Matrix4,
  Color,
  BufferAttribute
  // Raycaster
} from 'three';
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

    this.debug.active && (this.debugFolder = this.debug.ui.addFolder('beads'));

    this.setGeometry();
    this.setMaterial();
    this.#setMesh();
    this.createMesh(this.resources.items.handModel, 0.9, 0.1);

    //===== EVENT LISTENERS =====

    // Desktop
    this.setDragControls();
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyC') {
        this.dragControls.activate();
      }

      if (e.code === 'KeyB') {
        this.createMesh(this.resources.items.handModel, 0.9, 0.1);
      }

      if (e.code === 'KeyR') {
        this.resetMesh();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyC') {
        this.dragControls.deactivate();
      }
    });

    this.buttonColor = '#eac435';
    this.buttonColorInactive = '#000000';
    this.meshEventHandler = this.#meshEvent.bind(this);
    this.createMeshButton = document.getElementById('create-mesh');

    this.resetMeshEventHandler = this.#resetMeshEvent.bind(this);
    this.resetMeshButton = document.getElementById('reset-mesh');

    this.resetMeshButton.addEventListener('click', this.resetMeshEventHandler);

    // document.addEventListener('mousemove', (event) => {
    //   this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //   this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // });
  }

  setGeometry() {
    this.boxGeometry = new BoxGeometry(1, 1, 1, 12, 12, 12);
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
    const mesh = new Mesh(this.sphereGeometry, this.material);
    mesh.position.y = 5;
    mesh.castShadow = true;
    this.scene.add(mesh);
    this.objects.push(mesh);
    // this.physics.addMesh(mesh, 1);
  }

  #combineBuffer(model, bufferName) {
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
    const positions = this.#combineBuffer(model, 'position');

    // ===== VERTICES =====
    const vertices = [];
    for (let i = 0; i < positions.array.length; i += 3) {
      vertices.push([positions.array[i], positions.array[i + 1], positions.array[i + 2]]);
    }

    // Sort the vertices array

    // vertices =
    // ----

    // Size check
    if (vertices.length > 10000) {
      console.log('Model has too many vertices (> 10000)', vertices.length);
      return;
    }

    let geometry;

    if (beadType === 'box') {
      geometry = new BoxGeometry(beadScale, beadScale, beadScale);
    } else {
      geometry = new SphereGeometry(beadScale, 10, 10);
    }

    this.mesh = new InstancedMesh(geometry, this.material, vertices.length);
    this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);

    const matrix = new Matrix4();
    const color = new Color();
    let lowestVertexY = 0;
    let highestVertexY = 0;

    for (let i = 0; i < vertices.length; i++) {
      this.mesh.setMatrixAt(i, matrix.setPosition(vertices[i][0], 0, vertices[i][2]));
      if (i !== 0 && vertices[i][1] < lowestVertexY) {
        lowestVertexY = vertices[i][1];
      }

      if (i !== 0 && vertices[i][1] > highestVertexY) {
        highestVertexY = vertices[i][1];
      }
      this.mesh.setColorAt(i, color.setHex(0xffffff * Math.random()));
    }

    const vertexDifference = highestVertexY - lowestVertexY;
    const positionY = scale * (vertexDifference / 2) - 1;
    // this.physics.addMesh(this.mesh, 1);

    console.log({ vertices: vertices.length });
    this.vertices = vertices;

    this.mesh.scale.set(scale, scale, scale);
    this.mesh.position.set(0, positionY, 0);
    this.mesh.castShadow = true;
    this.scene.add(this.mesh);
    this.objects.push(this.mesh);
  }

  #setMesh() {
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
          this.resetMesh();
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

  resetMesh() {
    this.dragControls.dispose();
    for (const object of this.objects) {
      this.scene.remove(object);
    }
    this.objects = [];

    //====
    // If adding physics, need to handle the reset of Oimo objects
    //====

    this.setDragControls();
    this.mesh = null;
    this.index = 0;
  }

  #meshEvent() {
    this.createMesh(this.resources.items.handModel, 0.9, 0.1);

    this.createMeshButton.style.background = this.buttonColorInactive;
    this.createMeshButton.removeEventListener('click', this.meshEventHandler);

    this.resetMeshButton.style.background = this.buttonColor;
    this.resetMeshButton.addEventListener('click', this.resetMeshEventHandler);
  }

  #resetMeshEvent() {
    this.resetMesh();

    this.resetMeshButton.removeEventListener('click', this.resetMeshEventHandler);
    this.resetMeshButton.style.background = this.buttonColorInactive;

    this.createMeshButton.style.background = this.buttonColor;
    this.createMeshButton.addEventListener('click', this.meshEventHandler);
  }

  update() {
    const matrix = new Matrix4();
    //===== RAYCASTER ANIMATION =====
    // this.raycaster.setFromCamera(this.mouse, this.camera.instance);
    // const intersection = this.raycaster.intersectObject(this.mesh);

    // if (intersection.length > 0) {
    //   const instanceId = intersection[0].instanceId;
    //   const position = intersection[0].point;

    //   this.mesh.setMatrixAt(instanceId, matrix.setPosition(position.x, (position.y -= 0.05), position.z));
    //   this.mesh.instanceMatrix.needsUpdate = true;

    //   // this.mesh.setColorAt(instanceId, new Color().setHex(Math.random() * 0xffffff));
    // }

    //===== BEADS ANIMATION =====
    if (this.mesh && this.index < this.vertices.length) {
      this.mesh.setMatrixAt(this.index, matrix.setPosition(...this.vertices[this.index]));
      this.mesh.instanceMatrix.needsUpdate = true;

      this.index++;
    }
  }
}
