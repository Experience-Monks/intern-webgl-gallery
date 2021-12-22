import { WebGLRenderer, sRGBEncoding, CineonToneMapping, PCFSoftShadowMap, ShaderMaterial, Vector2 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

import Experience from './Experience';

import vertexShader from './World/shaders/postprocessing/vertex.glsl.js';
import fragmentShader from './World/shaders/postprocessing/fragment.glsl.js';

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.setInstance();
    this.setPostProcessing();
  }

  setInstance() {
    this.instance = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });

    this.instance.physicallyCorrectLights = true;
    this.instance.outputEncoding = sRGBEncoding;
    this.instance.toneMapping = CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = PCFSoftShadowMap;
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  setPostProcessing() {
    const params = {
      exposure: 1,
      bloomStrength: 0.7,
      bloomThreshold: 1,
      bloomRadius: 3
    };

    this.renderScene = new RenderPass(this.scene, this.camera.instance);

    this.bloomPass = new UnrealBloomPass(new Vector2(this.sizes.width, this.sizes.height), 1.5, 0.4, 0.85);
    this.bloomPass.threshold = params.bloomThreshold;
    this.bloomPass.strength = params.bloomStrength;
    this.bloomPass.radius = params.bloomRadius;

    this.bloomComposer = new EffectComposer(this.instance);
    this.bloomComposer.renderToScreen = false;
    this.bloomComposer.addPass(this.renderScene);
    this.bloomComposer.addPass(this.bloomPass);

    this.finalPass = new ShaderPass(
      new ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
        },
        vertexShader,
        fragmentShader,
        defines: {}
      }),
      'baseTexture'
    );
    this.finalPass.needsSwap = true;

    this.finalComposer = new EffectComposer(this.instance);
    this.finalComposer.addPass(this.renderScene);
    this.finalComposer.addPass(this.finalPass);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.bloomComposer.setSize(this.sizes.width, this.sizes.height);
    this.finalComposer.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    this.bloomComposer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    this.finalComposer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  update() {
    this.bloomComposer.render();
    this.finalComposer.render();
  }
}
