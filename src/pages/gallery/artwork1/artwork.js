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
  AnimationMixer
} from 'three/build/three.module';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
//add more imports here, such as the controllers and loaders etc

function Art() {
  const inputEl = useRef(null);

  useEffect(() => {
    // const quote = [
    //   'Marriage can wait, education cannot.',
    //   'One could not count the moons that shimmer on her roofs, Or the thousand splendid suns that hide behind her walls.',
    //   'Of all the hardships a person had to face, none was more punishing than the simple act of waiting.',
    //   'Behind every trial and sorrow that He makes us shoulder, God has a reason.',
    //   'Like a compass facing north, a man’s accusing finger always finds a woman.',
    //   'You see, some things I can teach you. Some you learn from books. But there are things that, well, you have to see and feel.',
    //   'I only have eyes for you.',
    //   'And the past held only this wisdom: that love was a damaging mistake, and its accomplice, hope, a treacherous illusion.',
    //   'yet love can move people to act in unexpected ways and move them to overcome the most daunting obstacles with startling heroism',
    //   'she was leaving the world as a woman who had love and been loved back',
    //   "But we're like those walls up there. Battered, and nothing pretty to look at, but still standing.",
    //   'Each snowflake was a sigh heard by an aggrieved woman somewhere in the world.',
    //   'Tell your secret to the wind, but don’t blame it for telling the trees.',
    //   'People…shouldn’t be allowed to have new children if they’d already given away all their love to their old ones. It wasn’t fair.',
    //   'You’re not going to cry, are you? \n - I am not going to cry! Not over you. Not in a thousand years.'
    // ];

    const camera = new PerspectiveCamera(100, inputEl.current.offsetWidth / inputEl.current.offsetHeight, 0.1, 1000);

    const renderer = new WebGLRenderer();
    renderer.setSize(inputEl.current.offsetWidth, inputEl.current.offsetHeight);
    inputEl.current.append(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    const scene = new Scene();
    camera.position.z = 3;

    // let composer = new EffectComposer(renderer);
    // composer.addPass(new RenderPass(scene, camera));

    // const effectPass = new EffectPass(
    //   camera,
    //   new BloomEffect()
    // );
    // effectPass.renderToScreen = true;
    // composer.addPass(effectPass);

    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(
      new Vector2(inputEl.current.offsetWidth, inputEl.current.offsetHeight),
      1.5,
      0.4,
      0.85
    );
    var bloomStrength = 1;
    var bloomRadius = 0;
    var bloomThreshold = 0.5;

    bloomPass.threshold = bloomThreshold;
    bloomPass.strength = bloomStrength;
    bloomPass.radius = bloomRadius;

    let composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // function text(){
    //   var textWrapper = document.querySelector('.ml12');
    //   textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    //   anime.timeline({loop: true})//
    //   .add({
    //       targets: '.ml12 .letter',
    //       translateX: [40,0],
    //       translateZ: 0,
    //       opacity: [0,1],
    //       easing: "easeOutExpo",
    //       duration: 1500,
    //       delay: (el, i) => 500 + 60 * i
    //   }).add({
    //       targets: '.ml12 .letter',
    //       translateX: [0,-30],
    //       opacity: [1,0],
    //       easing: "easeInExpo",
    //       duration: 1100,
    //       delay: (el, i) => 100 + 30 * i
    //   });

    // }

    function main() {
      // add background
      {
        const loader = new TextureLoader();
        const texture = loader.load('../../assets/models/sky2.jpeg', () => {
          const rt = new WebGLCubeRenderTarget(texture.image.height);
          rt.fromEquirectangularTexture(renderer, texture);
          scene.background = rt.texture;
        });
      }

      // loading 3D object
      // var tree = new Vector3();
      // let loader = new GLTFLoader();
      //     loader.load('././beautiful_autumn/scene.gltf', function(gltf){
      //     gltf.scene.position.set(0,-25,-20);
      //     tree = gltf.scene.position;
      //     let material = new PointsMaterial({ color: 0xFFFFFF, size: 1 })
      //     var mesh = new Points(gltf.scene.children[0].geometry, material)
      //     //console.log(gltf.scene.children[0].geometry);
      //     //gltf.scene.scale.set(0.05,0.05,0.05);
      //     scene.add(mesh);
      //     //console.log(birds);
      //     //animate();
      // });

      //   let loader_tree = new GLTFLoader();
      //   loader_tree.load('././beautiful_autumn/scene.gltf', function(gltf){
      //     gltf.scene.position.set(0,-25,-20);
      //     gltf.scene.scale.set(1.5,1.5,1.5);
      //    // gltf.scene.rotation.set(0,-25,-20);
      //     scene.add(gltf.scene);
      //     //console.log(birds);
      //     //animate();
      //  });

      //  const loader2 = new OBJLoader()
      //  loader2.load('././tree/treebark.obj',
      //  (obj) => {
      //      // the request was successfull
      //      let material = new PointsMaterial({ color: 0x824235, size: 0.025})
      //      var mesh = new Points(obj.children[0].geometry, material)

      //      mesh.scale.set(7.5,7.5,7.5);
      //      mesh.position.set(6,1,-20);//this model is not exactly in the middle by default so I moved it myself
      //      scene.add(mesh)
      //  })

      // const loader3 = new OBJLoader()
      // loader3.load('././lowpolytree/tree.obj',
      // (obj) => {
      //     // the request was successfull
      //     let material = new LineBasicMaterial({ color: 0x824235, size: 0.025})
      //     var mesh = new Line(obj.children[0].geometry, material)

      //     mesh.scale.set(0.05,0.05,0.05);
      //     mesh.position.set(6,2,-20);//this model is not exactly in the middle by default so I moved it myself
      //     scene.add(mesh)
      // })

      // loading 3D object
      let loader_terrain = new FBXLoader();
      loader_terrain.load('../../assets/models/desert/desert_Pillar_terrain.fbx', function (obj) {
        obj.position.set(-10, -4, -25);
        obj.scale.set(0.05, 0.05, 0.05);
        obj.rotation.set(0, 90, 0);
        scene.add(obj);
        //console.log(birds);s
        //animate();
      });

      //trees

      // loading 3D object
      let mixer;
      let loader_trees = new GLTFLoader();
      loader_trees.load('../../assets/models/pinktree/source/pinktree.glb', function (obj) {
        // obj.position.set(0,-4,0);
        //obj.scale.set(0.01,0.01,0.01);
        //mixer = new AnimationMixer( obj );
        //let action = mixer.clipAction( obj.animations[0] );
        //console.log(obj.animat5ions);
        const clips = obj.animations;
        mixer = new AnimationMixer(obj.scene);
        const clip = AnimationClip.findByName(clips, 'windAction.001');
        const action = mixer.clipAction(clip);
        //action.setLoop(true);
        action.play();

        //casting shadows
        obj.scene.traverse(function (node) {
          if (node.isMesh) {
            node.castShadow = true;
          }
        });

        obj.scene.position.set(2, -4, -30);
        scene.add(obj.scene);
        //console.log(birds);s
        //animate();
      });

      // TEXT

      //  const loader_text = new FontLoader();

      //  loader_text.load( '../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {

      //    const geometry = new TextGeometry( 'Amna @ Jam3', {
      //      font: font,
      //      size: 0.4,
      //      height: 0.3
      //    } );
      //    var text = new Object3D();

      //    // set the material position and rotation for the text
      //    var textMaterial = new MeshBasicMaterial( { color: 0xfff9cc, overdraw: true } );
      //    text = new Mesh( geometry, textMaterial );
      //    text.position.set(12,0,-15);
      //    text.lookAt(camera.position)
      //    scene.add( text );
      //    //geometry.position.set(0,-25,-25);
      //  } );

      // adding particles
      // const particleGeometry = new BufferGeometry;
      // const particlesCnt= 1500;
      // const posArray = new Float32Array(particlesCnt * 3);

      // for (let i = 0; i < particlesCnt * 3; i++){

      //     posArray[i] = (Math.random() - 0.5) * 2;
      // }
      // particleGeometry.setAttribute('position', new BufferAttribute(posArray, 3));

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
      sphere.position.set(7, 10, -20);
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

      // add foregound sprite
      //   {
      //     const map = new TextureLoader().load( '.././foreground.png' );
      //     const material_sprite = new SpriteMaterial( { map: map } );

      //     const aqsa_sprite = new Sprite( material_sprite );
      //     aqsa_sprite.position.set(camera.position.x, camera.position.y, 2 );
      //    // aqsa_sprite.scale.set(30,20,1);
      //     scene.add( aqsa_sprite );
      //   }

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

      /*
        // create an AudioListener and add it to the camera
    
        const listener = new AudioListener();
        camera.add( listener );
    
        // create a global audio source
        const sound = new Audio( listener );
    
        // load a sound and set it as the Audio object's buffer
        const audioLoader = new AudioLoader();
        audioLoader.load( '.././piano.ogg', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( true );
            sound.setVolume( 0.5 );
            sound.play();
        });
        */
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

      var mouse;
      var raycaster;

      //RAYCASTER
      raycaster = new Raycaster();
      mouse = new Vector2(1, 1);

      // VARIABLES for
      const clock = new Clock();
      var text1 = false;
      var nothing = false;

      let delta;
      //const elapsedTime = clock.getElapsedTime();
      var intersects;

      function render() {
        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }

        //particleMesh.rotation.x = -mouseY * (elapsedTime * 0.00008);
        //particleMesh.rotation.y = -mouseX * (elapsedTime * 0.00008);

        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // calculate objects intersecting the picking ray

        intersects = raycaster.intersectObjects(scene.children);
        // console.log(intersects[0].object);

        if (intersects.length > 0 && intersects[0].object === sphere) {
          //sphere.scale.set(1,1,1);
          //buildUp().start();

          if (!text1) {
            //spheretweenup.start();
            //document.getElementById('subtitles').innerHTML = 'A lady in one';
            //text();
            text1 = true;
            nothing = false;
          }
        } else {
          //sphere.scale.set(0.5,0.5,0.5);
          //buildDown().start();

          if (!nothing) {
            //spheretweendown.start();
            nothing = true;
            text1 = false;
            //document.getElementById('subtitles').innerHTML = 'A Thousand Splendid suns';
            //text();
          }

          //document.getElementById("subtitles").innerHTML = "A thousand splendid suns";
        }

        sphere.rotation.y += 0.0035;
        // TWEEN.update();
        delta = clock.getDelta();
        if (mixer) mixer.update(delta); // problem here

        //requestAnimationFrame( animate );

        //scamera.lookAt(sphere.position);
        //renderer.render(scene, camera);
        composer.render();
        requestAnimationFrame(render);
      }

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
