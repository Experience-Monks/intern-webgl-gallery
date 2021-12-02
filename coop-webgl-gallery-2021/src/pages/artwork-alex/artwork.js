import { useRef, useEffect } from 'react';

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  SpotLight
} from 'three/build/three.module';

import disposeObjects from '../../utils/dispose-objects';

function Art() {
  const inputEl = useRef(null);

  useEffect(() => {
    return () => {
      disposeObjects(inputEl.renderer, inputEl);
    };
  }, []);

  useEffect(() => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    inputEl.current.append(renderer.domElement);

    const spotLight = new SpotLight(0xffffff, 2);
    spotLight.position.set(-10, 150, -10);
    scene.add(spotLight);

    const geometry = new SphereGeometry();
    const material = new MeshBasicMaterial({ color: 0xffff00 });
    const sphere = new Mesh(geometry, material);
    scene.add(sphere);

    camera.position.z = 5;

    const animate = function () {
      requestAnimationFrame(animate);

      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <div ref={inputEl}></div>;
}

export default Art;
