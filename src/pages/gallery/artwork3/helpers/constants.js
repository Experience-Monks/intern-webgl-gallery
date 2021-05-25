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
  Angled: [0, 600, 600]
};
const options = {
  backgroundColor: `lightblue`,
  antialias: true,
  cameraPosition: cameraPositions.topDown,
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
  size: [800, 40, 800],
  pos: [0, -80, 0]
};
/* information for circle seeds */
const destPosSets = [new Vector3(0, 0, 0)];
/*
  new Vector3(300, 0, 300),
  new Vector3(-300, 0, -300),
  new Vector3(300, 0, -300),
  new Vector3(-300, 0, 300)
];*/
const startY = 300;
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
const seedOpts = [seed];

export { colors, options, groundInfo, destPosSets, seedOpts };
