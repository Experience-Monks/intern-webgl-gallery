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

function updateUniforms(uniforms, clock, meshSets) {
  uniforms.vBallPos0.value.x = meshSets[0][0].position.x;
  uniforms.vBallPos0.value.y = meshSets[0][0].position.y;
  uniforms.vBallPos0.value.z = meshSets[0][0].position.z;

  uniforms.vBallPos1.value.x = meshSets[1][1].position.x;
  uniforms.vBallPos1.value.y = meshSets[1][1].position.y;
  uniforms.vBallPos1.value.z = meshSets[1][1].position.z;

  uniforms.vBallPos2.value.x = meshSets[2][2].position.x;
  uniforms.vBallPos2.value.y = meshSets[2][2].position.y;
  uniforms.vBallPos2.value.z = meshSets[2][2].position.z;

  uniforms.vBallPos3.value.x = meshSets[3][2].position.x;
  uniforms.vBallPos3.value.y = meshSets[3][2].position.y;
  uniforms.vBallPos3.value.z = meshSets[3][2].position.z;

  uniforms.u_time.value = clock.getElapsedTime();
}

export { dist, hasTween, meshesToCircles, isAsleep, updateUniforms, isColliding };
