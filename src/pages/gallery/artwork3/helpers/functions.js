import { gsap } from 'gsap';
import Complex from 'complex.js';
import Circle from './circle.js';

const dist = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
const hasTween = (element) => gsap.isTweening(element.position);
const isAsleep = (bod) => bod.sleeping;

function meshToCircle(mesh) {
  const c = new Circle(mesh.geometry.parameters.radius, new Complex(mesh.position.x, mesh.position.z), 0);
  return c;
}

function meshesToCircles(meshesL) {
  let circlesL = [];
  meshesL.forEach((mesh) => circlesL.push(meshToCircle(mesh)));
  return circlesL;
}

function isColliding(circA, circB) {
  const d = dist(circA.position.x, circA.position.z, circB.position.x, circB.position.z);
  const rSum = circA.geometry.parameters.radius + circB.geometry.parameters.radius;
  return d < rSum + 5;
}

export { dist, hasTween, meshesToCircles, isAsleep, isColliding };
