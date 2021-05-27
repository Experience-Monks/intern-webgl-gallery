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
uniform float u_time;
uniform vec3 vBallPos0;
uniform vec3 vBallPos1;
uniform vec3 vBallPos2;
uniform vec3 vBallPos3;

#define PI 3.14159265359

float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(55.9898,78.233)))* 43758.5453123);
}

void main (void)
{
  float adJust = 150.0; // changes the radius size
  float d1 = clamp(abs(distance(vBallPos0.xz, vPosition.xz)) / adJust, 0.0, 1.0);
  float d2 = clamp(abs(distance(vBallPos1.xz, vPosition.xz)) / adJust, 0.0, 1.0);
  float d3 = clamp(abs(distance(vBallPos2.xz, vPosition.xz)) / adJust, 0.0, 1.0);
  float d4 = clamp(abs(distance(vBallPos3.xz, vPosition.xz)) / adJust, 0.0, 1.0);
  float stepMin = 0.4;
  float stepMax = 1.0;
  d1 = smoothstep(stepMin, stepMax, d1);
  d2 = smoothstep(stepMin, stepMax, d2);
  d3 = smoothstep(stepMin, stepMax, d3);
  d4 = smoothstep(stepMin, stepMax, d4);
  float d = d1 * d2 * d3 * d4;
 
  vec3 color1 = vec3(0.6, 0.5, 0.8);
  vec3 color2 = vec3(0.9, 0.4, 0.7);
  vec3 color3 = vec3(0.2, 0.5, 0.3);
  vec3 color4 = vec3(0.7, 0.2, 0.5);
  vec3 color5 = vec3(0.3, 0.2, 0.1);

  vec3 mix1 = mix(color1, color2, d1);
  vec3 mix2 = mix(mix1, color3, d2);
  vec3 mix3 = mix(mix2, color4, d3);
  vec3 mix4 = mix(mix3, color5, d4);
  vec3 color = mix1 * mix2 * mix3 / mix4; 

  color = mix(color2, color1, d + random(vPosition.xz) * sin(u_time + d) / (0.5 + fract(abs(cos(u_time + vPosition.x)))));
  gl_FragColor = vec4(vec3(d, color.b, color.g), 1.0);
}
`;

export { vertexShader, fragmentShader };

/*
  vec3 origin = vec3(0, 0, 0);
  // float d = distance(origin, vPosition);
uniform vec3 vBallPos1;
uniform vec3 vBallPos2;
uniform vec3 vBallPos3; */
