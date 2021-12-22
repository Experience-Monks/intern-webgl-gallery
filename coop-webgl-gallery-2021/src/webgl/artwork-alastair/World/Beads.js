import {
  BoxGeometry,
  TetrahedronGeometry,
  SphereGeometry,
  InstancedMesh,
  MeshStandardMaterial,
  DynamicDrawUsage,
  Vector2,
  Matrix4,
  Color,
  BufferAttribute,
  LoadingManager
  // Raycaster
} from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

import Experience from '../Experience.js';

import data from '../data.json';

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
      return array.length < 10000 ? array : reduceVertices(array.filter((element, i) => i % 2 === 0));
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

    //===== MODEL SIZE CALCULATION =====
    const vertexDifference = highestVertexY - lowestVertexY;
    const scale = 6 / vertexDifference;
    const beadScale = 0.01 * vertexDifference;
    const positionY = scale * (vertexDifference / 2);
    //=====

    const geometry = this.setGeometry(beadScale, beadType);

    this.mesh = new InstancedMesh(geometry, this.material, vertices.length);
    this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);

    for (let i = 0; i < vertices.length; i++) {
      this.animateLoad
        ? this.mesh.setMatrixAt(i, matrix.setPosition(vertices[i][0], lowestVertexY, vertices[i][2]))
        : this.mesh.setMatrixAt(i, matrix.setPosition(...vertices[i]));

      multiColored
        ? this.mesh.setColorAt(i, color.setHex(0xffffff * Math.random()))
        : this.mesh.setColorAt(i, color.setHex(0xffffff));
    }

    // this.physics.addMesh(this.mesh, 1);

    this.vertices = vertices;

    this.mesh.scale.set(scale, scale, scale);
    this.mesh.position.set(0, positionY, 0);
    this.scene.add(this.mesh);
    this.objects.push(this.mesh);
  }

  #setMeshDebugger() {
    //===== DEBUG =====
    if (this.debug.active) {
      const debugObject = {
        HandSphere: () => this.createMesh(this.resources.items.handModel),
        HandBox: () => this.createMesh(this.resources.items.handModel, 'box', false),
        HandTetrahedron: () => this.createMesh(this.resources.items.handModel, 'tetrahedron', false),
        SkullModel: () => this.createMesh(this.resources.items.skullModel, 'tetrahedron', false),
        Reset: () => this.resetMesh()
      };

      this.debugFolder.add(debugObject, 'HandSphere');
      this.debugFolder.add(debugObject, 'HandBox');
      this.debugFolder.add(debugObject, 'HandTetrahedron');
      this.debugFolder.add(debugObject, 'SkullModel');
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
    this.#handleMeshEvent();
  }

  #resetMeshEvent() {
    this.resetMesh();
    this.animateLoad = false;

    this.resetMeshButton.removeEventListener('click', this.resetMeshEventHandler);
    this.createMeshButton.addEventListener('click', this.meshEventHandler);

    this.resetMeshButton.style.background = data.colors.inactiveButton;
    this.createMeshButton.style.background = data.colors.activeButton;
  }

  setEventListeners() {
    this.setDragControls();

    window.addEventListener('keydown', (e) => {
      e.code === 'KeyC' && this.dragControls.activate();
      e.code === 'KeyB' && this.createMesh(this.resources.items.handModel);
      e.code === 'KeyR' && this.resetMesh();
    });

    window.addEventListener('keyup', (e) => {
      e.code === 'KeyC' && this.dragControls.deactivate();
    });

    document.addEventListener(
      'dragover',
      (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      },
      false
    );

    document.addEventListener(
      'drop',
      (e) => {
        e.preventDefault();

        if (e.dataTransfer.types[0] === 'text/plain') return;

        e.dataTransfer.files && this.loadFiles(e.dataTransfer.files);
      },
      false
    );

    this.meshEventHandler = this.#meshEvent.bind(this);
    this.resetMeshEventHandler = this.#resetMeshEvent.bind(this);

    this.createMeshButton = document.getElementById('create-mesh');
    this.resetMeshButton = document.getElementById('reset-mesh');
    this.fileUploadButton = document.getElementById('file-upload');

    this.resetMeshButton.addEventListener('click', this.resetMeshEventHandler);
    this.fileUploadButton.addEventListener('change', (e) => e.target.files && this.loadFiles(e.target.files));

    // document.addEventListener('mousemove', (event) => {
    //   this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //   this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // });
  }

  #handleMeshEvent() {
    this.createMeshButton.style.background = data.colors.inactiveButton;
    this.resetMeshButton.style.background = data.colors.activeButton;

    this.createMeshButton.removeEventListener('click', this.meshEventHandler);
    this.resetMeshButton.addEventListener('click', this.resetMeshEventHandler);
  }

  //===== LOADING CUSTOM ASSET =====

  loadFiles(files) {
    function createFilesMap(files) {
      let map = {};

      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        map[file.name] = file;
      }

      return map;
    }

    if (files.length > 0) {
      let filesMap = createFilesMap(files);

      this.manager = new LoadingManager();
      this.manager.onLoad = () => {
        console.log('sources loaded');
      };
      this.manager.setURLModifier(function (url) {
        url = url.replace(/^(\.?\/)/, ''); // remove './'

        let file = filesMap[url];

        if (file) {
          return URL.createObjectURL(file);
        }

        return url;
      });

      for (let i = 0; i < files.length; i++) {
        this.loadFile(files[i], this.manager);
      }
    }
  }

  loadFile(file, manager) {
    const scope = this;
    const filename = file.name;
    const extension = filename.split('.').pop().toLowerCase();

    const reader = new FileReader();
    reader.addEventListener('progress', function (event) {
      const size = '(' + Math.floor(event.total / 1000) + ' KB)';
      const progress = Math.floor((event.loaded / event.total) * 100) + '%';

      console.log('Loading', filename, size, progress);
    });

    switch (extension) {
      case 'fbx':
        reader.addEventListener(
          'load',
          async function (event) {
            let contents = event.target.result;

            let { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader.js');

            let loader = new FBXLoader(manager);
            let object = loader.parse(contents);

            scope.resetMesh();
            scope.createMesh(object);
            scope.#handleMeshEvent();
          },
          false
        );
        reader.readAsArrayBuffer(file);

        break;

      case 'obj':
        reader.addEventListener(
          'load',
          async (event) => {
            let contents = event.target.result;

            let { OBJLoader } = await import('three/examples/jsm/loaders/OBJLoader.js');

            let object = new OBJLoader().parse(contents);
            object.name = filename;

            scope.resetMesh();
            scope.createMesh(object);
            scope.#handleMeshEvent();
          },
          false
        );
        reader.readAsText(file);

        break;

      default:
        console.error('Unsupported file format (' + extension + ').');

        break;
    }
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
}
