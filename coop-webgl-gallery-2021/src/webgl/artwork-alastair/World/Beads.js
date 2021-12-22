import {
  BoxGeometry,
  TetrahedronGeometry,
  SphereGeometry,
  InstancedMesh,
  MeshStandardMaterial,
  DynamicDrawUsage,
  Matrix4,
  Color,
  BufferAttribute,
  LoadingManager
} from 'three';

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
    this.vertices = [];
    this.matrix = new Matrix4();
    this.color = new Color();
    this.index = 0;
    this.animateLoad = true;
    this.multiColored = true;
    this.beadType = data.beadType.sphere;

    this.debug.active && (this.debugFolder = this.debug.ui.addFolder('beads'));

    this.setMaterial();
    this.#setMeshDebugger();
    this.object = this.resources.items.handModel;
    this.createMesh(this.object);
    this.setEventListeners();
  }

  setGeometry(beadScale, beadType) {
    let geometry;

    if (beadType === data.beadType.box) {
      geometry = new BoxGeometry(beadScale, beadScale, beadScale);
    } else if (beadType === data.beadType.tetrahedron) {
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
      roughness: 0.0,
      color: '#ffffff'
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

  createMesh(model) {
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
    const lowestStart = -vertexDifference;
    //=====

    const geometry = this.setGeometry(beadScale, this.beadType);

    this.mesh = new InstancedMesh(geometry, this.material, vertices.length);
    this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);

    for (let i = 0; i < vertices.length; i++) {
      this.animateLoad
        ? this.mesh.setMatrixAt(i, matrix.setPosition(vertices[i][0], lowestStart, vertices[i][2]))
        : this.mesh.setMatrixAt(i, matrix.setPosition(...vertices[i]));

      this.multiColored
        ? this.mesh.setColorAt(i, color.setHex(0xffffff * Math.random()))
        : this.mesh.setColorAt(i, color.setHex(0xffffff));
    }

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
        Hand: () => {
          this.resetMesh();
          this.createMesh(this.resources.items.handModel);
        },
        SkullModel: () => {
          this.resetMesh();
          this.createMesh(this.resources.items.skullModel);
        },
        Remove: () => this.resetMesh()
      };

      this.debugFolder.add(debugObject, 'Hand');
      this.debugFolder.add(debugObject, 'SkullModel');
      this.debugFolder.add(debugObject, 'Remove');
    }
  }

  resetMesh() {
    for (const object of this.objects) {
      this.scene.remove(object);
    }
    this.objects = [];

    this.mesh = null;
    this.index = 0;
  }

  #meshEvent() {
    this.createMesh(this.object);
    this.#handleMeshEvent();
  }

  #handleMeshEvent() {
    this.createMeshButton.style.background = data.colors.inactiveButton;
    this.resetMeshButton.style.background = data.colors.activeButton;

    this.createMeshButton.removeEventListener('click', this.meshEventHandler);
    this.resetMeshButton.addEventListener('click', this.resetMeshEventHandler);
  }

  #animateEvent() {
    this.animateLoad = !this.animateLoad;
    this.animateButton.style.background = this.animateLoad ? data.colors.activeButton : data.colors.inactiveButton;
    this.animateButton.style.color = this.animateLoad ? data.colors.activeText : data.colors.inactiveText;
    this.animateButton.innerHTML = this.animateLoad ? data.buttons.animateOn : data.buttons.animateOff;
    this.#handleMeshEvent();
    this.resetMesh();
    this.createMesh(this.object);
  }

  #resetMeshEvent() {
    this.resetMesh();
    this.animateLoad = false;

    this.resetMeshButton.removeEventListener('click', this.resetMeshEventHandler);
    this.createMeshButton.addEventListener('click', this.meshEventHandler);

    this.resetMeshButton.style.background = data.colors.inactiveButton;
    this.createMeshButton.style.background = data.colors.activeButton;
  }

  #changeColorEvent() {
    this.multiColored = !this.multiColored;
    this.colorButton.style.background = this.multiColored ? data.colors.activeButton : data.colors.inactiveButton;
    this.colorButton.style.color = this.multiColored ? data.colors.activeText : data.colors.inactiveText;
    this.colorButton.innerHTML = this.multiColored ? data.buttons.colorTypeOn : data.buttons.colorTypeOff;
    this.#handleMeshEvent();
    this.resetMesh();
    this.createMesh(this.object);
  }

  #beadTypeEvent(e) {
    const selectedIndex = e.target.selectedIndex;
    const beadType = e.target[selectedIndex].value;
    this.beadType = beadType;
    this.#handleMeshEvent();
    this.resetMesh();
    this.createMesh(this.object);
  }

  setEventListeners() {
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
    this.animateHandler = this.#animateEvent.bind(this);
    this.resetMeshEventHandler = this.#resetMeshEvent.bind(this);
    this.colorEventHandler = this.#changeColorEvent.bind(this);
    this.beadTypeHandler = this.#beadTypeEvent.bind(this);

    this.createMeshButton = document.getElementById('create-mesh');
    this.animateButton = document.getElementById('animate');
    this.resetMeshButton = document.getElementById('reset-mesh');
    this.beadTypeButton = document.getElementById('bead-type');
    this.colorButton = document.getElementById('color-type');
    this.fileUploadButton = document.getElementById('file-upload');

    this.animateButton.addEventListener('click', this.animateHandler);
    this.resetMeshButton.addEventListener('click', this.resetMeshEventHandler);
    this.colorButton.addEventListener('click', this.colorEventHandler);
    this.beadTypeButton.addEventListener('change', this.beadTypeHandler);
    this.fileUploadButton.addEventListener('change', (e) => e.target.files && this.loadFiles(e.target.files));
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

    switch (extension) {
      case 'fbx':
        reader.addEventListener(
          'load',
          async function (event) {
            let contents = event.target.result;

            let { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader.js');

            let loader = new FBXLoader(manager);
            let object = loader.parse(contents);
            this.object = object;

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
            this.object = object;

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
    //===== BEADS ANIMATION =====
    const matrix = new Matrix4();
    if (this.animateLoad && this.mesh && this.index < this.vertices.length) {
      this.mesh.setMatrixAt(this.index, matrix.setPosition(...this.vertices[this.index]));
      this.mesh.instanceMatrix.needsUpdate = true;

      this.index++;
    }
  }
}
