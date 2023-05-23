import { Component, onMount } from "solid-js";
import * as THREE from "three";
import { WebGLRenderer } from "three";
import styles from "./SceneGraph.module.css";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

class AxisGridHelper {
  grid;
  axes;
  _visible: any;
  constructor(node, units = 10) {
    const axes = new THREE.AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 2; // after the grid
    node.add(axes);

    const grid = new THREE.GridHelper(units, units);
    grid.material.depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);

    this.grid = grid;
    this.axes = axes;
    this.visible = false;
  }
  get visible() {
    return this._visible;
  }
  set visible(v) {
    this._visible = v;
    this.grid.visible = v;
    this.axes.visible = v;
  }
}

const SceneGraph: Component = () => {
  let canvas!: HTMLCanvasElement;
  let renderer: WebGLRenderer;
  const gui = new GUI();

  const fov = 40;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;

  const scene = new THREE.Scene();

  // an array of objects whose rotation to update
  const objects: any[] = [];

  // use just one sphere for everything
  const radius = 1;
  const widthSegments = 6;
  const heightSegments = 6;
  const sphereGeometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );

  const solarSystem = new THREE.Object3D();
  scene.add(solarSystem);

  const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
  sunMesh.scale.set(5, 5, 5); // make the sun large
  solarSystem.add(sunMesh);
  objects.push(sunMesh);

  const earthOrbit = new THREE.Object3D();
  earthOrbit.position.x = 10;
  solarSystem.add(earthOrbit);
  objects.push(earthOrbit);

  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x2233ff,
    emissive: 0x112244,
  });
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
  earthOrbit.add(earthMesh);
  objects.push(earthMesh);

  objects.push(solarSystem);

  const moonOrbit = new THREE.Object3D();
  moonOrbit.position.x = 2;
  earthOrbit.add(moonOrbit);

  const moonMaterial = new THREE.MeshPhongMaterial({
    color: 0x888888,
    emissive: 0x222222,
  });
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.set(0.5, 0.5, 0.5);
  moonOrbit.add(moonMesh);
  objects.push(moonMesh);

  const color = 0xffffff;
  const intensity = 3;
  const light = new THREE.PointLight(color, intensity);
  scene.add(light);

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 50, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  // add an AxesHelper to each node
  // objects.forEach((node) => {
  // const axes = new THREE.AxesHelper();
  // axes.material.depthTest = false;
  // axes.renderOrder = 1;
  // node.add(axes);
  // });

  // function makeAxisGrid(node, label, units = 10) {
  //   const helper = new AxisGridHelper(node, units);
  //   gui.add(helper, "visible").name(label);
  // }

  // makeAxisGrid(solarSystem, "solarSystem", 25);
  // makeAxisGrid(sunMesh, "sunMesh");
  // makeAxisGrid(earthOrbit, "earthOrbit");
  // makeAxisGrid(earthMesh, "earthMesh");
  // makeAxisGrid(moonOrbit, "moonOrbit");
  // makeAxisGrid(moonMesh, "moonMesh");

  onMount(() => {
    renderer = new WebGLRenderer({ antialias: true, canvas });
    // renderer.render(scene, camera);
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

    objects.forEach((obj) => {
      obj.rotation.y = time;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  return (
    <div class={styles.App}>
      <span>Scene graph example</span>
      <canvas ref={canvas} id="c1" />
    </div>
  );
};

export default SceneGraph;
