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
  MeshBasicMaterial
} from 'three/build/three.module';

import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from '../utils/threejs/GlitchPass.js';
import disposeObjects from '../utils/dispose-objects';

function Art() {
  const inputEl = useRef(null);

  useEffect(() => {
    return () => {
      require('../utils/dispose-objects');
      disposeObjects(inputEl.renderer, inputEl);
    };
  }, []);

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
    const groupThumb = new Group();
    const groupFont = new Group();
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

    const matDark = new LineBasicMaterial({
      color: 0x006699,
      side: DoubleSide
    });

    const matLite = new MeshBasicMaterial({
      color: 0x08fbff,
      transparent: true,
      opacity: 0.4,
      side: DoubleSide
    });
    const idText = ['A Thousand\nSplendid Suns\n//amna', 'MRN\n//mariana', 'Kissing Circles\n//mia'];
    const titleText = 'WE3 \nGallery';
    const enterMessage = 'click anywhere to enter';
    var titleShapes;
    var enterShapes;
    var titleGeometry;
    var text;
    var enterGeo;
    var nameGeo = [];

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;

      renderer.setSize(window.innerWidth, window.innerHeight);

      composer.setSize(window.innerWidth, window.innerHeight);
      camera.updateProjectionMatrix();
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
        window.location.href = redirect;
        cancelAnimationFrame(this);
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
        const intersects = raycaster.intersectObjects(groupThumb.children);

        //console.log(groupThumb.children);
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
          if (text !== undefined) {
            groupFont.remove(text);
            text.geometry.dispose();
          }
          text = new Mesh(titleGeometry, matLite);
          text.position.z = -800;
          text.position.y = 300;
          groupFont.add(text);
        }
      }
      if (INTERSECTED) {
        if (text !== undefined) {
          groupFont.remove(text);
          text.geometry.dispose();
        }
        text = new Mesh(nameGeo[INTERSECTED.userData.id], matLite);
        text.position.z = -800;
        text.position.y = 300;
        groupFont.add(text);
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
        titleShapes = font.generateShapes(titleText, 100);
        enterShapes = font.generateShapes(enterMessage, 10);
        titleGeometry = new ShapeGeometry(titleShapes);
        enterGeo = new ShapeGeometry(enterShapes);
        titleGeometry.computeBoundingBox();
        enterGeo.computeBoundingBox();

        const xMid = -0.5 * (titleGeometry.boundingBox.max.x - titleGeometry.boundingBox.min.x);

        titleGeometry.translate(xMid, 0, 0);

        for (let i = 0; i < idText.length; i++) {
          nameGeo.push(new ShapeGeometry(font.generateShapes(idText[i], 85)));
          nameGeo[i].computeBoundingBox();
          nameGeo[i].translate(
            -0.5 * nameGeo[i].boundingBox.max.x - nameGeo[i].boundingBox.min.x,
            0.3 * (nameGeo[i].boundingBox.max.y - nameGeo[i].boundingBox.min.y),
            0
          );
        }

        text = new Mesh(geometry, matLite);
        text.position.z = -800;
        text.position.y = 300;
        groupFont.add(text);

        const enterText = new Mesh(enterGeo, matLite);
        enterText.position.z = inputEl.current.offsetWidth / 2;
        enterText.position.y = -300;
        groupFont.add(enterText);

        const holeShapes = [];

        for (let i = 0; i < titleShapes.length; i++) {
          const shape = titleShapes[i];

          if (shape.holes && shape.holes.length > 0) {
            for (let j = 0; j < shape.holes.length; j++) {
              const hole = shape.holes[j];
              holeShapes.push(hole);
            }
          }
        }

        titleShapes.push.apply(titleShapes, holeShapes);

        const lineText = new Object3D();

        for (let i = 0; i < titleShapes.length; i++) {
          const shape = titleShapes[i];

          const points = shape.getPoints();
          const lineGeo = new BufferGeometry().setFromPoints(points);

          lineGeo.translate(xMid, 0, 0);

          const lineMesh = new Line(lineGeo, matDark);
          lineText.add(lineMesh);
        }
        lineText.position.z = 500;
        groupFont.add(lineText);
      });
      scene.add(groupFont);
      var xLen = 20;
      var offset = 5;
      var geometry = new BoxGeometry(xLen, xLen, 1);
      for (let i = 0; i < 3; i++) {
        const texture = new TextureLoader().load('assets/images/thumbnails/artwork' + (i + 1) + '.png');
        const mesh = new Mesh(geometry, new MeshLambertMaterial({ map: texture }));
        mesh.userData.url = '/gallery/artwork' + (i + 1) + '/';
        mesh.userData.isSelected = false;
        mesh.userData.id = i;
        mesh.position.x = (-xLen - offset) * (i - 1);
        mesh.position.z = 10;
        groupThumb.add(mesh);
      }
      scene.add(groupThumb);

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

      const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 2.6, 0.4, 0.01);

      composer = new EffectComposer(renderer);
      composer.addPass(renderScene);
      composer.addPass(bloomPass);
      composer.addPass(glitchPass);

      camera.position.set(0, 75, 1300);
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
