const vertexShader = `
varying vec3 vPosition;
varying vec3 vNormal;
void main() {	
  vPosition = position;
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;

const fragmentShader = `
varying vec3 vPosition; 
varying vec3 vNormal;
uniform vec3 vBallPos0;
uniform vec3 vBallPos1;
uniform vec3 vBallPos2;
uniform vec3 vBallPos3;

void main (void)
{
  float d = abs(distance(vBallPos1, vPosition));
  float d2 = abs(distance(vBallPos2, vPosition));
  float r = fract(d - d2); // fract(d + d2) * 0.5
  vec3 color = vec3(r, 0.5, 0.8);
  gl_FragColor = vec4(color, 1.0);
}
`;

export { vertexShader, fragmentShader };
