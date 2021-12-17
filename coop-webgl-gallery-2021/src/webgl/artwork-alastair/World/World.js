import Experience from '../Experience';
import Environment from './Environment.js';
import Background from './Background.js';
import Floor from './Floor.js';
import Beads from './Beads.js';
import Waves from './Waves.js';

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on('ready', () => {
      // Setup
      this.background = new Background();
      this.floor = new Floor();
      this.beads = new Beads();
      this.waves = new Waves();
      this.environment = new Environment();
    });
  }

  update() {
    this.beads && this.beads.update();
    this.waves && this.waves.update();
  }
}
