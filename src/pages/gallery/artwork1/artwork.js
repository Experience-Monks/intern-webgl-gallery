import React, { useRef, useEffect } from 'react';

import {
  Scene,
  TextureLoader,
  Vector2,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
  AmbientLight,
  BufferGeometry,
  BufferAttribute,
  Object3D,
  Float32BufferAttribute,
  PointsMaterial,
  AdditiveBlending,
  Color,
  Points,
  PointLight,
  Vector3,
  AnimationClip,
  AnimationMixer,
  MeshBasicMaterial,
  SphereGeometry,
  Mesh
} from 'three/build/three.module';

//add more imports here, such as the controllers and loaders etc
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { gsap } from 'gsap';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';

function Art() {
  const inputEl = useRef(null);

  useEffect(() => {
    const quote = [
      '"Of all the hardships a person had to face,\nNone was more punishing than the simple act of waiting."',
      '"One could not count the moons that shimmer on her roofs,\nOr the thousand splendid suns that hide behind her walls."',
      '"Marriage can wait,\nEducation cannot."',
      '"Behind every trial and sorrow that He makes us shoulder,\nGod has a reason."',
      '"Like a compass facing north, a man’s accusing finger always finds a woman."',
      '"You see, some things I can teach you. Some you learn from books. But there are things that, well, you have to see and feel."',
      '"I only have eyes for you."',
      '"And the past held only this wisdom: that love was a damaging mistake, and its accomplice, hope, a treacherous illusion."',
      '"yet love can move people to act in unexpected ways and move them to overcome the most daunting obstacles with startling heroism"',
      '"she was leaving the world as a woman who had love and been loved back"',
      '"But we are like those walls up there. Battered, and nothing pretty to look at, but still standing."',
      '"Each snowflake was a sigh heard by an aggrieved woman somewhere in the world."',
      '"Tell your secret to the wind, but don’t blame it for telling the trees."',
      '"People… should not be allowed to have new children if they had already given away all their love to their old ones."',
      '"You are not going to cry, are you?\n- I am not going to cry! Not over you. Not in a thousand years."'
    ];

    const camera = new PerspectiveCamera(100, inputEl.current.offsetWidth / inputEl.current.offsetHeight, 0.1, 1000);

    const renderer = new WebGLRenderer();
    renderer.setSize(inputEl.current.offsetWidth, inputEl.current.offsetHeight);
    document.getElementById('canvasclass').append(renderer.domElement);
    const scene = new Scene();
    camera.position.z = 3;

    var quote_index = 0;

    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(
      new Vector2(inputEl.current.offsetWidth, inputEl.current.offsetHeight),
      1.5,
      0.4,
      0.85
    );

    var bloomStrength = 3;
    var bloomRadius = 1;
    var bloomThreshold = 0.1;

    bloomPass.threshold = bloomThreshold;
    bloomPass.strength = bloomStrength;
    bloomPass.radius = bloomRadius;
    bloomPass.renderToScreen = true;

    const filmPass = new FilmPass(
      0.35, // noise intensity
      0.025, // scanline intensity
      648, // scanline count
      false // grayscale
    );
    filmPass.renderToScreen = true;

    let composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composer.addPass(filmPass);

    var titleWrapper = document.getElementById('author');
    var textWrapper = document.getElementById('quote');

    //quote text`
    function text() {
      var tl = gsap.timeline();
      textWrapper.innerHTML = quote[quote_index];
      tl.to(textWrapper, { opacity: 1, ease: 'sine', duration: 2, scale: 0.9 });
      tl.to(textWrapper, { opacity: 0, ease: 'linear.out', duration: 2, scale: 1.1, delay: 4, onComplete: updateTXT });
    }

    function updateTXT() {
      quote_index++;
      if (quote_index >= quote.length) {
        quote_index = 0;
      }
      text();
    }

    function main() {
      {
        const geometry = new SphereGeometry(500, 60, 40);
        // invert the geometry on the x-axis so that all of the faces point inward
        geometry.scale(-1, 1, 1);

        const texture = new TextureLoader().load('../../assets/models/sky2.jpeg');
        const material = new MeshBasicMaterial({ map: texture });

        const mesh = new Mesh(geometry, material);

        scene.add(mesh);
      }

      // terrain
      let loader_terrain = new FBXLoader();
      loader_terrain.load('../../assets/models/desert/desert_Pillar_terrain.fbx', function (obj) {
        obj.position.set(-10, -4, -25);
        obj.scale.set(0.05, 0.05, 0.05);
        obj.rotation.set(0, 90, 0);
        scene.add(obj);
      });

      //trees

      let mixer;
      let loader_trees = new GLTFLoader();
      loader_trees.load('../../assets/models/pinktree/source/pinktree.glb', function (obj) {
        const clips = obj.animations;
        mixer = new AnimationMixer(obj.scene);
        const clip = AnimationClip.findByName(clips, 'windAction.001');
        const action = mixer.clipAction(clip);
        action.play();

        obj.scene.position.set(2, -4, -30);
        scene.add(obj.scene);
      });

      //birds
      let mixer_birds;
      var birds = new Object3D();
      let loader_birds = new GLTFLoader();
      loader_birds.load('../../assets/models/birds/scene.gltf', function (gltf) {
        gltf.scene.position.set(-120, 50, 10);
        gltf.scene.scale.set(2, 2, 2);
        gltf.scene.rotation.set(0, 1.57079633, -3.141592);
        const clips = gltf.animations;
        mixer_birds = new AnimationMixer(gltf.scene);
        const clip = AnimationClip.findByName(clips, 'Scene');
        const action = mixer_birds.clipAction(clip);
        action.play();
        gsap.to(birds.position, { duration: 25, x: -birds.position.x, ease: 'sine', onComplete: invertBirds });
        scene.add(gltf.scene);
        birds = gltf.scene;
      });

      var orignalpos_birds = birds.position.z;
      var rot_bird = true;
      function invertBirds() {
        if (rot_bird) {
          birds.rotation.z = 0;
          rot_bird = false;
        } else {
          birds.rotation.z = -3.141592;
          rot_bird = true;
        }

        orignalpos_birds = -1 * birds.position.x;
        gsap.to(birds.position, { duration: 25, x: orignalpos_birds, ease: 'sine', onComplete: invertBirds });
      }

      // adding particles
      const cross = new TextureLoader().load('../../assets/models/glow2.png');

      const particleGeometry = new BufferGeometry();
      const particlesCnt = 200;
      const posArray = new Float32Array(particlesCnt * 3);

      for (let i = 0; i < particlesCnt * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 2;
      }
      particleGeometry.setAttribute('position', new BufferAttribute(posArray, 3));
      const particlematerial = new PointsMaterial({
        size: 0.085,
        map: cross,
        transparent: true,
        blending: AdditiveBlending
      });
      const particleMesh = new Points(particleGeometry, particlematerial);
      particleMesh.scale.set(18, 18, 18);
      particleMesh.position.set(0, 0, -25);
      scene.add(particleMesh);

      // adding sun

      const v = new Vector3();

      function randomPointInSphere(radius) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        const z = Math.random() * 2 - 1;
        const normalizationFactor = 1 / Math.sqrt(x * x + y * y + z * z);

        v.x = x * normalizationFactor * radius;
        v.y = y * normalizationFactor * radius;
        v.z = z * normalizationFactor * radius;

        return v;
      }
      const sphereGeometry = new BufferGeometry();

      var positions = [];

      for (var i = 0; i < 5000; i++) {
        var vertex = randomPointInSphere(3);
        positions.push(vertex.x, vertex.y, vertex.z);
      }

      sphereGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
      const material_sphere = new PointsMaterial({
        size: 0.15,
        map: cross,
        transparent: true,
        blending: AdditiveBlending
      });
      material_sphere.color = new Color(0xe6e600);

      const sphere = new Points(sphereGeometry, material_sphere);
      sphere.position.set(30, 75, -20);
      scene.add(sphere);

      //LIGHT

      const light = new PointLight(0xfcd962, 0.1, 100);
      light.position.set(7, 20, -20);

      var ambientLight = new AmbientLight(0xffffff, 1);
      scene.add(ambientLight);
      light.castShadow = true;
      light.shadow.camera.near = 0.1;
      light.shadow.camera.far = 25;
      scene.add(light);

      function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
      }

      //Mouse
      document.addEventListener('mousemove', animateParticles);

      let mouseY = 0;
      let mouseX = 0;

      function animateParticles(event) {
        mouseY = event.clientX;
        mouseX = event.clientY;
      }

      // VARIABLES for
      const clock = new Clock();

      let delta, time, elapsedTime;
      var orbitRadius = 50;

      function render() {
        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }

        time = Date.now() / 3000;

        sphere.position.x = orbitRadius * Math.cos(time);
        sphere.position.z = orbitRadius * Math.sin(time) - 10;

        delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        if (mixer_birds) mixer_birds.update(delta);

        elapsedTime = clock.getElapsedTime();

        if (mouseX > 0) {
          particleMesh.rotation.x = -mouseY * (elapsedTime * 0.00008);
          particleMesh.rotation.y = mouseX * (elapsedTime * 0.00008);
        } else {
          particleMesh.rotation.y = -0.1 * elapsedTime;
        }

        composer.render();
        requestAnimationFrame(render);
      }
      function revealtitle() {
        var tl2 = gsap.timeline();
        titleWrapper.innerHTML = 'A Thousand Splendid Suns\n- Khaled Hosseini';
        tl2.to(titleWrapper, { opacity: 1, scale: 1.1, ease: 'sine', duration: 5 });
        tl2.to(titleWrapper, { opacity: 0, scale: 0.8, ease: 'sine', duration: 4 });
      }

      var tl = gsap.timeline();
      tl.to(camera.position, { duration: 15, z: -20, ease: 'sine', onComplete: text });
      tl.to(camera.rotation, { duration: 10, x: 1.3, ease: 'back' }, '-=7');
      tl.to(camera.rotation, { duration: 10, x: 1.8, repeat: -1, yoyo: true });

      gsap.to(bloomPass, { duration: 6, threshold: 0.55, ease: 'sine' });
      gsap.to(bloomPass, { duration: 6, strength: 0.5, ease: 'sine' });
      gsap.to(bloomPass, { duration: 1, radius: 1, ease: 'sine', onComplete: revealtitle });

      render();
    }

    main();
  }, []);
  return (
    <>
      <div ref={inputEl}></div>
    </>
  );
}

export default Art;
