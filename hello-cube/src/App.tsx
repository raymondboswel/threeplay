import { A, Route, Routes } from "@solidjs/router";
import { Component } from "solid-js";
import styles from "./App.module.css";
import HelloCube from "./pages/HelloCube";
import { Obj3D } from "./pages/obj_3d/Obj3D";
import SceneGraph from "./pages/scene-graph/SceneGraph";

const App: Component = () => {
  return (
    <div class={styles.App}>
      <main class={styles.main}>
        <header class={styles.header}>
          <nav class={styles.nav}>
            <A
              activeClass="underline"
              inactiveClass="no-underline"
              href="/hello-cube"
            >
              Hello Cube
            </A>
            <A
              activeClass="underline"
              inactiveClass="no-underline"
              href="/scene-graph"
            >
              Scene Graph
            </A>
            <A
              activeClass="underline"
              inactiveClass="no-underline"
              href="/obj-3d"
            >
              Obj 3D
            </A>
          </nav>
        </header>
        <section class={styles.content}>
          <Routes>
            <Route path="/hello-cube" component={HelloCube}></Route>
            <Route path="/scene-graph" component={SceneGraph}></Route>
            <Route path="/obj-3d" component={Obj3D}></Route>
          </Routes>
        </section>
      </main>
    </div>
  );
};

export default App;
