export default class Circle {
  constructor(radius, center, type) {
    this.r = radius;
    this.k = this.getK(this.r);
    this.z = center;
    this.type = type; // 0 = seed, 1 = inside, 2 = outside
  }

  /* returns curvature */
  getK(radius) {
    return 1 / radius;
  }
}
