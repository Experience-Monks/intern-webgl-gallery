import { Color } from 'three/build/three.module.js';

/**
 * Colorify shader
 */

const ColorifyShader = {
  uniforms: {
    tDiffuse: { value: null },
    color1: { value: new Color(0xffffff) },
    color2: { value: new Color(0xff7701) },
    amount: { value: 0.03 }
  },

  vertexShader: /* glsl */ `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

  fragmentShader: /* glsl */ `
		uniform vec3 color1;
        uniform vec3 color2;
		uniform sampler2D tDiffuse;
        uniform float amount;
        
		varying vec2 vUv;
		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
            vec4 gradient = mix(vec4(color1, 1), vec4(color2, 1), vUv.y);
            vec4 finalColor = mix(texel, texel*gradient, amount);
            gl_FragColor = finalColor;
		}`
};

export { ColorifyShader };
