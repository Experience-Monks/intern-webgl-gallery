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

function animateToDest(seeds, destPos) {
  seeds.forEach((seed, index) => animateOffscreenToDest(seed, destPos, index));
}

export default animateToDest;
