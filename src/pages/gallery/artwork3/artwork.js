/* library helpers */
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
  ShaderMaterial
} from 'three/build/three.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';
/* custom helper functions */
import Circle from './helpers/circle.js';
import { descartes, kToR } from './helpers/descartes.js';
import * as constants from './helpers/constants.js';
import * as fns from './helpers/functions.js';
import { createMatcapSphere, createWireframeSphere, createStaticBox } from './helpers/createMesh.js';
import { animateToDest, animateToScale } from './helpers/animate.js';
import { vertexShader, fragmentShader } from './helpers/shader.glsl.js';
/* clean up */
import disposeObjects from '../../../utils/dispose-objects';

const HAS_SHADERS = true;
const DEBUG = false;
const ROTATE_SCENE = true;
const INIT_TIMES = 5;

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
    scene.background = new Color('white');

    if (DEBUG) {
      scene.background = new Color('black');
    }
    // CAMERA
    const camera = new PerspectiveCamera(75, inputEl.current.offsetWidth / inputEl.current.offsetHeight, 0.1, 1500);
    camera.position.set(0, 600, 20);
    camera.updateProjectionMatrix();
    camera.lookAt(scene.position);

    // LIGHT
    const light = new AmbientLight(0x404040);
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
    //  SHADERS
    //----------------------------------

    function changeMeshToHaveShaders(set) {
      const material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      });
    }

    /* when we init shader material, none of the spheres are present yet */
    function initShaderMaterial() {
      uniforms = {
        vBallPos0: {
          value: uniformDefault
        },
        vBallPos1: {
          value: uniformDefault
        },
        vBallPos2: {
          value: uniformDefault
        },
        vBallPos3: {
          value: uniformDefault
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

    //----------------------------------
    //  UTILIZING DESCARTES
    //----------------------------------
    /*
     * Utility function that takes a set of radii and curvatures and returns a list of Circle objects *
     */
    function circlesFromRadiusCurvature(results) {
      let circle;
      let circObjs = [];
      results.centers.forEach((center) => {
        results.curvatures.forEach((curve) => {
          circle = new Circle(kToR(curve), center, curve > 0 ? 1 : 2);
          circObjs.push(circle);
        });
      });
      return circObjs;
    }

    /*
     * Utility function that adds sphere meshes  into the scene from a list of Circle obj
     * (1) Create mesh
     * (2) Animate its scale to appear gradually
     */
    function addMeshesFromCircObjs(circObjs) {
      let mesh;
      circObjs.forEach((circle) => {
        mesh = createWireframeSphere(scene, circle.r, circle.z.re, 0, circle.z.im);
        animateToScale(mesh, Math.abs(circle.r));
        // if it's a big sphere covering small spheres
        if (circle.k < 0) {
          centerCircle = mesh;
          bigSphereMeshes.push(mesh);
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
      if (DEBUG) {
        console.log('Big spheres in scene', bigSphereMeshes.length);
      }
      if (HAS_SHADERS) {
        // changeMeshToHaveShaders(set);
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
      // destination changes as our center circle differs
      const dest = new Vector3(
        centerCircle.position.x - centerCircle.geometry.parameters.radius / 2,
        centerCircle.position.y,
        centerCircle.position.z - centerCircle.geometry.parameters.radius / 2
      );
      if (DEBUG) {
        console.log('new dest is', dest);
      }
      animateToScale(leftCircle, leftCircle.geometry.parameters.radius);
      animateToScale(rightCircle, rightCircle.geometry.parameters.radius);
      animateToDest(leftCircle, dest);
      animateToDest(rightCircle, dest);
    }

    //----------------------------------
    //  SCENE
    //----------------------------------

    // GLOBALS
    var initCnt = 0;
    var quaternion;

    // SHADERS
    var uniforms = {}; // for shaders
    const uniformDefault = {
      x: constants.centerCircleStartPos.x,
      y: constants.centerCircleStartPos.y,
      z: constants.centerCircleStartPos.z
    };
    var ground = null;
    var bigSphereMeshes = [];

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
        initShaderMaterial();
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
    /* add new circles into the scene, only init for bounded times. */
    function insertNewSideCircles() {
      leftCircleStatic = false;
      rightCircleStatic = false;
      updateCircleParams();
      addTwoCircles();
      animateSideCircles();
      initCnt += 1;
      if (DEBUG) {
        console.log('Just insertNewSideCircles. Current initCnt:', initCnt);
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
      animateToScale(centerCircle, centerCircleR);
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
        insertNewSideCircles();
      }
    }

    function loop() {
      render();
      checkCollision();
      if (initCnt < INIT_TIMES) {
        checkInsertDes();
      }
      requestAnimationFrame(loop);
    }

    function render() {
      renderer.render(scene, camera);
      if (HAS_SHADERS) {
        fns.updateUniforms(uniforms, clock, bigSphereMeshes);
      }
      if (ROTATE_SCENE) {
        quaternion.setFromAxisAngle(constants.Yaxis, Math.PI / 200);
        camera.position.applyQuaternion(quaternion);
      }
    }

    function initSetup() {
      init(constants.options);
      if (DEBUG) {
        initSceneHelper();
      }
    }

    function initAnimation() {
      addTwoCircles();
      animateSideCircles();
    }

    function run() {
      initSetup();
      initScene();
      initAnimation();
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
