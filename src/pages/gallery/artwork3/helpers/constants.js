//----------------------------------
//  THREE JS SETUP
//----------------------------------
import { Vector3 } from 'three/build/three.module';

const colors = {
  white: 0xffffff,
  black: 0x0,
  turquoise: 0x42f5b6,
  pink: 0xffd1dc
};
const cameraPositions = {
  topDown: [0, 600, 0],
  Angled: [0, 600, 600],
  horizontal: [0, 0, 600]
};
const options = {
  backgroundColor: `lightblue`,
  antialias: true,
  cameraPosition: cameraPositions.horizontal,
  grid: {
    size: 1000,
    divisions: 50
  },
  fog: {
    near: 0.5,
    far: 1000
  }
};

//----------------------------------
//  ANIMATE
//----------------------------------
// const destPos = { x: 0, y: 0, z: 0 };

//----------------------------------
//  OIMO PHYSICS
//----------------------------------
const groundInfo = {
  size: [3000, 5, 3000],
  pos: [0, -80, 0]
};
/* information for circle seeds */
const gap = 250;
const destPosSetsOrig = [
  new Vector3(gap, 0, gap),
  new Vector3(-gap, 0, -gap),
  new Vector3(gap, 0, -gap),
  new Vector3(-gap, 0, gap)
];
const destPosSets = [new Vector3(-gap, 0, 0), new Vector3(0, 0, -gap), new Vector3(gap, 0, 0), new Vector3(0, 0, gap)];
const startY = 0;
const seed = [
  {
    r: 60,
    x: -300,
    y: startY,
    z: -300
  },
  {
    r: 60,
    x: 300,
    y: startY,
    z: -300
  },
  {
    r: 70,
    x: 0,
    y: startY,
    z: 300
  }
];
const originSeed = [
  { r: 60, x: -250 + Math.random(-10, 10), y: startY, z: -250 + Math.random(-10, 10) },
  { r: 60, x: 250 + Math.random(-10, 10), y: startY, z: -250 + Math.random(0, 10) },
  { r: 70, x: Math.random(-10, 10), y: startY, z: 250 + Math.random(-10, 10) }
];
const collisionPadding = 5;
const seedOpts = [originSeed, originSeed, originSeed, originSeed];

export { colors, options, groundInfo, destPosSets, seedOpts, collisionPadding };
