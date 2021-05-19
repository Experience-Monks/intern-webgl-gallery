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
  FontLoader
} from 'three/build/three.module';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from '../utils/threejs/GlitchPass.js';

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

    const controls = new OrbitControls(camera, inputEl.current);
    const raycaster = new Raycaster();
    const directionalLight = new DirectionalLight(0xff00ff, 0.5);
    const group = new Group();
    const mouse = new Vector2();
    let INTERSECTED;
    let wireframe;
    let matLineBasic;
    let composer;
    let redirect;
    const clock = new Clock();
    const params = {
      exposure: 1,
      bloomStrength: 1.5,
      bloomThreshold: 0,
      bloomRadius: 0
    };
    const glitchPass = new GlitchPass();
    function onWindowResize() {
      camera.aspect = inputEl.current.offsetWidth / inputEl.current.offsetHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(inputEl.current.offsetWidth, inputEl.current.offsetHeight);

      composer.setSize(inputEl.current.offsetWidth, inputEl.current.offsetHeight);
    }

    function onMouseClick(event) {
      console.log('mouse click');
      glitchPass.activate();
      if (INTERSECTED) {
        redirect = INTERSECTED.userData.url;
      }
    }

    function onPointerMove(event) {
      mouse.x = (event.clientX / inputEl.current.offsetWidth) * 2 - 1;
      mouse.y = -(event.clientY / inputEl.current.offsetHeight) * 2 + 1;
    }

    function animate() {
      requestAnimationFrame(animate);
      render();

      composer.render();
    }

    function render() {
      //     camera.lookAt(scene.position);

      camera.position.x += (mouse.x - camera.position.x) * 0.5;
      camera.position.y += (-mouse.y - camera.position.y) * 1.5;
      camera.lookAt(scene.position);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(group.children);

      if (intersects.length > 0) {
        if (INTERSECTED !== intersects[0].object) {
          if (INTERSECTED) {
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
          }

          INTERSECTED = intersects[0].object;
          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
          INTERSECTED.material.emissive.setHex(0x08fbff);
        }
      } else {
        if (INTERSECTED) {
          INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        }
        INTERSECTED = null;
      }
      if (glitchPass.isOver && redirect) {
        window.location = redirect;
      }
      renderer.render(scene, camera);
    }

    function init() {
      scene.background = new Color(0x000000);
      scene.fog = new Fog(0x050505, 2000, 3500);
      scene.add(new AmbientLight(0x444444));
      directionalLight.position.set(0, -1, 0);
      scene.add(directionalLight);

      controls.enableZoom = true;
      controls.enablePan = false;
      controls.enableRotate = true;
      const loader = new FontLoader();

      var xLen = 20;
      var offset = 5;
      const texture = new TextureLoader().load('assets/images/thumbnails/placeholder.jpeg');
      var geometry = new BoxGeometry(xLen, xLen, 1);
      for (let i = 0; i < 3; i++) {
        const mesh = new Mesh(geometry, new MeshLambertMaterial({ map: texture }));
        mesh.userData.url = '/gallery/artwork' + (i + 1) + '/';
        mesh.userData.isSelected = false;
        mesh.position.x = (-xLen - offset) * (i - 1);
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
      bloomPass.threshold = params.bloomThreshold;
      bloomPass.strength = params.bloomStrength;
      bloomPass.radius = params.bloomRadius;

      composer = new EffectComposer(renderer);
      composer.addPass(renderScene);
      composer.addPass(bloomPass);
      composer.addPass(glitchPass);

      camera.position.set(0, 0, 50);
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
