import React, { useRef, useEffect } from 'react';

import {
  Color,
  Fog,
  AmbientLight,
  Scene,
  Clock,
  Vector2,
  PerspectiveCamera,
  BoxGeometry,
  Mesh,
  Group,
  WebGLRenderer,
  Vector3,
  DirectionalLight,
  TextureLoader,
  Raycaster,
  MeshLambertMaterial,
  PlaneGeometry,
  WireframeGeometry,
  LineBasicMaterial,
  LineSegments,
  ReinhardToneMapping,
  Line,
  BufferGeometry,
  Object3D,
  ShapeGeometry,
  DoubleSide,
  FontLoader,
  MeshBasicMaterial,
  RGBA_ASTC_5x4_Format
} from 'three/build/three.module';

import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from '../utils/threejs/GlitchPass.js';
//import { OrbitControls } from '../utils/threejs/OrbitControls';
import disposeObjects from '../utils/dispose-objects.js';

function Art() {
  const inputEl = useRef(null);

  useEffect(() => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, inputEl.current.offsetWidth / inputEl.current.offsetHeight, 0.1, 1000);
    const renderer = new WebGLRenderer({ antialias: true });

    renderer.setPixelRatio(inputEl.current.offsetWidth / inputEl.current.offsetHeight);
    renderer.setSize(inputEl.current.offsetWidth, inputEl.current.offsetHeight);
    inputEl.current.append(renderer.domElement);
    renderer.toneMapping = ReinhardToneMapping;

    inputEl.current.addEventListener('mousemove', onPointerMove);
    inputEl.current.addEventListener('resize', onWindowResize);
    inputEl.current.addEventListener('click', onMouseClick);

    const raycaster = new Raycaster();
    const directionalLight = new DirectionalLight(0xff00ff, 0.5);
    const group = new Group();
    const mouse = new Vector2();
    let INTERSECTED;
    let wireframe;
    let matLineBasic;
    let composer;
    let redirect;

    const glitchPass = new GlitchPass();
    let begin = false;
    const clock = new Clock();
    let timer = 0.55;
    let transitionBegin = false;

    function resetGlobalVariables() {
      INTERSECTED = null;
      wireframe = null;
      matLineBasic = null;
      composer = null;
      redirect = null;
      begin = false;
      timer = 0.55;
      transitionBegin = false;
    }

    function onWindowResize() {
      camera.aspect = inputEl.current.offsetWidth / inputEl.current.offsetHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(inputEl.current.offsetWidth, inputEl.current.offsetHeight);

      composer.setSize(inputEl.current.offsetWidth, inputEl.current.offsetHeight);
    }

    function onMouseClick(event) {
      glitchPass.activate();
      console.log(timer);
      if (INTERSECTED && begin && !transitionBegin) {
        redirect = INTERSECTED.userData.url;
        transitionBegin = true;
      }

      if (!INTERSECTED) {
        redirect = null;
      }

      if (!begin) {
        camera.userData.targetZ = 80;
        begin = true;
      }
    }

    function onPointerMove(event) {
      mouse.x = (event.clientX / inputEl.current.offsetWidth) * 2 - 1;
      mouse.y = -(event.clientY / inputEl.current.offsetHeight) * 2 + 1;
    }

    function animate() {
      if (transitionBegin) {
        timer -= clock.getDelta();
      }
      if (timer <= 0) {
        window.location = redirect;
        cancelAnimationFrame(this);
        resetGlobalVariables();
        scene.remove.apply(scene, scene.children);
        console.log('done!');
      } else {
        requestAnimationFrame(animate);
        render();
        composer.render();
      }
    }

    function render() {
      camera.position.x += (mouse.x - camera.position.x) * 0.5;
      camera.position.y += (-mouse.y - camera.position.y) * 1.5;
      if (camera.position.z - camera.userData.targetZ > 5) {
        camera.position.z -= 10 * 1.5;
      }
      camera.lookAt(scene.position);

      if (begin) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(group.children);

        //console.log(group.children);
        if (intersects.length > 0) {
          if (INTERSECTED !== intersects[0].object) {
            if (INTERSECTED) {
              INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
              INTERSECTED.material.emissiveIntensity = 0.5;
            }

            INTERSECTED = intersects[0].object;
            //console.log('new intersect ');
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0x08fbff);
            INTERSECTED.material.emissiveIntensity = 0.5;
          }
        } else {
          if (INTERSECTED) {
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            INTERSECTED.material.emissiveIntensity = 0.5;
          }
          INTERSECTED = null;
        }
      }
      renderer.render(scene, camera);
    }

    function init() {
      scene.background = new Color(0x000000);
      scene.fog = new Fog(0x050505, 2000, 3500);
      scene.add(new AmbientLight(0x444444));
      directionalLight.position.set(0, -1, 0);
      scene.add(directionalLight);

      const loader = new FontLoader();
      loader.load('assets/fonts/Press_Start_2P/PressStart.json', function (font) {
        const color = 0x006699;

        const matDark = new LineBasicMaterial({
          color: color,
          side: DoubleSide
        });

        const matLite = new MeshBasicMaterial({
          color: 0x08fbff,
          transparent: true,
          opacity: 0.4,
          side: DoubleSide
        });

        const message = 'WE3 \nGallery';
        const shapes = font.generateShapes(message, 100);

        const enterMessage = 'click anywhere to enter';
        const enterShapes = font.generateShapes(enterMessage, 10);

        const geometry = new ShapeGeometry(shapes);
        const enterGeo = new ShapeGeometry(enterShapes);

        geometry.computeBoundingBox();
        enterGeo.computeBoundingBox();
        const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

        geometry.translate(xMid, 0, 0);
        enterGeo.translate(xMid, 100, 0);

        // make shape ( N.B. edge view not visible )

        const text = new Mesh(geometry, matLite);
        text.position.z = -800;
        text.position.y = 300;
        scene.add(text);

        const enterText = new Mesh(enterGeo, matLite);
        enterText.position.z = 800;
        enterText.position.y = -300;
        scene.add(enterText);
        // make line shape ( N.B. edge view remains visible )

        const holeShapes = [];

        for (let i = 0; i < shapes.length; i++) {
          const shape = shapes[i];

          if (shape.holes && shape.holes.length > 0) {
            for (let j = 0; j < shape.holes.length; j++) {
              const hole = shape.holes[j];
              holeShapes.push(hole);
            }
          }
        }

        shapes.push.apply(shapes, holeShapes);

        const lineText = new Object3D();

        for (let i = 0; i < shapes.length; i++) {
          const shape = shapes[i];

          const points = shape.getPoints();
          const geometry = new BufferGeometry().setFromPoints(points);

          geometry.translate(xMid, 0, 0);

          const lineMesh = new Line(geometry, matDark);
          lineText.add(lineMesh);
        }
        lineText.position.z = 500;
        scene.add(lineText);
      });

      var xLen = 20;
      var offset = 5;
      var geometry = new BoxGeometry(xLen, xLen, 1);
      for (let i = 0; i < 3; i++) {
        const texture = new TextureLoader().load('assets/images/thumbnails/artwork' + (i + 1) + '.png');
        const mesh = new Mesh(geometry, new MeshLambertMaterial({ map: texture }));
        mesh.userData.url = '/gallery/artwork' + (i + 1) + '/';
        mesh.userData.isSelected = false;
        mesh.position.x = (-xLen - offset) * (i - 1);
        mesh.position.z = 10;
        group.add(mesh);
      }
      scene.add(group);

      geometry = new PlaneGeometry(500, 500, 10, 10);
      let geo = new WireframeGeometry(geometry);

      matLineBasic = new LineBasicMaterial({ color: 0x9c08ff });

      wireframe = new LineSegments(geo, matLineBasic);
      wireframe.computeLineDistances();
      wireframe.visible = true;
      wireframe.rotateX(Math.PI / 2);
      wireframe.position.y -= xLen + offset;
      scene.add(wireframe);

      const renderScene = new RenderPass(scene, camera);

      const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
      bloomPass.threshold = 0.01;
      bloomPass.strength = 2.6;
      bloomPass.radius = 0.4;

      composer = new EffectComposer(renderer);
      composer.addPass(renderScene);
      composer.addPass(bloomPass);
      composer.addPass(glitchPass);

      camera.position.set(0, 50, 1300);
      camera.userData.targetZ = 1300;
      camera.lookAt(new Vector3(0, 0, 0));
    }

    init();
    animate();
  }, []);
  return (
    <>
      <div ref={inputEl}></div>
    </>
  );
}

export default Art;
