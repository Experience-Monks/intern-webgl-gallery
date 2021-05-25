//----------------------------------
//  ANIMATE
//----------------------------------
import { TweenLite, Power2 } from 'gsap';

function animateOffscreenToCenter(instance, destPos) {
  const duration = 3;
  TweenLite.to(instance.position, duration, {
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
