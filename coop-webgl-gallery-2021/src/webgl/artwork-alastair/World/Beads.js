import {
  BoxGeometry,
  TetrahedronGeometry,
  SphereGeometry,
  ShaderMaterial,
  InstancedMesh,
  MeshStandardMaterial,
  DynamicDrawUsage,
  Vector2,
  Matrix4,
  Color,
  BufferAttribute
  // Raycaster
} from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

import Experience from '../Experience.js';

import data from '../data.json';
import sources from '../sourcesImported.js';

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
    this.mouse = new Vector2(1, 1);
    this.index = 0;
    this.animateLoad = false;
    // this.raycaster = new Raycaster();

    this.debug.active && (this.debugFolder = this.debug.ui.addFolder('beads'));

    this.setMaterial();
    this.#setMeshDebugger();
    this.createMesh(this.resources.items.handModel);
    this.setEventListeners();
  }

  setGeometry(beadScale, beadType) {
    let geometry;

    if (beadType === 'box') {
      geometry = new BoxGeometry(beadScale, beadScale, beadScale);
    } else if (beadType === 'tetrahedron') {
      geometry = new TetrahedronGeometry(beadScale);
    } else {
      geometry = new SphereGeometry(beadScale, 10, 10);
    }

    return geometry;
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
      precision: 'lowp',
      metalness: 1.0,
      roughness: 0.0
    });
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

  createMesh(model, beadType = 'sphere', multiColored = true) {
    const positions = this.#combineBuffer(model, 'position');

    const matrix = new Matrix4();
    const color = new Color();

    // ===== VERTICES =====
    let lowestVertexY = 0;
    let highestVertexY = 0;
    let vertices = [];
    for (let i = 0; i < positions.array.length; i += 3) {
      vertices.push([positions.array[i], positions.array[i + 1], positions.array[i + 2]]);
    }

    const reduceVertices = (array) => {
      if (array.length < 10000) {
        return array;
      } else return reduceVertices(array.filter((element, i) => i % 2 === 0));
    };

    vertices = reduceVertices(vertices);

    for (let i = 0; i < vertices.length; i++) {
      if (i !== 0 && vertices[i][1] < lowestVertexY) {
        lowestVertexY = vertices[i][1];
      }

      if (i !== 0 && vertices[i][1] > highestVertexY) {
        highestVertexY = vertices[i][1];
      }
    }

    const vertexDifference = highestVertexY - lowestVertexY;
    const scale = 6 / vertexDifference;
    const beadScale = 0.01 * vertexDifference;
    const positionY = scale * (vertexDifference / 2);

    //===== Geometry =====

    const geometry = this.setGeometry(beadScale, beadType);

    this.mesh = new InstancedMesh(geometry, this.material, vertices.length);
    this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);

    let count = 0;

    for (let i = 0; i < vertices.length; i++) {
      if (this.animateLoad) {
        this.mesh.setMatrixAt(i, matrix.setPosition(vertices[i][0], 0, vertices[i][2]));
      } else this.mesh.setMatrixAt(i, matrix.setPosition(...vertices[i]));

      if (multiColored === true) {
        this.mesh.setColorAt(i, color.setHex(0xffffff * Math.random()));
      } else this.mesh.setColorAt(i, color.setHex(0xffffff));
      count++;
    }

    console.log(count);

    // this.physics.addMesh(this.mesh, 1);

    this.vertices = vertices;

    this.mesh.scale.set(scale, scale, scale);
    this.mesh.position.set(0, positionY, 0);
    this.mesh.castShadow = true;
    this.scene.add(this.mesh);
    this.objects.push(this.mesh);
  }

  #setMeshDebugger() {
    //===== DEBUG =====
    if (this.debug.active) {
      const debugObject = {
        HandSphere: () => {
          this.createMesh(this.resources.items.handModel);
        },
        HandBox: () => {
          this.createMesh(this.resources.items.handModel, 'box', false);
        },
        HandTetrahedron: () => {
          this.createMesh(this.resources.items.handModel, 'tetrahedron', false);
        },
        SkullModel: () => {
          this.createMesh(this.resources.items.skullModel, 'tetrahedron', false);
        },
        MaleHeadModel: () => {
          this.createMesh(this.resources.items.maleHeadModel);
        },
        LoadAsset: () => {
          this.loadAsset();
        },
        Reset: () => {
          this.resetMesh();
        }
      };
      this.debugFolder.add(debugObject, 'HandSphere');
      this.debugFolder.add(debugObject, 'HandBox');
      this.debugFolder.add(debugObject, 'HandTetrahedron');
      this.debugFolder.add(debugObject, 'SkullModel');
      this.debugFolder.add(debugObject, 'MaleHeadModel');
      this.debugFolder.add(debugObject, 'LoadAsset');
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
    this.animateLoad = true;
    this.createMesh(this.resources.items.handModel);

    this.createMeshButton.style.background = data.colors.inactiveButton;
    this.createMeshButton.removeEventListener('click', this.meshEventHandler);

    this.createMugButton.style.background = data.colors.inactiveButton;
    this.createMugButton.removeEventListener('click', this.mugEventHandler);

    this.createMandalorianButton.style.background = data.colors.inactiveButton;
    this.createMandalorianButton.removeEventListener('click', this.mandalorianEventHandler);

    this.resetMeshButton.style.background = data.colors.activeButton;
    this.resetMeshButton.addEventListener('click', this.resetMeshEventHandler);
  }

  // Temporary for demo
  #mugEvent() {
    this.createMesh(this.resources.items.coffeeMugModel, 'sphere', false);

    this.createMeshButton.style.background = data.colors.inactiveButton;
    this.createMeshButton.removeEventListener('click', this.meshEventHandler);

    this.createMugButton.style.background = data.colors.inactiveButton;
    this.createMugButton.removeEventListener('click', this.mugEventHandler);

    this.createMandalorianButton.style.background = data.colors.inactiveButton;
    this.createMandalorianButton.removeEventListener('click', this.mandalorianEventHandler);

    this.resetMeshButton.style.background = data.colors.activeButton;
    this.resetMeshButton.addEventListener('click', this.resetMeshEventHandler);
  }

  #mandalorianEvent() {
    this.createMesh(this.resources.items.mandalorianModel, 'tetrahedron');

    this.createMeshButton.style.background = data.colors.inactiveButton;
    this.createMeshButton.removeEventListener('click', this.meshEventHandler);

    this.createMugButton.style.background = data.colors.inactiveButton;
    this.createMugButton.removeEventListener('click', this.mugEventHandler);

    this.createMandalorianButton.style.background = data.colors.inactiveButton;
    this.createMandalorianButton.removeEventListener('click', this.mandalorianEventHandler);

    this.resetMeshButton.style.background = data.colors.activeButton;
    this.resetMeshButton.addEventListener('click', this.resetMeshEventHandler);
  }

  //-----

  #resetMeshEvent() {
    this.resetMesh();
    this.animateLoad = false;

    this.resetMeshButton.removeEventListener('click', this.resetMeshEventHandler);
    this.resetMeshButton.style.background = data.colors.inactiveButton;

    this.createMeshButton.style.background = data.colors.activeButton;
    this.createMeshButton.addEventListener('click', this.meshEventHandler);

    this.createMugButton.style.background = data.colors.activeButton;
    this.createMugButton.addEventListener('click', this.mugEventHandler);

    this.createMandalorianButton.style.background = data.colors.activeButton;
    this.createMandalorianButton.addEventListener('click', this.mandalorianEventHandler);
  }

  setEventListeners() {
    this.setDragControls();

    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyC') {
        this.dragControls.activate();
      }

      if (e.code === 'KeyB') {
        this.createMesh(this.resources.items.handModel);
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

    this.meshEventHandler = this.#meshEvent.bind(this);
    this.createMeshButton = document.getElementById('create-mesh');

    this.mugEventHandler = this.#mugEvent.bind(this);
    this.createMugButton = document.getElementById('create-mug');

    this.mandalorianEventHandler = this.#mandalorianEvent.bind(this);
    this.createMandalorianButton = document.getElementById('create-mandalorian');

    this.resetMeshEventHandler = this.#resetMeshEvent.bind(this);
    this.resetMeshButton = document.getElementById('reset-mesh');

    this.resetMeshButton.addEventListener('click', this.resetMeshEventHandler);

    // document.addEventListener('mousemove', (event) => {
    //   this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //   this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // });
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
    if (this.animateLoad && this.mesh && this.index < this.vertices.length) {
      this.mesh.setMatrixAt(this.index, matrix.setPosition(...this.vertices[this.index]));
      this.mesh.instanceMatrix.needsUpdate = true;

      this.index++;
    }
  }

  //===== LOADING CUSTOM ASSET =====
  loadAsset() {
    this.loaders = {};
    this.loaders.objLoader = new OBJLoader();

    for (const source of sources) {
      if (source.type === 'objModel') {
        this.loaders.objLoader.load(
          source.path,
          (file) => {
            console.log(` ${source.path} loaded`);
            this.createMesh(file);
          },
          () => {},
          (e) => {
            console.log(e);
          }
        );
      }
    }
  }
}
