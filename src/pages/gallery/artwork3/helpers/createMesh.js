//----------------------------------
//  CREATE MESH IN SCENE
//----------------------------------

import {
  SphereGeometry,
  MeshPhongMaterial,
  BoxGeometry,
  ShaderMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshMatcapMaterial,
  TextureLoader,
  MeshStandardMaterial
} from 'three/build/three.module';

var texture;

function loadTexture() {
  const textureLoader = new TextureLoader();
  texture = textureLoader.load('../../assets/textures/porcelain.jpg');
}
loadTexture();

function createSphere(scene, _radius, x, y, z, wireF) {
  const radius = Math.abs(_radius);
  if (radius === undefined || x === undefined || y === undefined || z === undefined) {
    console.log('Undefined inputs to createSphere');
    return;
  }
  const geometry = new SphereGeometry(radius, 32, 32);
  const material = new MeshStandardMaterial({
    color: 'black',
    wireframe: false,
    wireframeLinewidth: 0.1,
    morphTargets: true
  });
  const sphere = new Mesh(geometry, material);
  sphere.position.set(x, y, z);
  scene.add(sphere);
  return sphere;
}

function createMatcapSphere(scene, _radius, x, y, z) {
  const radius = Math.abs(_radius);
  if (radius === undefined || x === undefined || y === undefined || z === undefined) {
    console.log('Undefined inputs to createMatcapSphere');
    return;
  }
  const geometry = new SphereGeometry(radius, 32, 32);
  const material = new MeshMatcapMaterial({
    color: 0x005500,
    matcap: texture
  });
  const sphere = new Mesh(geometry, material);
  sphere.position.set(x, y, z);
  scene.add(sphere);
  return sphere;
}

function createWireframeSphere(scene, _radius, x, y, z) {
  const radius = Math.abs(_radius);
  if (radius === undefined || x === undefined || y === undefined || z === undefined) {
    console.log('Undefined inputs to createWireframeSphere');
    return;
  }
  const geometry = new SphereGeometry(radius, 32, 32);
  const material = new MeshPhongMaterial({
    color: 'white',
    wireframe: true,
    // bumpMap: texture,
    emissive: 'pink',
    shininess: 50
  });
  const sphere = new Mesh(geometry, material);
  sphere.position.set(x, y, z);
  scene.add(sphere);
  return sphere;
}

function createStaticBox(scene, size, position, rotation, color) {
  const ToRad = 0.0174532925199432957;
  const geometry = new BoxGeometry(size[0], size[1], size[2]);
  const material = new MeshBasicMaterial({ color: color });
  const mesh = new Mesh(geometry, material);
  mesh.position.set(position[0], position[1], position[2]);
  mesh.rotation.set(rotation[0] * ToRad, rotation[1] * ToRad, rotation[2] * ToRad);
  scene.add(mesh);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createShaderBox(scene, size, position, rotation, uniforms, vertexShader, fragmentShader) {
  const ToRad = 0.0174532925199432957;
  const geometry = new BoxGeometry(size[0], size[1], size[2]);
  const material = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });
  const mesh = new Mesh(geometry, material);
  mesh.position.set(position[0], position[1], position[2]);
  mesh.rotation.set(rotation[0] * ToRad, rotation[1] * ToRad, rotation[2] * ToRad);
  scene.add(mesh);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/* generates a sequence of spheres following the path of the circle
 * on the xy-plane or xz-plane */
function createShapeAlong2DPath(
  scene,
  circle,
  createShapeFunc,
  xzPlane, //xzPlane => y = 0
  rPadding,
  shapeSize
) {
  const r = Math.abs(circle.r) + rPadding;
  const x_0 = circle.z.re;
  const y_0 = circle.z.im;
  const yOffset = 200;
  let degStep = 15;
  for (let deg = 0; deg < 360; deg += degStep) {
    let x = x_0 + r * Math.cos(deg);
    let _y = y_0 + r * Math.sin(deg);
    let y = xzPlane ? 0 : _y + yOffset;
    let z = xzPlane ? _y : 0;
    createShapeFunc(scene, shapeSize, x, y, z);
  }
}

export {
  createSphere,
  createWireframeSphere,
  createMatcapSphere,
  createStaticBox,
  createShaderBox,
  createShapeAlong2DPath
};
