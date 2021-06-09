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
uniform vec3 vBallPos4;
uniform vec3 vBallPos5;
uniform vec3 vCenter;
uniform float radius;

#define PI 3.14159265359

float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

void main (void)
{
  // constants
  vec3 color1 = vec3(0.6, 0.2, 0.5);
  vec3 color2 = vec3(0.1, 0.4, 0.9);
  vec3 color3 = vec3(0.4, 0.3, 0.3);
  vec3 color4 = vec3(0.7, 0.2, 0.5);
  vec3 color5 = vec3(0.4, 0.4, 0.4);
  float adJust = radius + 100.0; // changes the radius size
  float stepMin = -0.35;
  float stepMax = 1.0;

  // get distances
  float d1 = clamp(abs(distance(vBallPos0.xz, vPosition.xz)) / adJust, 0.0, 1.0);
  float d2 = clamp(abs(distance(vBallPos1.xz, vPosition.xz)) / adJust, 0.0, 1.0);
  float d3 = clamp(abs(distance(vBallPos2.xz, vPosition.xz)) / adJust, 0.0, 1.0);
  float d4 = clamp(abs(distance(vBallPos3.xz, vPosition.xz)) / adJust, 0.0, 1.0);
  float d5 = clamp(abs(distance(vBallPos4.xz, vPosition.xz)) / adJust, 0.0, 1.0);
  float d6 = clamp(abs(distance(vBallPos5.xz, vPosition.xz)) / adJust, 0.0, 1.0);

  // smoothstep
  d1 = smoothstep(stepMin, stepMax, d1);
  d2 = smoothstep(stepMin, stepMax, d2);
  d3 = smoothstep(stepMin, stepMax, d3);
  d4 = smoothstep(stepMin, stepMax, d4);
  d5 = smoothstep(stepMin, stepMax, d5);
  d6 = smoothstep(stepMin, stepMax, d6); 

  // assemble colors
  float d = d1 * d2 * d3 * d4 * d5 * d6;

  // mixes explorations
  vec3 mix1 = mix(color1, color2, d1);
  vec3 mix2 = mix(color1, color2, d2);
  vec3 mix3 = mix(color1, color2, d3);
  vec3 mix4 = mix(color1, color2, d4);
  vec3 mix5 = mix(color1, color2, d5);
  vec3 mix6 = mix(color1, color2, d6);
  vec3 color = mix1 * mix2 * mix3 * mix4 * mix5 * mix6; 

  // final output
  float mixVal = d + random(vPosition.xy) * abs(sin(u_time +cos(vPosition.z / d)));
  color = mix(color, color4, mixVal);
  float diagPattern = abs(sin(u_time / (vPosition.x / vPosition.z)));
  float r = clamp(color.r + 0.15 * (1.0 - diagPattern), 0.1, 0.85);
  float g = clamp(color.g + 0.7 * (radius / 100.0) * diagPattern, 0.1, 0.35);
  float b = clamp(vNormal.x +  abs(sin(u_time) * diagPattern), 0.1, 0.75);
  gl_FragColor = vec4(r, 1.0-g, 1.0-b, 1.0);
}
`;

export { vertexShader, fragmentShader };

/*
  vec3 origin = vec3(0, 0, 0);
  // float d = distance(origin, vPosition);
uniform vec3 vBallPos1;
uniform vec3 vBallPos2;
uniform vec3 vBallPos3; 


  float d1 = clamp(abs(distance(vBallPos0.xz, vCenter.xz)) / adJust, 0.0, 1.0);
  float d2 = clamp(abs(distance(vBallPos1.xz, vCenter.xz)) / adJust, 0.0, 1.0);
  float d3 = clamp(abs(distance(vBallPos2.xz, vCenter.xz)) / adJust, 0.0, 1.0);
  float d4 = clamp(abs(distance(vBallPos3.xz, vCenter.xz)) / adJust, 0.0, 1.0);

  float d1 = clamp(abs(distance(vBallPos0.xz, vPosition.xz)) / adJust, 0.0, 1.0);
  float d2 = clamp(abs(distance(vBallPos1.xz, vPosition.xz)) / adJust, 0.0, 1.0);
  float d3 = clamp(abs(distance(vBallPos2.xz, vPosition.xz)) / adJust, 0.0, 1.0);
  float d4 = clamp(abs(distance(vBallPos3.xz, vPosition.xz)) / adJust, 0.0, 1.0);
*/
