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

// animation constants
const origin = new Vector3(0, 0, 0);
const Yaxis = new Vector3(0, 1, 0);

const groundInfo = {
  size: [3000, 5, 3000],
  pos: [0, -80, 0]
};

/* information for circle seeds */
const gap = 400;
const adjFactor = 1.5;
const collisionPadding = 5;
const centerCircleStartPos = new Vector3(0, 0, 350); // used once in init
const centerCircleStartR = 10;
const sideCircleStartLeftDest = new Vector3(
  centerCircleStartPos.x - centerCircleStartR / adjFactor,
  centerCircleStartPos.y,
  centerCircleStartPos.z - centerCircleStartR / adjFactor
);
const sideCircleStartRightDest = new Vector3(
  centerCircleStartPos.x + centerCircleStartR / adjFactor,
  centerCircleStartPos.y,
  centerCircleStartPos.z - centerCircleStartR / adjFactor
);
const leftCircleStartPos = new Vector3(-gap, 0, -gap);
const rightCircleStartPos = new Vector3(gap, 0, -gap);
const centerCircleAnimationFrom = new Vector3(0, 0, 800);

// shader
const uniformDefault = new Vector3(4 * gap, 0, 4 * gap);

export {
  colors,
  options,
  gap,
  groundInfo,
  collisionPadding,
  adjFactor,
  origin,
  Yaxis,
  centerCircleStartPos,
  centerCircleStartR,
  centerCircleAnimationFrom,
  sideCircleStartLeftDest,
  sideCircleStartRightDest,
  leftCircleStartPos,
  rightCircleStartPos,
  uniformDefault
};
