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

function updateUniforms(uniforms, clock, bigSphereMeshes) {
  if (bigSphereMeshes[0] !== undefined) {
    uniforms.vBallPos0.value.x = bigSphereMeshes[0].position.x;
    uniforms.vBallPos0.value.y = bigSphereMeshes[0].position.y;
    uniforms.vBallPos0.value.z = bigSphereMeshes[0].position.z;
  }

  if (bigSphereMeshes[1] !== undefined) {
    uniforms.vBallPos1.value.x = bigSphereMeshes[1].position.x;
    uniforms.vBallPos1.value.y = bigSphereMeshes[1].position.y;
    uniforms.vBallPos1.value.z = bigSphereMeshes[1].position.z;
  }

  if (bigSphereMeshes[2] !== undefined) {
    uniforms.vBallPos2.value.x = bigSphereMeshes[2].position.x;
    uniforms.vBallPos2.value.y = bigSphereMeshes[2].position.y;
    uniforms.vBallPos2.value.z = bigSphereMeshes[2].position.z;
  }

  if (bigSphereMeshes[3] !== undefined) {
    uniforms.vBallPos3.value.x = bigSphereMeshes[3].position.x;
    uniforms.vBallPos3.value.y = bigSphereMeshes[3].position.y;
    uniforms.vBallPos3.value.z = bigSphereMeshes[3].position.z;
  }

  uniforms.u_time.value = clock.getElapsedTime();
}

export { dist, hasTween, meshesToCircles, isAsleep, updateUniforms, isColliding };
