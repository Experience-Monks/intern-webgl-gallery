//----------------------------------
//  ANIMATE
//----------------------------------
import { gsap, Power2, Elastic } from 'gsap';

function animateToDest(instance, destPos) {
  const time = 4;
  gsap.to(instance.position, {
    duration: time,
    x: destPos.x,
    y: destPos.y,
    z: destPos.z,
    ease: Power2.easeInOut
  });
}

function animateToScale(instance, finalRadius) {
  const time = 3;
  gsap.fromTo(
    instance.scale,
    { x: 0.1, y: 0.1, z: 0.1 },
    {
      duration: time,
      x: 1.2,
      y: 1.2,
      z: 1.2,
      ease: Elastic.easeOut
    }
  );
}

export { animateToDest, animateToScale };
