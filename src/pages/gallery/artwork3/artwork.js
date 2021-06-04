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
  Clock,
  Vector3,
  Quaternion,
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

const HAS_SHADERS = false;
const DEBUG = true;
const ROTATE_SCENE = false;
const INIT_TIMES = 6;

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

    // MAIN FUNCTIONS

    //----------------------------------
    //  UTILIZING DESCARTES
    //----------------------------------

    function changeMeshToHaveShaders(set) {
      /*
      const material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      });
      meshSets[set].forEach((mesh) => {
        mesh.material = material;
      });
      */
    }
    function circlesFromRadiusCurvature(results) {
      let c;
      let circObjs = [];
      results.centers.forEach((center) => {
        results.curvatures.forEach((curve) => {
          c = new Circle(kToR(curve), center, curve > 0 ? 1 : 2);
          circObjs.push(c);
        });
      });
      return circObjs;
    }

    function addMeshesFromCircObjs(circObjs) {
      let mesh;
      circObjs.forEach((circle) => {
        mesh = createWireframeSphere(scene, circle.r, circle.z.re, 0, circle.z.im);
        if (circle.k < 0) {
          centerCircle = mesh;
          if (DEBUG) {
            console.log('updated centerCircle to', mesh);
          }
        }
      });
    }

    function insertDescartes(tangentCircles) {
      if (DEBUG) {
        console.log('inputs to insertDescartes', tangentCircles);
      }
      const results = descartes(tangentCircles);
      const circObjs = circlesFromRadiusCurvature(results);
      addMeshesFromCircObjs(circObjs);
      if (HAS_SHADERS) {
        // changeMeshToHaveShaders(set);
      }
    }

    //----------------------------------
    //  SCENE
    //----------------------------------

    // GLOBALS
    var ground = null;
    var uniforms = {}; // for shaders

    var quaternion;
    const axis = new Vector3(0, 1, 0);

    // CIRCLES IN SCREEN
    var centerCircle = null; // we keep on updating and keep track of the center circle
    var leftCircle = null;
    var rightCircle = null;
    var leftCircleStatic = false;
    var rightCircleStatic = false;

    // CIRCLES CONSTANTS
    var centerCircleR = constants.centerCircleStartR;
    var sideCircleR = centerCircleR * 0.85;

    //----------------------------------
    //  INIT FUNCTIONS
    //----------------------------------

    function initScene() {
      initGround();
      initCenterCircle();
      if (HAS_SHADERS) {
        // initShaderMaterial();
      }
      if (ROTATE_SCENE) {
        quaternion = new Quaternion();
      }
      if (DEBUG) {
        console.log('finished init scene');
      }
    }

    function updateCircleParams() {
      sideCircleR = centerCircle.geometry.parameters.radius * 0.85;
    }

    var initTimes = 0;

    /* add new circles into the scene, only init for bounded times. */
    function reInit() {
      leftCircleStatic = false;
      rightCircleStatic = false;
      updateCircleParams();
      addTwoCircles();
      animateSideCircles();
      initTimes += 1;
      if (DEBUG) {
        console.log('Just reinit. Current initTimes:', initTimes);
      }
    }

    function initCenterCircle() {
      centerCircle = createWireframeSphere(
        scene,
        centerCircleR,
        constants.centerCircleStartPos.x,
        constants.centerCircleStartPos.y,
        constants.centerCircleStartPos.z
      );
    }

    function initSceneHelper() {
      const gridHelper = new GridHelper(constants.options.grid.size, constants.options.grid.divisions);
      scene.add(gridHelper);
    }

    function initGround() {
      let box = createStaticBox(scene, constants.groundInfo.size, constants.groundInfo.pos, [0, 0, 0], 0x0);
      ground = box;
    }

    //----------------------------------
    // LOOP FUNCTIONS
    //----------------------------------

    function checkCollision() {
      if (!leftCircleStatic || !rightCircleStatic) {
        const lTween = leftCircle === null ? false : gsap.isTweening(leftCircle.position);
        const rTween = rightCircle === null ? false : gsap.isTweening(rightCircle.position);
        if (lTween) {
          if (fns.isColliding(leftCircle, centerCircle)) {
            gsap.killTweensOf(leftCircle.position);
            leftCircleStatic = true;
            if (DEBUG) {
              console.log('left circle has collided');
            }
          }
        }

        if (rTween) {
          if (fns.isColliding(rightCircle, centerCircle)) {
            gsap.killTweensOf(rightCircle.position);
            rightCircleStatic = true;
            if (DEBUG) {
              console.log('right circle has collided');
            }
          }
        }
      }
    }

    function checkInsertDes() {
      if (leftCircleStatic && rightCircleStatic) {
        const tangentCircles = [leftCircle, centerCircle, rightCircle];
        insertDescartes(fns.meshesToCircles(tangentCircles));
        reInit();
      }
    }

    function addTwoCircles() {
      leftCircle = createWireframeSphere(
        scene,
        sideCircleR,
        constants.leftCircleStartPos.x,
        constants.leftCircleStartPos.y,
        constants.leftCircleStartPos.z
      );
      rightCircle = createWireframeSphere(
        scene,
        sideCircleR,
        constants.rightCircleStartPos.x,
        constants.rightCircleStartPos.y,
        constants.rightCircleStartPos.z
      );
    }

    function animateSideCircles() {
      const dest = new Vector3(
        centerCircle.position.x - centerCircle.geometry.parameters.radius / 2,
        centerCircle.position.y,
        centerCircle.position.z - centerCircle.geometry.parameters.radius / 2
      );
      if (DEBUG) {
        console.log('new dest is', dest);
      }
      animateToDest(leftCircle, dest);
      animateToDest(rightCircle, dest);
    }

    function loop() {
      render();
      checkCollision();
      if (initTimes < INIT_TIMES) {
        checkInsertDes();
      }
      requestAnimationFrame(loop);
    }

    function render() {
      renderer.render(scene, camera);
      if (HAS_SHADERS) {
        // fns.updateUniforms(uniforms, clock, meshSets);
      }
      if (ROTATE_SCENE) {
        quaternion.setFromAxisAngle(axis, Math.PI / 200);
        camera.position.applyQuaternion(quaternion);
      }
    }

    function initSetup() {
      init(constants.options);
      if (DEBUG) {
        initSceneHelper();
      }
    }

    function run() {
      initSetup();
      initScene();
      addTwoCircles();
      animateSideCircles();
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

/*
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
    }*/
