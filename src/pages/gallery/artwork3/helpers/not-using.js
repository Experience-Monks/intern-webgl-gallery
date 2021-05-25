function createCircle(radius, x, y, z) {
  if (
    radius == undefined ||
    x == undefined ||
    y == undefined ||
    z == undefined
  ) {
    console.log("Undefined inputs to createCircle");
    return;
  }
  const geometry = new THREE.CircleGeometry(Math.abs(radius), 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    // wireframe: true,
  });
  const circle = new THREE.Mesh(geometry, material);
  circle.position.set(x, y, z);
  scene.add(circle);
  console.log("added new circle in scene");
}
