import { ShaderMaterial, Layers } from 'three/build/three.module';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { Vector2 } from 'three/src/math/Vector2.js';

import Experience from '../Experience.js';

import vertexShader from './shaders/postprocessing/vertex.glsl.js';
import fragmentShader from './shaders/postprocessing/fragment.glsl.js';

export default class LoadingScreen {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.camera = this.experience.camera;
    this.renderer = this.experience.renderer;

    const BLOOM_SCENE = 1;

    const bloomLayer = new Layers();
    bloomLayer.set(BLOOM_SCENE);

    const params = {
      exposure: 1,
      bloomStrength: 5,
      bloomThreshold: 0,
      bloomRadius: 0,
      scene: 'Scene with Glow'
    };

    const renderScene = new RenderPass(this.scene, this.camera);

    const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    const bloomComposer = new EffectComposer(this.renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    const finalPass = new ShaderPass(
      new ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: bloomComposer.renderTarget2.texture }
        },
        vertexShader,
        fragmentShader,
        defines: {}
      }),
      'baseTexture'
    );
    finalPass.needsSwap = true;

    const finalComposer = new EffectComposer(this.renderer);
    finalComposer.addPass(renderScene);
    finalComposer.addPass(finalPass);
  }
}
