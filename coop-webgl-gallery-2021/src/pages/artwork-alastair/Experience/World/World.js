import Experience from '../Experience';
import Environment from './Environment.js';
import Floor from './Floor.js';
import Beads from './Beads.js';

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on('ready', () => {
      // Setup
      this.floor = new Floor();
      this.beads = new Beads();
      this.environment = new Environment();
    });
  }

  update() {
    this.beads && this.beads.update();
  }
}