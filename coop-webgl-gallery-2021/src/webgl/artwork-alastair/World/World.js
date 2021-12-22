import Experience from '../Experience';
import Environment from './Environment.js';
import LoadingScreen from './LoadingScreen.js';
import Background from './Background.js';
import Floor from './Floor.js';
import Beads from './Beads.js';

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.loadingScreen = new LoadingScreen();
    this.resources = this.experience.resources;

    this.loadingBarElement = document.getElementById('loading-bar');
    this.controlsContainer = document.getElementById('controls-container');
    this.hideControls = document.getElementById('hide-controls');

    // Styling
    this.loadingBarElement.style.position = 'absolute';
    this.loadingBarElement.style.top = '50%';
    this.loadingBarElement.style.width = '100%';
    this.loadingBarElement.style.height = '2px';
    this.loadingBarElement.style.background = '#ffffff';
    this.loadingBarElement.style.transformOrigin = 'top left';
    this.loadingBarElement.style.transform = 'scaleX(0)';

    this.resources.manager.onLoad = () => {
      this.controlsContainer.style.opacity = 1;
      this.hideControls.style.opacity = 1;
      this.loadingBarElement.style.transform = 'scaleX(0)';
      this.loadingBarElement.style.transformOrigin = `100% 0`;

      this.background = new Background();
      this.floor = new Floor();
      this.beads = new Beads();
      this.environment = new Environment();
    };

    this.resources.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progressRatio = itemsLoaded / itemsTotal;
      this.loadingBarElement.style.transform = `scaleX(${progressRatio})`;
    };
  }

  update() {
    this.beads && this.beads.update();
  }
}
