import { TextureLoader, CubeTextureLoader, LoadingManager } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import EventEmitter from './EventEmitter';

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    // Options
    this.sources = sources;

    // Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.loadingBarElement = document.getElementById('loading-bar');
    this.controlsContainer = document.getElementById('controls-container');

    // Styling
    this.loadingBarElement.style.position = 'absolute';
    this.loadingBarElement.style.top = '50%';
    this.loadingBarElement.style.width = '100%';
    this.loadingBarElement.style.height = '2px';
    this.loadingBarElement.style.background = '#ffffff';
    this.loadingBarElement.style.transformOrigin = 'top left';
    this.loadingBarElement.style.transform = 'scaleX(0)';

    this.manager = new LoadingManager();
    this.manager.onLoad = () => {
      this.controlsContainer.style.opacity = '1.0';
      this.loadingBarElement.style.transform = 'scaleX(0)';
      this.loadingBarElement.style.transformOrigin = `100% 0`;
    };

    this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progressRatio = itemsLoaded / itemsTotal;
      this.loadingBarElement.style.transform = `scaleX(${progressRatio})`;
    };

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.objLoader = new OBJLoader(this.manager);
    this.loaders.fbxLoader = new FBXLoader(this.manager);
    this.loaders.textureLoader = new TextureLoader(this.manager);
    this.loaders.cubeTextureLoader = new CubeTextureLoader(this.manager);
  }

  startLoading() {
    for (const source of this.sources) {
      if (source.type === 'objModel') {
        this.loaders.objLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === 'fbxModel') {
        this.loaders.fbxLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === 'texture') {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === 'cubeTexture') {
        this.loaders.cubeTextureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger('ready');
    }
  }
}
