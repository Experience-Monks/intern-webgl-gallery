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
const gap = 500;
const collisionPadding = 5;
const centerCircleStartPos = new Vector3(300, 0, 400); // used once in init
const centerCircleStartR = 10;
const leftCircleStartPos = new Vector3(-gap, 0, -gap);
const rightCircleStartPos = new Vector3(gap, 0, -gap);

// animation constants
const origin = new Vector3(0, 0, 0);

export {
  colors,
  options,
  groundInfo,
  collisionPadding,
  origin,
  centerCircleStartPos,
  centerCircleStartR,
  leftCircleStartPos,
  rightCircleStartPos
};
