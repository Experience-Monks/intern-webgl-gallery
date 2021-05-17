import { getUnit } from 'gsap/gsap-core';
import React, { useRef, useCallback, useEffect } from 'react';

import {
  LinearFilter,
  LoadingManager,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  TextureLoader,
  Vector2,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  WebGLRenderer,
  PMREMGenerator,
  HemisphereLight,
  DirectionalLight,
  SphereGeometry,
  TorusKnotGeometry,
  MeshStandardMaterial,
  DefaultLoadingManager,
  sRGBEncoding,
  ACESFilmicToneMapping
} from 'three/build/three.module';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//add more imports here, such as the controllers and loaders etc

function Art() {
  const inputEl = useRef(null);

  useEffect(() => {
    const scene = new Scene();
    //currently set to window size but if we are making square it will need to be changed to sceneRef.clientWidth and sceneRef.clientHeight
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    inputEl.current.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, inputEl.current);

    const pmremGenerator = new PMREMGenerator(renderer);

    //declare all your variables here!

    function animate() {
      requestAnimationFrame(animate);
      render();
    }

    function render() {
      //add whatever you want here
      renderer.render(scene, camera);
    }

    function init() {
      //var helper = new GridHelper( 10000, 2, 0xffffff, 0xffffff );
      //scene.add( helper );

      DefaultLoadingManager.onLoad = function () {
        pmremGenerator.dispose();
      };

      pmremGenerator.compileEquirectangularShader();
      renderer.outputEncoding = sRGBEncoding;
      renderer.toneMapping = ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;

      controls.addEventListener('change', render);
      //add stuff here like controls components and mesh components to your scene
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
