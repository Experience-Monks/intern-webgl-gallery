import { TweenMax } from 'gsap';
import Circle from './circle.js';
var Complex = require('complex');

const dist = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
const hasTween = (element) => TweenMax.isTweening(element.position);
const isAsleep = (bod) => bod.sleeping;

function meshToCircle(mesh) {
  const c = new Circle(mesh.scale.x, new Complex(mesh.position.x, mesh.position.z), 0);
  return c;
}

function meshesToCircles(meshesL) {
  let circlesL = [];
  meshesL.forEach((mesh) => circlesL.push(meshToCircle(mesh)));
  return circlesL;
}

export { dist, hasTween, meshesToCircles, isAsleep };
