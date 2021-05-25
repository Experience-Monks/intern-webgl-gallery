/*
 * returns 3 circles that are mutually tangent at the given points with the given radii
 * WORK IN PROGRESS
 */
function generateThreeTangentCircles() {
  const p1 = new Complex(-60, 0);
  const p2 = new Complex(-3, 40);
  const p3 = new Complex(0, -33);
  const r1 = 60;
  const r2 = 80;
  const r3 = 70;

  const centers = getCenter(p1, p2, r1);
  const centers2 = getCenter(p2, p3, r2);
  const centers3 = getCenter(p1, p3, r3);

  const c1 = new Circle(r1, centers.left, 0);
  const c2 = new Circle(r2, centers2.left, 0);
  const c3 = new Circle(r3, centers3.right, 0);
  console.log("before return:", c1.z, c2.z, c3.z);
  return [c1, c2, c3];
}

function testDescartes() {
  const circ = generateThreeTangentCircles();
  const results = descartes(circ);

  results.centers.forEach((center) => {
    results.curvatures.forEach((curve) => {
      let c = new Circle(kToR(curve), center, curve > 0 ? 1 : 2);
      circ.push(c);
    });
  });
  circ.forEach((circle) => {
    if (circle.type < 2) {
      createSphere(circle.r, circle.z.re, 0, circle.z.im, 10, true);
    } else {
      createShapeAlong2DPath(circle, createSphere, true, 10, 15);
    }
  });
}

function testAnimation() {
  const c = createSphere(60, -300, 0, -300);
  animateOffscreenToCenter(c);
}

export { testDescartes, testAnimation };
