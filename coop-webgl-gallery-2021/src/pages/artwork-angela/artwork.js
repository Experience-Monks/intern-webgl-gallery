import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import disposeObjects from '../../utils/dispose-objects';
import { baseUrl } from '../../data/settings';

export default function Artwork() {
  const inputEl = useRef(null);

  useEffect(() => {
    return () => {
      disposeObjects(inputEl.renderer, inputEl);
    };
  }, []);

  useEffect(() => {
    const path_start = `${baseUrl}/assets/angela-assets`;
    // SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('rgb(0,0,0)'); // sky

    const radius = 100000;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      90, // fov
      window.innerWidth / window.innerHeight, // aspect ratio
      1, // near
      radius * 2 // far
    );

    // MUSIC
    // create an AudioListener and add it to the camera
    const listener = new THREE.AudioListener();
    camera.add(listener);
    // create a global audio source
    const sound = new THREE.Audio(listener);
    sound.autoplay = true;
    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.autoplay = true;
    audioLoader.load(`${path_start}/others/beach_vibe.mp3`, function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.15);
      sound.play();
    });
    console.log('IS PLAYING:', sound.isPlaying);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    // ORBIT
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 1500, -300); // centre on x,y
    controls.maxDistance = 15000;
    controls.maxPolarAngle = Math.PI / 2;
    controls.update();

    // AMBIENT LIGHT
    scene.add(new THREE.AmbientLight(0xffffffff, 0.5));
    // DIRECTIONAL LIGHT
    const dirLight = new THREE.DirectionalLight(0xffffffff, 1.0);
    //0, 300, -3800
    dirLight.position.x += 0;
    dirLight.position.y += 100;
    dirLight.position.z -= -3800;
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = radius;
    dirLight.shadow.mapSize.height = radius;
    const d = 500;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.position.z = -33;

    let target = new THREE.Object3D();
    target.position.z = -20;
    dirLight.target = target;
    dirLight.target.updateMatrixWorld();

    dirLight.shadow.camera.lookAt(0, 0, -30);
    scene.add(dirLight);
    // scene.add(new THREE.CameraHelper(dirLight.shadow.camera));

    // TEXTURES WATER
    const textureLoader = new THREE.TextureLoader();
    const waterBaseColor = textureLoader.load(`${path_start}/water/Water_002_COLOR.jpg`);
    const waterNormalMap = textureLoader.load(`${path_start}/water/Water_002_NORM.jpg`);
    const waterHeightMap = textureLoader.load(`${path_start}/water/Water_002_DISP.jpg`);
    const waterRoughness = textureLoader.load(`${path_start}/water/Water_002_ROUGH.jpg`);
    const waterAmbientOcclusion = textureLoader.load(`${path_start}/water/Water_002_OCC.jpg`);

    // FOG;
    const fogColour = new THREE.Color('rgb(195, 218, 235)');
    scene.fog = new THREE.Fog(fogColour, 400, radius + 500);

    // SKY
    const skyTexture = textureLoader.load(`${path_start}/others/cur.jpg`);
    const mySky = new THREE.SphereGeometry(radius, 32, 16);
    const material = new THREE.MeshBasicMaterial({ map: skyTexture, fog: false });
    material.side = THREE.BackSide; // put mech on inside
    const sphere = new THREE.Mesh(mySky, material);
    sphere.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2.45);
    scene.add(sphere);

    const geometry = new THREE.CircleBufferGeometry(radius, 200);

    const waterMesh = new THREE.MeshStandardMaterial({
      map: waterBaseColor,
      normalMap: waterNormalMap,
      displacementMap: waterHeightMap,
      displacementScale: 1,
      roughnessMap: waterRoughness,
      roughness: 0,
      aoMap: waterAmbientOcclusion
    });
    const plane = new THREE.Mesh(geometry, waterMesh);
    plane.receiveShadow = true;
    plane.castShadow = true;
    plane.rotation.x = -Math.PI / 2;

    // TRANSPARENCY
    plane.material.transparent = true;
    plane.material.opacity = 0.5;
    scene.add(plane);

    const count = geometry.attributes.position.count;
    const damping = 2.5; // controls waviness
    // ANIMATE
    function animate() {
      // SINE WAVE
      const now_slow = Date.now() / 300; // controls speed
      for (let i = 0; i < count; i++) {
        const x = geometry.attributes.position.getX(i);
        const y = geometry.attributes.position.getY(i);
        const xangle = x + now_slow;
        const xsin = Math.sin(xangle) * damping;
        const yangle = y + now_slow;
        const ycos = Math.cos(yangle) * damping;
        geometry.attributes.position.setZ(i, xsin + ycos);
      }
      geometry.computeVertexNormals();
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    // document.body.appendChild(renderer.domElement);
    inputEl.current.append(renderer.domElement);
    animate();

    // RESIZE HANDLER
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);
  }, []);

  return <div ref={inputEl}></div>;
}
