import { Component, onMount } from "solid-js";
import * as THREE from "three";
import { WebGLRenderer } from "three";
import styles from "./App.module.css";

const App: Component = () => {
  let canvas!: HTMLCanvasElement;
  let renderer: WebGLRenderer;

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const cubes = [
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844, 2),
  ];

  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  function makeInstance(geometry: any, color: any, x: any) {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }

  onMount(() => {
    renderer = new WebGLRenderer({ antialias: true, canvas });
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  });

  function resizeRendererToDisplaySize(renderer: any) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time = 0) {
    time *= 0.001; // convert time to seconds
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <span>Hello CUBE</span>
        <canvas ref={canvas} id="c" />
      </header>

      <main></main>
    </div>
  );
};

export default App;
