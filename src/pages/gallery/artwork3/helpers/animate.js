//----------------------------------
//  ANIMATE
//----------------------------------
import { gsap, Power2 } from 'gsap';

function animateOffscreenToCenter(instance, destPos) {
  const time = 3;
  gsap.to(instance.position, {
    duration: time,
    x: destPos.x,
    y: destPos.y,
    z: destPos.z,
    ease: Power2.easeInOut
  });
}

function animateToOrigin(seeds, destPos) {
  seeds.forEach((seed) => animateOffscreenToCenter(seed, destPos));
}

export default animateToOrigin;
