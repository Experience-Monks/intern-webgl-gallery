//----------------------------------
//  ANIMATE
//----------------------------------
import { gsap, Power2 } from 'gsap';

function animateOffscreenToDest(instance, destPos) {
  const time = 5;
  gsap.to(instance.position, {
    duration: time,
    x: destPos.x,
    y: destPos.y,
    z: destPos.z,
    ease: Power2.easeInOut
  });
}

/*

function animateToDest(scene, seeds, destPos, camera) {
  seeds.forEach((seed) => animateOffscreenToDest(seed, destPos));
}
*/

function animateToDest(instance, destPos) {
  const time = 5;
  gsap.to(instance.position, {
    duration: time,
    x: destPos.x,
    y: destPos.y,
    z: destPos.z,
    ease: Power2.easeInOut
  });
}

export default animateToDest;
