import React, { useRef, useEffect } from 'react';

import {
  Scene,
  TextureLoader,
  Vector2,
  PerspectiveCamera,
  WebGLRenderer,
  WebGLCubeRenderTarget,
  Clock,
  Raycaster,
  AmbientLight,
  BufferGeometry,
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

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
//import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
//add more imports here, such as the controllers and loaders etc
import { gsap } from 'gsap';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';

function Art() {
  const inputEl = useRef(null);

  useEffect(() => {
    const quote = [
      '"Marriage can wait,\nEducation cannot."',
      '"One could not count the moons that shimmer on her roofs,\nOr the thousand splendid suns that hide behind her walls."',
      '"Of all the hardships a person had to face,\nNone was more punishing than the simple act of waiting."',
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
    inputEl.current.append(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

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

    var titleWrapper = document.getElementById('title');
    var textWrapper = document.getElementById('quote');
    
    //textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    function text() {
      var tl = gsap.timeline();
      // tl.set('.ml12quote', { opacity: 0, scale: 1.1});
      //console.log(quote[quote_index]);
      textWrapper.innerHTML = quote[quote_index];
      tl.to('.ml12quote', { opacity: 1, ease: 'sine', duration: 2, scale: 0.9 });
      tl.to('.ml12quote', { opacity: 0, ease: 'linear.out', duration: 4, scale: 1.1, delay: 2, onComplete: updateTXT });
    }

    function updateTXT() {
      quote_index++;
      if (quote_index >= quote.length) {
        quote_index = 0;
      }
      text();
    }
    function onWindowResize() {
      const width = inputEl.current.offsetWidth;
      const height = inputEl.current.offsetHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      composer.setSize(width, height);
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

      // loading 3D object
      let loader_terrain = new FBXLoader();
      loader_terrain.load('../../assets/models/desert/desert_Pillar_terrain.fbx', function (obj) {
        obj.position.set(-10, -4, -25);
        obj.scale.set(0.05, 0.05, 0.05);
        obj.rotation.set(0, 90, 0);
        //obj.layers.enable(1);
        //obj.layers.enable(BLOOM_SCENE);
        scene.add(obj);
        //console.log(birds);s
        //animate();
      });

      //trees

      // loading 3D object
      let mixer;
      let loader_trees = new GLTFLoader();
      loader_trees.load('../../assets/models/pinktree/source/pinktree.glb', function (obj) {
        const clips = obj.animations;
        mixer = new AnimationMixer(obj.scene);
        const clip = AnimationClip.findByName(clips, 'windAction.001');
        const action = mixer.clipAction(clip);
        //action.setLoop(true);
        action.play();

        obj.scene.position.set(2, -4, -30);
        //obj.scene.layers.enable(1);
        //obj.scene.layers.enable(BLOOM_SCENE);
        scene.add(obj.scene);
        //console.log(birds);s
        //animate();
      });

      const cross = new TextureLoader().load('../../assets/models/glow2.png');
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
        var vertex = randomPointInSphere(5);
        positions.push(vertex.x, vertex.y, vertex.z);
      }

      sphereGeometry.addAttribute('position', new Float32BufferAttribute(positions, 3));
      //geometry_sphere.setAttribute('position', new BufferAttribute(posArray, 3));
      const material_sphere = new PointsMaterial({
        size: 0.15,
        map: cross,
        //color: (0,1,0,1),
        transparent: true,
        blending: AdditiveBlending
      });
      material_sphere.color = new Color(0xe6e600);

      const sphere = new Points(sphereGeometry, material_sphere);
      sphere.position.set(30,75,-20);
      //sphere.layers.enable(BLOOM_SCENE);
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
      //document.addEventListener("mousemove", animateParticles);

      // let mouseY = 0;
      // let mouseX = 0;

      // function animateParticles(event) {
      //   mouseY = event.clientY;
      //   mouseX = event.clientX;
      // }

      //hover
      camera.position.set(3.538957295625084e-7, -1.021684878863786, -9.589670059257917e-7);
      // window.addEventListener('mousemove', onDocumentMouseMove, false);

      // VARIABLES for
      const clock = new Clock();

      let delta, time;
      var orbitRadius = 50;
      //const elapsedTime = clock.getElapsedTime();

      function render() {
        
        
        time = Date.now() / 2500;

        sphere.position.x = orbitRadius * Math.cos( time );
        sphere.position.z = orbitRadius * Math.sin( time ) - 10;
        // TWEEN.update();
        delta = clock.getDelta();
        if (mixer) mixer.update(delta); // problem here

        //requestAnimationFrame( animate );

        //scamera.lookAt(sphere.position);
        //renderer.render(scene, camera);

        //renderer.clear();
        //camera.layers.set(BLOOM_SCENE);
        //finalComposer.render();
        composer.render();
        requestAnimationFrame(render);
      }
      function revealtitle() {
        var tl2 = gsap.timeline();
        titleWrapper.innerHTML = 'A Thousand Splendid Suns\n- Khaled Hosseini';
        tl2.to('.ml12', { opacity: 1, scale: 1.1, ease: 'sine', duration: 5 });
        tl2.to('.ml12', { opacity: 0, scale: 0.8, ease: 'sine', duration: 4 });
      }

      var tl = gsap.timeline();
      tl.to(camera.position, { duration: 15, z: -20, ease: 'sine', onComplete: text });
      tl.to(camera.rotation, { duration: 10, x: 1.3, ease: 'back' }, '-=7');
      tl.to(camera.rotation, { duration: 10, x: 1.8, repeat: -1, yoyo: true });

      gsap.to(bloomPass, { duration: 6, threshold: 0.55, ease: 'sine' });
      gsap.to(bloomPass, { duration: 6, strength: 0.5, ease: 'sine' });
      gsap.to(bloomPass, { duration: 1, radius: 1, ease: 'sine', onComplete: revealtitle });
      onWindowResize();

      render();
    }
    //text();
    main();
  }, []);
  return (
    <>
      <div ref={inputEl}></div>
    </>
  );
}

export default Art;
