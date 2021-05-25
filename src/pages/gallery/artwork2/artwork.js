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
  ACESFilmicToneMapping,
  Fog,
  CatmullRomCurve3,
  Clock,
  Line,
  BufferGeometry,
  Vector3,
  WireframeGeometry,
  Box3,
  Box3Helper,
  MeshPhongMaterial,
  LineBasicMaterial,
  LineSegments,
  TubeGeometry,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  MeshLambertMaterial,
  MathUtils
} from 'three/build/three.module';

import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

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
    const clock = new Clock();

    const mouse = new Vector2();
    let v3 = [];
    let counter = 0;
    let v3Size = 0;
    var tubeGeo;
    const matLineBasic = new LineBasicMaterial({
      morphTargets: true,
      color: 0xffffff,
      linecap: 'round',
      linejoin: 'round'
    });
    var lineGeometry;
    var start = false;
    var line1;
    var curve;
    const material = new MeshLambertMaterial({ color: 0xcf70c9, wireframe: false });
    material.emissive.setHex(0xffffff);
    material.emissiveIntensity = 0.05;
    var mesh;
    var activateLooker = false;
    const cameraTargetPos = new Vector3(0, 0, 0);
    let newCameraPos = new Vector3(0, 0, 0);
    var moveCam = false;
    var bloomPass;
    var renderScene;
    var composer;

    function onMouseClick(event) {
      console.log(camera.zoom);
      moveCam = !moveCam;
      start = !start;
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

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      render();
      composer.render();
    }

    function render() {
      //camera.position.x += (mouse.x - camera.position.x) * 1.5;
      //camera.position.y += (-mouse.y - camera.position.y) * 1.5;
      // if(camera)
      //   camera.rotateY(Math.PI * clock.getDelta());
      /*if (moveCam) {
        if (camera.position.z <= 450) camera.position.z += 20 * clock.getDelta();
        if (camera.position.x !== scene.position.x) camera.position.x += 20 * clock.getDelta();
        if (camera.position.y !== scene.position.y) camera.position.y += 20 * clock.getDelta();
        if (mesh !== undefined) camera.lookAt(mesh.position);
      }*/
      if (start) {
        if(camera.zoom > 1){
          camera.zoom -= 0.01 * clock.getDelta();
          camera.updateProjectionMatrix();
        }
        if(camera.position.z < 550){
          camera.position.z += 5 * clock.getDelta();
        }
        counter += 65;
        tubeGeo.setDrawRange(0, counter);
        if (mesh !== undefined) {
          scene.remove(mesh);
          mesh.geometry.dispose();
        }
        mesh = new Mesh(tubeGeo, material);
        scene.add(mesh);
        camera.lookAt(mesh.position);
      }
      
      //controls.dollyOut(10);
      if (counter >= v3Size && start) {
        start = false;
        counter = 0;
        console.log('finish');
        controls.autoRotateSpeed = -0.5;
        //controls.autoRotate = false;
      }
      if (!start && Math.abs(controls.object.position.x - scene.position.x) < 0.5) {
        controls.autoRotate = false;
      }
      /*if(camera.position.z >= 450 && camera.position.y === scene.position.y && camera.position.x === 0){
        moveCam = false;
      }*/
      renderer.render(scene, camera);
    }

    function init() {
      //var helper = new GridHelper( 10000, 2, 0xffffff, 0xffffff );
      //scene.add( helper );
      controls.autoRotate = true;
      controls.autoRotateSpeed = -0.4;
      setupRenderer();
      //camera.userData.targetPosition = new Vector3(scene.position.x, scene.position.y, 0);
      camera.position.x = 150;
      camera.position.z = -25;
      camera.zoom = 2;
      camera.updateProjectionMatrix();
      controls.update();
      //scene.position.set(0, 0, 0);
      // camera.lookAt(scene.position);
      scene.background = new Color(0x000000);
      scene.fog = new Fog(0x570057, 2000, 3500);
      scene.add(new AmbientLight(0xf0e9e9));
      directionalLight.position.set(0, -1, 0);
      scene.add(directionalLight);

      createPlane();
      const loader = new SVGLoader();
      loader.load('../../assets/images/svg/lines2.svg', function (svgData) {
        const subPath = svgData.paths[0].subPaths[0];
        let v2 = subPath.getPoints();
        for (let z = 0; z < v2.length; z++) {
          v3.push(new Vector3(v2[z].x, -v2[z].y, z * 0.03));
        }
        curve = new CatmullRomCurve3(v3);
        tubeGeo = new TubeGeometry(curve, v3.length, 1, 8, false);
        v3Size = v3.length * (curve.arcLengthDivisions / 4);
        tubeGeo.computeBoundingBox();
        tubeGeo.center();
        //camera.lookAt(tubeGeo.boundingBox.getCenter());
      });
      renderScene = new RenderPass(scene, camera);

      bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0);

      composer = new EffectComposer(renderer);
      composer.addPass(renderScene);
      composer.addPass(bloomPass);
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
