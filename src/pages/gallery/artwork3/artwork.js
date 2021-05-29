import React, { useRef, useEffect } from 'react';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PMREMGenerator,
  DefaultLoadingManager,
  sRGBEncoding,
  ACESFilmicToneMapping,
  Color,
  AmbientLight,
  GridHelper,
  ShaderMaterial,
  Clock,
  Vector3,
  Quaternion
} from 'three/build/three.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';
/* custom helper functions */
import Circle from './helpers/circle.js';
import { descartes, kToR } from './helpers/descartes.js';
import * as constants from './helpers/constants.js';
import * as fns from './helpers/functions.js';
import { createMatcapSphere, createWireframeSphere, createStaticBox } from './helpers/createMesh.js';
import animateToDest from './helpers/animate.js';
import { vertexShader, fragmentShader } from './helpers/shader.glsl.js';
/* clean up */
import disposeObjects from '../../../utils/dispose-objects';

const HAS_SHADERS = true;
const DEBUG = true;
const ROTATE_SCENE = false;

function Art() {
  const inputEl = useRef(null);

  useEffect(() => {
    return () => {
      require('../../../utils/dispose-objects');
      disposeObjects(inputEl.renderer, inputEl);
    };
  }, []);

  useEffect(() => {
    //----------------------------------
    //  THREE JS SETUP
    //----------------------------------

    // SCENE
    const scene = new Scene();
    scene.background = new Color('white'); ///new Color('rgb(242, 179, 255)');

    if (DEBUG) {
      scene.background = new Color('black');
    }
    // CAMERA
    const camera = new PerspectiveCamera(75, inputEl.current.offsetWidth / inputEl.current.offsetHeight, 0.1, 1500);
    camera.position.set(0, 600, 20);
    camera.updateProjectionMatrix();
    camera.lookAt(scene.position);

    // LIGHT
    const light = new AmbientLight(0x404040); // soft white light
    scene.add(light);

    // RENDERER
    const renderer = new WebGLRenderer();
    renderer.setSize(inputEl.current.offsetWidth, inputEl.current.offsetHeight);
    renderer.setPixelRatio(inputEl.current.offsetWidth / inputEl.current.offsetHeight);
    inputEl.current.append(renderer.domElement);

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);

    // REACT
    const pmremGenerator = new PMREMGenerator(renderer);

    // CLOCK
    const clock = new Clock();

    function init() {
      // REACT
      DefaultLoadingManager.onLoad = function () {
        pmremGenerator.dispose();
      };
      pmremGenerator.compileEquirectangularShader();
      renderer.outputEncoding = sRGBEncoding;
      renderer.toneMapping = ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;

      // CONTROLS
      controls.addEventListener('change', render);
      controls.enableZoom = true;
      controls.enablePan = false;
      controls.maxPolarAngle = Math.PI * 0.495;
      controls.target.set(0, 10, 0);
      controls.minDistance = 40.0;
      controls.maxDistance = 600.0;
      controls.update();
    }

    function initSceneHelper() {
      const gridHelper = new GridHelper(constants.options.grid.size, constants.options.grid.divisions);
      scene.add(gridHelper);
    }

    // MAIN FUNCTIONS

    //----------------------------------
    //  UTILIZING DESCARTES
    //----------------------------------

    function changeMeshToHaveShaders(set) {
      const material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      });
      meshSets[set].forEach((mesh) => {
        mesh.material = material;
      });
    }

    function insertDescartes(tangentCircles, set) {
      const results = descartes(tangentCircles);
      let circObj = [];
      results.centers.forEach((center) => {
        results.curvatures.forEach((curve) => {
          let c = new Circle(kToR(curve), center, curve > 0 ? 1 : 2);
          circObj.push(c);
        });
      });
      circObj.forEach((circle) => {
        createWireframeSphere(scene, circle.r, circle.z.re, 0, circle.z.im);
      });
      if (HAS_SHADERS) {
        changeMeshToHaveShaders(set);
      }
    }

    //----------------------------------
    //  SCENE
    //----------------------------------

    // GLOBALS
    var meshSets = []; // stores all the meshes, 2D array of distinct groups
    var ground = null;
    var toggles = [];
    var collisionCnt = [];
    var uniforms = {}; // for shaders
    const destPosSets = constants.destPosSets;
    const seedSets = constants.seedOpts;
    const NUM_SETS = 4;

    function initScene() {
      initSets();
      initGround();
      initObjs(constants.seedOpts);
      if (HAS_SHADERS) {
        initShaderMaterial();
      }
      if (DEBUG) {
        console.log('finished init scene');
      }
    }

    function initSets() {
      ground = null;
      meshSets = [];
      toggles = [];
      for (let set = 0; set < NUM_SETS; set++) {
        meshSets.push([]);
        collisionCnt[set] = 0;
        toggles.push({
          hasDescartes: false,
          animates: false
        });
      }
    }

    function initGround() {
      let box = createStaticBox(scene, constants.groundInfo.size, constants.groundInfo.pos, [0, 0, 0], 0xffffff);
      ground = box;
    }

    function initShaderMaterial() {
      const circ0 = meshSets[0][0];
      const circ1 = meshSets[1][0];
      const circ2 = meshSets[2][0];
      const circ3 = meshSets[3][0];
      uniforms = {
        vBallPos0: {
          value: {
            x: circ0.position.x,
            y: circ0.position.y,
            z: circ0.position.z
          }
        },
        vBallPos1: {
          value: {
            x: circ1.position.x,
            y: circ1.position.y,
            z: circ1.position.z
          }
        },
        vBallPos2: {
          value: {
            x: circ2.position.x,
            y: circ2.position.y,
            z: circ2.position.z
          }
        },
        vBallPos3: {
          value: {
            x: circ3.position.x,
            y: circ3.position.y,
            z: circ3.position.z
          }
        },
        u_time: { value: 0.0 }
      };

      const material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      });

      ground.material = material;
      if (DEBUG) {
        console.log("init shader material's ground", ground.material);
      }
    }

    function populateOneSet(seedOpts, set) {
      let r, x, y, z;
      for (let i = 0; i < seedOpts.length; i++) {
        r = seedOpts[i].r;
        x = seedOpts[i].x;
        y = seedOpts[i].y;
        z = seedOpts[i].z;
        meshSets[set][i] = createMatcapSphere(scene, r, x, y, z);
        scene.add(meshSets[set][i]);
      }
    }

    function initObjs() {
      for (let set = 0; set < NUM_SETS; set++) {
        populateOneSet(seedSets[set], set);
      }
      if (DEBUG) {
        console.log('finished populate');
      }
    }

    function checkCollision() {
      let meshes;

      for (let set = 0; set < NUM_SETS; set++) {
        meshes = meshSets[set];

        if (meshes.some(fns.hasTween)) {
          let circA, circB, d, rSum, aTween, bTween;
          for (let i = 0; i < meshes.length - 1; i++) {
            circA = meshes[i];
            circB = meshes[i + 1];
            aTween = gsap.isTweening(circA.position);
            bTween = gsap.isTweening(circB.position);
            if (aTween || bTween) {
              d = fns.dist(circA.position.x, circA.position.z, circB.position.x, circB.position.z);
              rSum = circA.geometry.parameters.radius + circB.geometry.parameters.radius;
              if (d < rSum + constants.collisionPadding) {
                if (aTween) {
                  gsap.killTweensOf(circA.position);
                  collisionCnt[set] += 1;
                  if (DEBUG) {
                    console.log('killed tween on collision');
                  }
                }
                if (bTween) {
                  gsap.killTweensOf(circB.position);
                  if (DEBUG) {
                    console.log('killed tween on collision');
                  }
                  collisionCnt[set] += 1;
                }
              }
            }
          }
        }

        if (!toggles[set].hasDescartes && collisionCnt[set] === meshes.length) {
          if (DEBUG) {
            console.log('going to insert descartes');
          }
          const tangentCircles = fns.meshesToCircles(meshes);
          insertDescartes(tangentCircles, set);
          toggles[set].hasDescartes = true;
        }
      }
    }

    function loop() {
      render();
      checkCollision();
      requestAnimationFrame(loop);
    }

    const quaternion = new Quaternion();
    const axis = new Vector3(0, 1, 0);

    function render() {
      renderer.render(scene, camera);
      if (HAS_SHADERS) {
        fns.updateUniforms(uniforms, clock, meshSets);
      }
      if (ROTATE_SCENE) {
        quaternion.setFromAxisAngle(axis, Math.PI / 200);
        camera.position.applyQuaternion(quaternion);
      }
    }

    function initFuncs() {
      init(constants.options);
      if (DEBUG) {
        initSceneHelper();
      }
      initScene();
    }

    function run() {
      initFuncs();
      for (let set = 0; set < NUM_SETS; set++) {
        animateToDest(scene, meshSets[set], destPosSets[set], camera);
      }
      loop();
    }

    // RUN

    run();
  }, []);
  return (
    <>
      <div ref={inputEl}></div>
    </>
  );
}

export default Art;
