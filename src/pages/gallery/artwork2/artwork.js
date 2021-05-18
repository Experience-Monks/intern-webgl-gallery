import React, { useRef, useEffect } from 'react';

import {
  AmbientLight,
  Scene,
  Color,
  Vector2,
  PerspectiveCamera,
  BoxGeometry,
  Mesh,
  WebGLRenderer,
  PMREMGenerator,
  HemisphereLight,
  DirectionalLight,
  MeshLambertMaterial,
  DefaultLoadingManager,
  sRGBEncoding,
  ACESFilmicToneMapping,
  Fog,
  Raycaster,
  Vector3
} from 'three/build/three.module';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//add more imports here, such as the controllers and loaders etc

function Art() {
  const inputEl = useRef(null);

  useEffect(() => {
    const scene = new Scene();
    //currently set to window size but if we are making square it will need to be changed to sceneRef.clientWidth and sceneRef.clientHeight
    const camera = new PerspectiveCamera(75, inputEl.current.offsetWidth / inputEl.current.offsetHeight, 0.1, 1000);
    const renderer = new WebGLRenderer();
    renderer.setPixelRatio(inputEl.current.offsetWidth / inputEl.current.offsetHeight);
    renderer.setSize(inputEl.current.offsetWidth, inputEl.current.offsetHeight);
    inputEl.current.append(renderer.domElement);

    inputEl.current.addEventListener('mousemove', onPointerMove);
    inputEl.current.addEventListener('resize', onWindowResize);

    const controls = new OrbitControls(camera, inputEl.current);
    const raycaster = new Raycaster();
    const pmremGenerator = new PMREMGenerator(renderer);

    const directionalLight = new DirectionalLight(0xff00ff, 0.5);
    //const particleLight = new Mesh(new SphereGeometry(4, 8, 8), new MeshBasicMaterial({ color: 0xffffff }));

    const mouse = new Vector2();
    let INTERSECTED;

    function onWindowResize() {
      camera.aspect = inputEl.current.offsetWidth / inputEl.current.offsetHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(inputEl.current.offsetWidth, inputEl.current.offsetHeight);
    }

    function onPointerMove(event) {
      mouse.x = (event.clientX / inputEl.current.offsetWidth) * 2 - 1;
      mouse.y = -(event.clientY / inputEl.current.offsetHeight) * 2 + 1;
    }

    function animate() {
      requestAnimationFrame(animate);
      render();
    }

    function render() {
      renderer.render(scene, camera);
    }

    function init() {
      //var helper = new GridHelper( 10000, 2, 0xffffff, 0xffffff );
      //scene.add( helper );

      DefaultLoadingManager.onLoad = function () {
        pmremGenerator.dispose();
      };

      scene.background = new Color(0x000000);
      scene.fog = new Fog(0x050505, 2000, 3500);
      scene.add(new AmbientLight(0x444444));
      directionalLight.position.set(0, -1, 0);
      scene.add(directionalLight);

      pmremGenerator.compileEquirectangularShader();
      renderer.outputEncoding = sRGBEncoding;
      renderer.toneMapping = ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;

      controls.enableZoom = true;
      controls.enablePan = false;

      camera.position.set(0, 0, 100);
      camera.lookAt(new Vector3(0, 0, 0));

      var geometry = new BoxGeometry(10, 10, 1);
  
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          const object = new Mesh(geometry, new MeshLambertMaterial({ color: Math.random() * 0xffffff }));

          object.position.x = i * 10 - 40;
          object.position.y = j * 10 + 40;
          object.position.z = Math.random() * 10 - 5;

          //object.rotation.x = Math.random() * 2 * Math.PI;
          object.rotation.y = Math.random() * Math.PI;
          object.rotation.z = Math.random() * Math.PI;

          scene.add(object);
        }
      }
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
