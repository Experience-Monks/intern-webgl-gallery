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
  Line,
  BufferGeometry,
  Vector3,
  WireframeGeometry,
  Box3,
  Box3Helper,
  LineBasicMaterial,
  LineSegments,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh
} from 'three/build/three.module';

import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Camera } from 'p5';

function Art() {
  const inputEl = useRef(null);

  useEffect(() => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(60, inputEl.current.offsetWidth / inputEl.current.offsetHeight, 1, 10000);
    const renderer = new WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    renderer.setPixelRatio(inputEl.current.offsetWidth / inputEl.current.offsetHeight);
    renderer.setSize(inputEl.current.offsetWidth, inputEl.current.offsetHeight);
    inputEl.current.append(renderer.domElement);

    inputEl.current.addEventListener('mousemove', onPointerMove);
    inputEl.current.addEventListener('resize', onWindowResize);
    inputEl.current.addEventListener('click', onMouseClick);

    //const controls = new OrbitControls(camera, inputEl.current);
    const pmremGenerator = new PMREMGenerator(renderer);

    const directionalLight = new DirectionalLight(0xff00ff, 0.5);

    const mouse = new Vector2();
    let v3 = [];
    let counter = 0;
    let v3Size = 0;
    const matLineBasic = new LineBasicMaterial({
      morphTargets: true,
      color: 0xffffff,
      linecap: 'round',
      linejoin: 'round'
    });
    var lineGeometry;
    var start = false;
    var line1;

    var activateLooker = false;
    function onMouseClick(event) {
      console.log(camera.position);
      //camera.lookAt(new Vector3(0, 0, 0));
      start = !start;
    }
    function onWindowResize(event) {
      camera.aspect = inputEl.current.offsetWidth / inputEl.current.offsetHeight;
      //camera.updateProjectionMatrix();

      renderer.setSize(inputEl.current.offsetWidth, inputEl.current.offsetHeight);
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
      render();
    }

    function render() {
      if (activateLooker) {
        camera.position.x -= (camera.position.x - mouse.x) * 1.8;
        camera.position.y -= (-mouse.y + camera.position.y) * 0.5;
        camera.lookAt(scene.position);
      }
      if (start && counter < v3Size) {
        lineGeometry.setDrawRange(0, counter);
        counter += 10;
        line1 = new Line(lineGeometry, matLineBasic);
        line1.visible = true;
        scene.add(line1);
        camera.position.z++;
        camera.lookAt(scene.position.x, scene.position.y ,camera.position.z);
      }
      if (counter > v3Size && start) {
        start = false;
        activateLooker = true;
        console.log('finish');
      }
      renderer.render(scene, camera);
    }

    function init() {
      //var helper = new GridHelper( 10000, 2, 0xffffff, 0xffffff );
      //scene.add( helper );
      setupRenderer();
      scene.position.set(0, 0, 0);
      scene.background = new Color(0x160026);
      scene.fog = new Fog(0x570057, 2000, 3500);
      scene.add(new AmbientLight(0xf0e9e9));
      directionalLight.position.set(0, -1, 0);
      scene.add(directionalLight);

      controls.enableZoom = true;
      //controls.enablePan = true;

      camera.position.set(scene.position.x + 500, scene.position.y, 0);
      camera.rotateY(-Math.PI );
      //camera.position.set(scene.position);

      //createPlane();
      const loader = new SVGLoader();
      loader.load('../../assets/images/svg/lines2.svg', function (svgData) {
        const subPath = svgData.paths[0].subPaths[0];
        let v2 = subPath.getPoints();
        for (let z = 0; z < v2.length; z++) {
          v3.push(new Vector3(v2[z].x, -v2[z].y, z * 0.1));
        }
        v3Size = v3.length;
        lineGeometry = new BufferGeometry().setFromPoints(v3);
        lineGeometry.computeBoundingBox();
        lineGeometry.center();
        camera.lookAt(scene.position);
      });
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
