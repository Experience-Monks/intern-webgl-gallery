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
import { withRedux } from '../../../redux/withRedux';
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

    const effectController = {
      turbidity: 3.7,
      rayleigh: 0.5,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.134,
      elevation: 3.7,
      azimuth: 5,
      exposure: renderer.toneMappingExposure,
      distortionScale: 3.7,
      size: 2.4,
      roughness: 0.0,
      metalness: 1.0
    };

    const mesh = addCube();
    //const torusMesh;
    const planeMesh = addPlane();
    var exrCubeRenderTarget;
    var exrBackground;
    const hemLight = new HemisphereLight(0xffffbb, 0xf700ff, 1);
    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    const particleLight = new Mesh(new SphereGeometry(4, 8, 8), new MeshBasicMaterial({ color: 0xffffff }));

    function animate() {
      requestAnimationFrame(animate);
      render();
    }

    function render() {
      const time = performance.now() * 0.001;
      mesh.material.roughness = effectController.roughness;
      mesh.material.metalness = effectController.metalness;

      let newEnvMap = mesh.material.envMap;
      let background = scene.background;

      newEnvMap = exrCubeRenderTarget ? exrCubeRenderTarget.texture : null;
      background = exrBackground;

      if (newEnvMap !== mesh.material.envMap) {
        mesh.material.envMap = newEnvMap;
        mesh.material.needsUpdate = true;

        planeMesh.material.map = newEnvMap;
        planeMesh.material.needsUpdate = true;
      }

      mesh.position.y = Math.sin(time) * 10 + 50;
      //mesh.rotation.x = time * 0.1;
      //mesh.rotation.z = time * 0.51;

      particleLight.position.x = Math.sin(time * 0.7) * 130;
      particleLight.position.y = Math.cos(time * 0.5) * 10 + 20;
      particleLight.position.z = Math.cos(time * 0.3) * 130;

      //mesh.rotation.y += 0.005;
      planeMesh.visible = effectController.debug;

      scene.background = background;
      renderer.toneMappingExposure = effectController.exposure;

      renderer.render(scene, camera);
    }

    function addCube() {
      /*
    var geometry = new THREE.BoxGeometry(50, 50, 50);
    var material = new THREE.MeshPhongMaterial( { color: 0xf700ff } );
    var cube = new THREE.Mesh( geometry, material );
    
    return cube;*/
      let geometry = new TorusKnotGeometry(10, 15, 20, 35);
      //let geometry = new DodecahedronGeometry(10, 1);
      let material = new MeshStandardMaterial({
        metalness: effectController.roughness,
        roughness: effectController.metalness,
        envMapIntensity: 1.0
      });

      return new Mesh(geometry, material);
    }

    function addPlane() {
      let geometry = new PlaneGeometry(200, 200);
      let material = new MeshBasicMaterial();

      let pMesh = new Mesh(geometry, material);
      pMesh.position.y = -50;
      pMesh.rotation.x = -Math.PI * 0.5;

      return pMesh;
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

      controls.enableZoom = true;
      controls.enablePan = false;

      controls.maxPolarAngle = Math.PI * 0.495;
      controls.target.set(0, 10, 0);
      controls.minDistance = 40.0;
      controls.maxDistance = 200.0;
      controls.update();

      camera.position.set(50, 50, 250);

      //loadObjects();

      //camera.lookAt(new Vector3(0,0,0));
      //light.position.set(10, 50, 100);
      directionalLight.position.set(-10, -50, -10);
      directionalLight.target = mesh;
      //scene.add(light);
      scene.add(hemLight);
      scene.add(directionalLight);
      scene.add(directionalLight.target);
      //scene.add(particleLight);
      //particleLight.add( pointLight );
      //mesh.add(pointLight);
      scene.add(mesh);
      scene.add(planeMesh);
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
