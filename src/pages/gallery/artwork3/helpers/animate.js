//----------------------------------
//  ANIMATE
//----------------------------------
import { gsap, Power2 } from 'gsap';

function animateOffscreenToDest(instance, destPos) {
  const time = 3;
  gsap.to(instance.position, {
    duration: time,
    x: destPos.x,
    y: destPos.y,
    z: destPos.z,
    ease: Power2.easeInOut
  });
}

function animateToDest(scene, seeds, destPos, camera) {
  seeds.forEach((seed) => animateOffscreenToDest(seed, destPos));
}

export default animateToDest;
