import { Component, onMount } from "solid-js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import styles from "./Obj3D.module.css";
import { WebGLRenderer } from "three";
import windmill from "../../assets/windmill_001.obj?raw";
import windmillUrl from "../../assets/windmill_001.obj";
import windmillMtlUrl from "../../assets/windmill_001.mtl";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";

export interface Props {}

export const Obj3D: Component<Props> = (props: Props) => {
  let canvas: HTMLCanvasElement;
  let renderer: WebGLRenderer;

  const fov = 45;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);
  let controls: OrbitControls;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("black");

  {
    const planeSize = 40;

    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      "https://threejs.org/manual/examples/resources/images/checker.png"
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    scene.add(mesh);
  }

  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load(windmillMtlUrl, (mtl: any) => {
      console.log(mtl.preload);
      mtl.preload();
      console.log(mtl);

      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load(windmillUrl, (root: any) => {
        scene.add(root);
      });
    });
  }

  onMount(() => {
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.physicallyCorrectLights = true;

    controls = new OrbitControls(camera, canvas);

    controls.target.set(0, 5, 0);
    controls.update();
    requestAnimationFrame(render);
  });

  class ColorGUIHelper {
    constructor(public object: any, public prop: any) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

  function makeXYZGUI(gui: any, vector3: any, name: any, onChangeFn?: any) {
    const folder = gui.addFolder(name);
    folder.add(vector3, "x", -10, 10).onChange(onChangeFn);
    folder.add(vector3, "y", 0, 10).onChange(onChangeFn);
    folder.add(vector3, "z", -10, 10).onChange(onChangeFn);
    folder.open();
  }

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.PointLight(color, intensity);
    light.power = 800;
    light.decay = 2;
    light.distance = Infinity;
    light.position.set(0, 10, 0);
    scene.add(light);

    const helper = new THREE.PointLightHelper(light);
    scene.add(helper);

    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
    gui.add(light, "decay", 0, 4, 0.01);
    gui.add(light, "power", 0, 1220);

    makeXYZGUI(gui, light.position, "position");
  }

  function resizeRendererToDisplaySize(renderer: any) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  return (
    <>
      <div class={styles.Container}>
        <span>OBJ file 3D example</span>
        <canvas ref={canvas!} id="c1" />
      </div>
    </>
  );
};
