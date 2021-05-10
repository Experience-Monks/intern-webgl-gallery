const Sketch = (W, H) => (p) => {
  let fontF;
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    fontF = p.loadFont();
  };

  p.draw = () => {
    p.background(100);

    const c1 = p.map(p.constrain(p.mouseX, 0, p.windowWidth), 0, p.windowWidth, 0, 255);
    const c2 = p.map(p.constrain(p.mouseY, 0, p.windowHeight), 0, p.windowHeight, 0, 255);
    p.fill(c1, c2, 255);
    p.strokeWeight(4);
    if (p.mouseIsPressed) {
      p.stroke(255);
    } else {
      p.stroke(0);
    }

    p.textSize(200);
    p.textFont(fontF);
    p.text('test', -p.windowWidth / 2, -p.windowHeight / 2);
  };
};
export default Sketch;
