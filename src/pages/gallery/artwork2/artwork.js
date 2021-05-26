import React, { useRef, useEffect } from 'react';

import {
  AmbientLight,
  Scene,
  Color,
  Vector2,
  PerspectiveCamera,
  PlaneGeometry,
  WebGLRenderer,
  PMREMGenerator,
  DirectionalLight,
  DefaultLoadingManager,
  sRGBEncoding,
  EquirectangularReflectionMapping,
  ACESFilmicToneMapping,
  Fog,
  CatmullRomCurve3,
  Vector3,
  WireframeGeometry,
  LineBasicMaterial,
  LineSegments,
  TubeGeometry,
  Mesh,
  MeshLambertMaterial,
  MeshPhongMaterial,
  TextureLoader
} from 'three/build/three.module';

import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';

function Art() {
  const inputEl = useRef(null);

  useEffect(() => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(100, inputEl.current.offsetWidth / inputEl.current.offsetHeight, 0.1, 2000);
    const renderer = new WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);

    renderer.setPixelRatio(inputEl.current.offsetWidth / inputEl.current.offsetHeight);
    renderer.setSize(inputEl.current.offsetWidth, inputEl.current.offsetHeight);
    inputEl.current.append(renderer.domElement);

    inputEl.current.addEventListener('mousemove', onPointerMove);
    inputEl.current.addEventListener('resize', onWindowResize);
    inputEl.current.addEventListener('click', onMouseClick);

    const pmremGenerator = new PMREMGenerator(renderer);

    const directionalLight = new DirectionalLight(0xff00ff, 0.5);

    const mouse = new Vector2();
    let v3 = [];
    let counter = 0;
    let v3Size = 0;
    var tubeGeo;
    var start = false;
    var curve;
    const material = new MeshPhongMaterial({ color: 0xcf70c9, wireframe: false });
    material.emissive.setHex(0xcfffc9);
    material.emissiveIntensity = 0.5;
    var mesh;
    var bloomPass;
    var filmPass;
    var renderScene;
    var composer;
    var finished = false;
    var envTexture;

    function onMouseClick(event) {
      console.log(camera.position);
      if (!finished) start = !start;
      if (finished) finished = false;
    }
    function onWindowResize(event) {
      camera.aspect = inputEl.current.offsetWidth / inputEl.current.offsetHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(inputEl.current.offsetWidth, inputEl.current.offsetHeight);
      composer.setSize(inputEl.current.offsetWidth, inputEl.current.offsetHeight);
    }

    function onPointerMove(event) {
      mouse.x = (event.clientX / inputEl.current.offsetWidth) * 2.5 - 1;
      mouse.y = -(event.clientY / inputEl.current.offsetHeight) * 2.5 + 1;
    }

    function setupRenderer() {
      DefaultLoadingManager.onLoad = function () {
        pmremGenerator.dispose();
      };
      pmremGenerator.compileEquirectangularShader();
      renderer.outputEncoding = sRGBEncoding;
      renderer.toneMapping = ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
    }

    function createPlane() {
      let geometry = new PlaneGeometry(1000, 1000, 10, 10);
      let geo = new WireframeGeometry(geometry);
      let material = new LineBasicMaterial({ color: 0x9c08ff });
      let wireframe = new LineSegments(geo, material);

      wireframe.computeLineDistances();
      wireframe.visible = true;
      wireframe.rotateX(Math.PI / 2);
      wireframe.position.y -= 100;
      scene.add(wireframe);
    }

    function setupCamera() {
      controls.autoRotate = true;
      camera.position.x = 50;
      camera.position.y = 25;
      camera.position.z = -50;
      camera.updateProjectionMatrix();
      controls.update();
    }

    function loadImage(url) {
      const loader = new SVGLoader();
      loader.load(url, function (svgData) {
        const subPath = svgData.paths[0].subPaths[0];
        let v2 = subPath.getPoints();
        for (let z = 0; z < v2.length; z++) {
          v3.push(new Vector3(v2[z].x, -v2[z].y, z * 0.03));
        }
        curve = new CatmullRomCurve3(v3);
        tubeGeo = new TubeGeometry(curve, v3.length, 0.5, 8, false);
        v3Size = v3.length * (curve.arcLengthDivisions / 4);
        tubeGeo.computeBoundingBox();
        tubeGeo.center();
      });
    }

    function setupScene() {
      const loadEnv = new TextureLoader();
      envTexture = loadEnv.load('../../assets/images/textures/eso0932a.jpeg');
      envTexture.mapping = EquirectangularReflectionMapping;
      envTexture.encoding = sRGBEncoding;
      scene.background = envTexture;
      scene.fog = new Fog(0x570057, 100, 350);
      scene.add(new AmbientLight(0xf0e9e9));
      directionalLight.position.set(0, -1, 0);
      scene.add(directionalLight);
    }

    function setupPostProcessingEffects() {
      renderScene = new RenderPass(scene, camera);

      bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.1, 0.8);
      filmPass = new FilmPass(0.3, 0.5, 600, false);

      composer = new EffectComposer(renderer);
      composer.addPass(renderScene);
      composer.addPass(bloomPass);
      composer.addPass(filmPass);
    }

    function animate() {
      requestAnimationFrame(animate);
      render();
      controls.update();
      composer.render();
    }

    function render() {
      if (start) {
        counter += 50;
        tubeGeo.setDrawRange(0, counter);
        if (mesh !== undefined) {
          scene.remove(mesh);
          mesh.geometry.dispose();
        }
        mesh = new Mesh(tubeGeo, material);
        scene.add(mesh);
        camera.lookAt(mesh.position);

        if (counter >= v3Size) {
          start = false;
          counter = 0;
          console.log('finish');
          finished = true;
          controls.autoRotateSpeed = 0.8;
        }
      }

      if (finished) {
        if (camera.position.z < 250) {
          camera.position.z += 0.4;
        }

        if (controls.object.position.x < 0.4 && controls.object.position.x > 0.1 && controls.object.position.z > 0) {
          controls.autoRotate = false;
        }

        camera.position.x += (mouse.x - camera.position.x) * 1.5;
        //camera.position.y += (-mouse.y - camera.position.y) * 1.5;
      }
      renderer.render(scene, camera);
    }

    function init() {
      setupRenderer();
      setupCamera();
      setupScene();
      createPlane();
      loadImage('../../assets/images/svg/lines2.svg');
      setupPostProcessingEffects();
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
