var Complex = require('complex');

/* multiples a scalar with a complex number */
function mul_scalar(scalar, complex) {
  const re = complex.re * scalar;
  const im = complex.im * scalar;
  return new Complex({ re: re, im: im });
}

/*
 * get center of a circle given 2 points and radius
function getCenter(p1, p2, r) {
  const x_a = 0.5 * (p2.re - p1.re);
  const y_a = 0.5 * (p2.im - p1.im);
  const x_0 = p1.re + x_a;
  const y_0 = p1.im + y_a;
  const a = Math.sqrt(x_a ** 2 + y_a ** 2);
  const b = Math.sqrt(r ** 2 - a ** 2);
  const x_3 = x_0 + (b * y_a) / a;
  const y_3 = y_0 - (b * x_a) / a;
  const x_4 = x_0 - (b * y_a) / a;
  const y_4 = y_0 + (b * x_a) / a;
  const result = { right: new Complex(x_3, y_3), left: new Complex(x_4, y_4) };
  return result;
} */

/* straight line (curvature = 0) is a degenerate circle */
function isDegenerate(k) {
  return k === 0;
}

//----------------------------------
// EXPORTS
//----------------------------------
/* returns radius */
function kToR(K) {
  return 1 / K;
}

/*
 * requires 3 circles are NOT tangent to each other at the same point
 * returns sets of curvatures and centers of the two circles (inside, outside)
 */
function descartes(tangentCircles) {
  if (tangentCircles.length !== 3) {
    console.log('descartes only accepts 3 circles');
    return;
  }

  let results = {
    curvatures: [],
    centers: []
  };

  let _c1, _c2, _c3, c1, c2, c3;
  [_c1, _c2, _c3] = tangentCircles;
  [c1, c2, c3] = [_c1, _c2, _c3];

  /* shift everything to close to origin */
  const xShift = _c1.z.re;
  const yShift = _c1.z.im;
  c1.z.re -= xShift; // should be 0
  c1.z.im -= yShift; // should be 0
  c2.z.re -= xShift;
  c2.z.im -= yShift;
  c3.z.re -= xShift;
  c3.z.im -= yShift;
  console.log('after shifting: ', c1, c2, c3);

  const kaugend1 = c1.k + c2.k + c3.k;
  const kaugend2 = 2 * Math.sqrt(c1.k * c2.k + c2.k * c3.k + c3.k * c1.k);
  const k4_sub = kaugend1 - kaugend2;
  const k4_add = kaugend1 + kaugend2;

  /*if negative, it represents a circle that circumscribes the first three*/

  /* complex descartes theorem for finding center*/
  /* z = x + iy */
  const op1 = mul_scalar(c1.k, c1.z);
  const op2 = mul_scalar(c2.k, c2.z);
  const op3 = mul_scalar(c3.k, c3.z);

  const op4 = op1.mul(op2);
  const op5 = op2.mul(op3);
  const op6 = op3.mul(op1);
  const sqrtOp = op4.add(op5).add(op6);
  const sqrt = sqrtOp.sqrt();
  const zaugend1 = op1.add(op2).add(op3);
  const zaugend2 = mul_scalar(2, sqrt);

  /* signs for k and z do not neccessarily correspond to each other
   * but right now mixing them seem to give wack results */
  // const nume_sub = zaugend1.sub(zaugend2);
  const nume_add = zaugend1.add(zaugend2);
  const shift = new Complex(xShift, yShift);
  console.log('shift', shift);

  if (!isDegenerate(k4_sub)) {
    // let z4_sub1 = nume_sub.div(k4_sub);
    let z4_add1 = nume_add.div(k4_sub);
    // results.centers.push(z4_sub1);
    results.centers.push(z4_add1.add(shift));
    results.curvatures.push(k4_sub);
  }

  if (!isDegenerate(k4_add)) {
    //let z4_sub2 = nume_sub.div(k4_add);
    let z4_add2 = nume_add.div(k4_add);
    // results.centers.push(z4_sub2);
    results.centers.push(z4_add2.add(shift));
    results.curvatures.push(k4_add);
  }

  console.log('descartes results', results);
  return results;
}

export { kToR, descartes };
