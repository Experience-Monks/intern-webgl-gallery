import React, { useRef, useEffect } from 'react';

import {
  Scene,
  Vector2,
  PerspectiveCamera,
  BoxGeometry,
  Mesh,
  WebGLRenderer} from 'three/build/three.module';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function Art() {
  const inputEl = useRef(null);

  useEffect(() => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, inputEl.current.offsetWidth / inputEl.current.offsetHeight, 0.1, 1000);
    const renderer = new WebGLRenderer();
    
    renderer.setPixelRatio(inputEl.current.offsetWidth / inputEl.current.offsetHeight);
    renderer.setSize(inputEl.current.offsetWidth, inputEl.current.offsetHeight);
    inputEl.current.append(renderer.domElement);

    inputEl.current.addEventListener('mousemove', onPointerMove);
    inputEl.current.addEventListener('resize', onWindowResize);

    const controls = new OrbitControls(camera, inputEl.current);
    const mouse = new Vector2();

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
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        render();
    }

    function render() {
      renderer.render(scene, camera);
    }
    function init(){
        const geometry = new BoxGeometry();
        const material = new MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new Mesh(geometry, material);
        scene.add(cube);
        camera.position.z = 5;
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