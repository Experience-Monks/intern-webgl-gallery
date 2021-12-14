import { useRef, useEffect } from 'react';
import GUI from 'lil-gui';

import {
  AdditiveBlending,
  AmbientLight,
  ClampToEdgeWrapping,
  Color,
  DirectionalLight,
  DoubleSide,
  FrontSide,
  LinearFilter,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Mesh,
  PCFSoftShadowMap,
  PlaneBufferGeometry,
  ShaderMaterial,
  ShadowMaterial,
  SpotLight,
  Texture,
  Vector2,
  Vector3,
  videoImageContext
} from 'three/build/three.module';

import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/js/shaders/FXAAShader.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import disposeObjects from '../../utils/dispose-objects';

function Art() {
  const inputEl = useRef(null);
  const videoElement = useRef(null);
  const videoImg = useRef(null);

  useEffect(() => {
    return () => {
      disposeObjects(inputEl.renderer, inputEl);
    };
  }, []);

  useEffect(() => {
    const sphereRadius = 0.54;

    const video = videoElement.current;
    const videoImage = videoImg.current;

    const scene = new Scene();
    //const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    //const renderer = new WebGLRenderer({ antialias: true });
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    // renderer.gammaInput = true;
    // renderer.gammaOutput = true;
    // renderer.setClearColor(0x000fff);

    // grid & axis helper
    // y frame on material

    // Create a camera and position it
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
    camera.position.z = 2.9 * sphereRadius;
    camera.position.y = 1.5 * sphereRadius;
    camera.lookAt(new Vector3(0, 0, 0));
    camera.layers.enable(1);

    // const controls = new OrbitControls(camera, inputEl.current);
    // controls.enableDamping = true;

    // Add a spotLight to cast shadows and tweak its position
    const spotLight = new SpotLight(0x0077a6, 2);
    spotLight.position.set(-10, 150, -10);
    spotLight.distance = 1700;
    spotLight.power = 10;
    spotLight.castShadow = true;
    spotLight.shadow.bias = 0.001;
    spotLight.shadow.radius = 1;
    spotLight.shadow.mapSize.width = 4096; // Larger size = better quality
    spotLight.shadow.mapSize.height = 4096;
    scene.add(spotLight);

    // // ambient light
    // scene.add(new AmbientLight(0x222222));

    // // directional light
    // var light = new DirectionalLight(0xffffff, 1);
    // light.position.set(80, 80, 80);
    // scene.add(light);

    // Send webcam stream to the <video> tag
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => (video.srcObject = stream))
        .catch((err) => {});
    }

    // Video to canvas
    videoImageContext = videoImage.getContext('2d');
    // background color if no video present
    videoImageContext.fillStyle = '#000000';
    videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);
    videoImageContext.scale(0.5, 1);

    // Canvas to texture
    const videoTextureM = new Texture(videoImage);

    // Apply shader on texture
    var webcamMaterial = new ShaderMaterial({
      uniforms: {
        webcam: { type: 't', value: videoTextureM }
      },
      fragmentShader: `
          uniform sampler2D webcam;
          varying vec2 vUv;

          void main()
          {
              vec3 col = texture2D(webcam, vUv).rgb;

              vec3 blue = col * vec3(0.282,0.663,0.78);

              // Output to screen
              gl_FragColor = vec4(blue, 1.0);
          }
          `,
      vertexShader: `varying vec2 vUv;
          void main() {
              vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }`
    });

    var glowMaterial = new ShaderMaterial({
      uniforms: {
        c: { type: 'f', value: 1.0 },
        p: { type: 'f', value: 1.4 },
        glowColor: { type: 'c', value: new Color(0xffff00) },
        viewVector: { type: 'v3', value: camera.position }
      },
      fragmentShader: `
      uniform vec3 glowColor;
      varying float intensity;
      void main() 
      {
        vec3 glow = glowColor * intensity;
          gl_FragColor = vec4( glow, 1.0 );
      }
      `,
      vertexShader: `
      uniform vec3 viewVector;
      uniform float c;
      uniform float p;
      varying float intensity;
      void main() 
      {
        vec3 vNormal = normalize( normalMatrix * normal );
        vec3 vNormel = normalize( normalMatrix * viewVector );
        intensity = pow( c - dot(vNormal, vNormel), p );
        
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
      `,
      side: FrontSide,
      blending: AdditiveBlending,
      transparent: true
    });

    // Texture to sphere
    var sphere1 = new Mesh(new SphereGeometry(sphereRadius, 64, 64), webcamMaterial);
    sphere1.castShadow = false;
    sphere1.receiveShadow = false;
    scene.add(sphere1);
    sphere1.position.y = 0.1;
    sphere1.layers.set(0);

    var glowSphere = new Mesh(new SphereGeometry(sphereRadius, 64, 64), glowMaterial);
    scene.add(glowSphere);
    glowSphere.position.y = 0.1;
    glowSphere.scale.multiplyScalar(1.2);
    glowSphere.layers.set(0);

    // const geometry = new SphereGeometry();
    // const material = new MeshBasicMaterial({ color: 0xffff00 });
    // const sphere = new Mesh(geometry, material);
    // scene.add(sphere);

    // The shader material does not do shadows. We can either compute the shadows in the fragment shader, or
    // Create a second sphere identical to the first except that it is transparent to do the shadows
    const shadowMaterial = new ShadowMaterial();
    shadowMaterial.opacity = 0.5;
    shadowMaterial.dithering = true;
    shadowMaterial.ditheringshadowSide = DoubleSide;
    var sphere = new Mesh(new SphereGeometry(sphereRadius, 64, 64), shadowMaterial);
    sphere.castShadow = true;
    sphere.receiveShadow = false;
    sphere.position.y = 0.1;
    sphere.layers.set(0);
    scene.add(sphere);

    // Add and position the floor
    var floorGeometry = new PlaneBufferGeometry(1000, 1000);
    var floor = new Mesh(floorGeometry, new MeshPhongMaterial({ color: 0x0f0000 }));

    floor.position.y = -sphereRadius;
    floor.position.x = 0;
    floor.position.z = 0;
    floor.rotation.x = Math.PI / -2;
    floor.castShadow = false;
    floor.receiveShadow = true;
    floor.layers.set(0);
    scene.add(floor);

    let bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.21;
    bloomPass.strength = 1.2;
    bloomPass.radius = 0.55;
    bloomPass.renderToScreen = true;

    let renderScene = new RenderPass(scene, camera);

    // var effectFXAA = new ShaderPass(FXAAShader);
    // effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);

    var composer = new EffectComposer(renderer);
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.addPass(renderScene);
    // composer.addPass( effectFXAA );
    //composer.addPass(bloomPass);

    // --- GUI ---
    const gui = new GUI();

    var glowFolder = gui.addFolder('Glow Shader Controls');

    let parameters = { c: 1.0, p: 1.4, color: '#ffff00' };

    var cGUI = glowFolder.add(parameters, 'c').min(0.0).max(1.0).step(0.01).name('c').listen();
    cGUI.onChange(function (value) {
      glowMaterial.uniforms['c'].value = parameters.c;
    });

    var pGUI = glowFolder.add(parameters, 'p').min(0.0).max(6.0).step(0.01).name('p').listen();
    pGUI.onChange(function (value) {
      glowMaterial.uniforms['p'].value = parameters.p;
    });

    var glowColor = glowFolder.addColor(parameters, 'color').name('Glow Color').listen();
    glowColor.onChange(function (value) {
      glowMaterial.uniforms.glowColor.value.setHex(value.replace('#', '0x'));
    });
    glowFolder.open();

    // Render the scene on the page
    // scene.background = new Color(0x4d322a);
    inputEl.current.append(renderer.domElement);
    render();

    // Update the texture each frame
    let x = 0;
    let y = 0;
    let h = videoImage.height;
    let w = videoImage.width;
    function render() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        videoImageContext.clearRect(0, 0, videoImage.width, videoImage.height);
        videoImageContext.drawImage(video, x, y, w, h);
        if (videoTextureM) videoTextureM.needsUpdate = true;
      }
      requestAnimationFrame(render);
      composer.render();
    }

    // let x = 0;
    // let y = 0;
    // let h = videoImage.height;
    // let w = videoImage.width;
    // render();
    // function render() {
    //   requestAnimationFrame(render);
    //   if (video.readyState === video.HAVE_ENOUGH_DATA) {
    //     videoImageContext.clearRect(0, 0, videoImage.width, videoImage.height);
    //     videoImageContext.drawImage(video, x, y, w, h);
    //     if (videoTextureM) videoTextureM.needsUpdate = true;
    //   }
    //   // delta += 0.1;
    //   // objBack.material.color.r= 0.8 + 0.2*Math.sin(delta);
    //   // objRed.material.color.r = Math.sin(delta);

    //   renderer.clear();
    //   camera.layers.set(1);
    //   composer.render();
    //   renderer.clearDepth();
    //   camera.layers.set(0);
    //   renderer.render(scene, camera);
    // }

    // Gyroscope events
    // window.addEventListener(
    //   'deviceorientation',
    //   function (event) {
    //     // alpha: rotation around z-axis
    //     var rotateDegrees = event.alpha; //0 to 360
    //     // gamma: left to right
    //     var leftToRight = event.gamma; //-90 to +90
    //     // beta: front back motion
    //     var frontToBack = event.beta; //-180 to +180

    //     // Move the light to match the position of gravity
    //     spotLight.position.x = event.gamma / 3;
    //   },
    //   true
    // );

    //camera.position.z = 5;

    // const animate = function () {
    //   requestAnimationFrame(animate);

    //   sphere.rotation.x += 0.01;
    //   sphere.rotation.y += 0.01;

    //   renderer.render(scene, camera);
    // };

    // animate();
  }, []);

  return (
    <>
      <div ref={inputEl}></div>
      <video autoPlay="true" ref={videoElement} id="videoElement" style={{ display: 'none' }}></video>
      <canvas height="1000" width="1000" ref={videoImg} id="videoImage" style={{ display: 'none' }}></canvas>
    </>
  );
}

export default Art;
