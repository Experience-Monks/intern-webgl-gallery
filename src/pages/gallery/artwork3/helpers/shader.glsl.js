const vertexShader = `
varying vec3 vPosition;
varying vec3 vNormal;
void main() {	
  vec4 pos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  vPosition = position;
  vNormal = normal;
  gl_Position = pos;
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
  float adJust = 300.0; // changes the radius size
  float d1 = clamp(abs(distance(vBallPos0.xz, vPosition.xz)) / adJust, 0.0, 1.0);
  float d2 = clamp(abs(distance(vBallPos1.xz, vPosition.xz)) / adJust, 0.0, 1.0);
  float d3 = clamp(abs(distance(vBallPos2.xz, vPosition.xz)) / adJust, 0.0, 1.0);
  float d4 = clamp(abs(distance(vBallPos3.xz, vPosition.xz)) / adJust, 0.0, 1.0);
  float d = d1 * d2 * d3 * d4;
  vec3 color1 = vec3(1.0, 0.0, 0.0);
  vec3 color2 = vec3(0.0, 0.0, 1.0);
  d1 = smoothstep(-0.5, 1.0, d1); // gradient
  vec3 color = mix(color1, color2, d1);
  gl_FragColor = vec4(color, 1.0);
}
`;

export { vertexShader, fragmentShader };

/*
  vec3 origin = vec3(0, 0, 0);
  // float d = distance(origin, vPosition);
uniform vec3 vBallPos1;
uniform vec3 vBallPos2;
uniform vec3 vBallPos3; */
