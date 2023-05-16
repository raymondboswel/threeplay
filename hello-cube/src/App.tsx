import { A, Route, Routes } from "@solidjs/router";
import { Component } from "solid-js";
import styles from "./App.module.css";
import HelloCube from "./pages/HelloCube";

const App: Component = () => {
  return (
    <div class={styles.App}>
      <main class={styles.main}>
        <header class={styles.header}>
          <nav>
            <A href="/hello-cube">Hello Cube</A>
          </nav>
        </header>
        <section class={styles.content}>
          <Routes>
            <Route path="/hello-cube" component={HelloCube}></Route>
          </Routes>
        </section>
      </main>
    </div>
  );
};

export default App;
