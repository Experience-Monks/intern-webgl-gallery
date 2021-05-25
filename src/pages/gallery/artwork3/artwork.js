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
  GridHelper
} from 'three/build/three.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';
import * as OIMO from 'oimo';
/* custom helper functions */
import Circle from './helpers/circle.js';
import { descartes, kToR } from './helpers/descartes.js';
import * as constants from './helpers/constants.js';
import * as fns from './helpers/functions.js';
import { createSphere, createStaticBox, createShapeAlong2DPath } from './helpers/createMesh.js';
import animateToOrigin from './helpers/animate.js';

//add more imports here, such as the controllers and loaders etc

function Art() {
  const inputEl = useRef(null);

  useEffect(() => {
    //----------------------------------
    //  THREE JS SETUP
    //----------------------------------

    // SCENE
    const scene = new Scene();
    scene.background = new Color(constants.options.backgroundColor);

    // CAMERA
    const camera = new PerspectiveCamera(75, inputEl.current.offsetWidth / inputEl.current.offsetHeight, 0.1, 1000);
    // camera.position.set(constants.options.cameraPosition);
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
    // scene.fog = new    Fog(opts.backgroundColor, opts.fog.near, opts.fog.far);

    // REACT
    const pmremGenerator = new PMREMGenerator(renderer);

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

    function insertDescartes(tangentCircles) {
      const results = descartes(tangentCircles);
      let circObj = [];
      results.centers.forEach((center) => {
        results.curvatures.forEach((curve) => {
          let c = new Circle(kToR(curve), center, curve > 0 ? 1 : 2);
          circObj.push(c);
        });
      });
      circObj.forEach((circle) => {
        if (circle.type < 2) {
          createSphere(scene, circle.r, circle.z.re, 0, circle.z.im, 10, true);
        } else {
          createShapeAlong2DPath(scene, circle, createSphere, true, 10, 15);
        }
      });
    }

    //----------------------------------
    //  OIMO PHYSICS
    //----------------------------------

    // OIMO GLOBALS
    var world = null;
    var meshSets = []; // stores all the meshes, 2D array of distinct groups
    var bodySets = []; // rigid bodies, 2D array
    var grounds = [];
    var toggles = [];
    var collideSets = [];
    const destPosSets = constants.destPosSets;
    const seedSets = constants.seedOpts;
    const NUM_SETS = seedSets.length;

    function initOimoPhysics() {
      world = new OIMO.World({ info: true, worldscale: 100 });
      world.clear();
      initSets();
      initGround();
      populate(constants.seedOpts);
      console.log('finished init oimo');
    }

    function initSets() {
      for (let i = 0; i < NUM_SETS; i++) {
        meshSets.push([]);
        bodySets.push([]);
        collideSets.push(0);
        toggles.push({
          hasDescartes: false,
          animates: false
        });
      }
    }

    function initGround() {
      world.add({
        size: constants.groundInfo.size,
        pos: constants.groundInfo.pos,
        world: world
      });
      let box = createStaticBox(scene, constants.groundInfo.size, constants.groundInfo.pos, [0, 0, 0], 0xffffff);
      grounds.push(box);
    }

    function populateOneSet(seedOpts, set) {
      let r, x, y, z;
      for (let i = 0; i < seedOpts.length; i++) {
        [r, x, y, z] = [seedOpts[i].r, seedOpts[i].x, seedOpts[i].y, seedOpts[i].z];
        bodySets[set][i] = world.add({
          type: 'sphere',
          size: [r, r, r],
          pos: [x, y, z],
          move: true,
          world: world
        });
        meshSets[set][i] = createSphere(scene, r, x, y, z, true);
        scene.add(meshSets[set][i]);
      }
    }

    function populate() {
      for (let set = 0; set < NUM_SETS; set++) {
        populateOneSet(seedSets[set], set);
      }
      console.log('finished populate');
      console.log('bodySets', bodySets, 'meshSets', meshSets);
    }

    function updateAnimation() {
      let bodies;
      for (let set = 0; set < NUM_SETS; set++) {
        bodies = bodySets[set];
        if (bodies.every(fns.isAsleep) && !toggles[set].animated) {
          console.log('all bodies are asleep');
          animateToOrigin(meshSets[set], destPosSets[set]);
          toggles[set].animated = true;
        }
      }
    }

    function updateOimoPhysics() {
      if (world == null) return;
      world.step();
      updateAnimation();

      let mesh, body, bodies, meshes, i;

      for (let set = 0; set < NUM_SETS; set++) {
        i = bodySets[set].length;
        bodies = bodySets[set];
        meshes = meshSets[set];

        while (i--) {
          body = bodies[i];
          mesh = meshes[i];

          if (!body.sleeping) {
            mesh.position.copy(body.getPosition());
            mesh.quaternion.copy(body.getQuaternion());
          }
        }
      }
    }

    function checkCollision() {
      if (world == null) return;
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
                  collideSets[set] += 1;
                }
                if (bTween) {
                  gsap.killTweensOf(circB.position);
                  collideSets[set] += 1;
                }
              }
            }
          }
        }
        const allCollided = collideSets[set] === meshSets[set].length;

        if (toggles[set].animated && !toggles[set].hasDescartes && allCollided) {
          console.log('going to insert descartes');
          const tangentCircles = fns.meshesToCircles(meshes);
          insertDescartes(tangentCircles);
          toggles[set].hasDescartes = true;
        }
      }
    }

    function loop() {
      updateOimoPhysics();
      render();
      checkCollision();
      requestAnimationFrame(loop);
    }

    function render() {
      renderer.render(scene, camera);
    }

    function run() {
      init(constants.options);
      initSceneHelper();
      initOimoPhysics();
      // testPopulate();
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
