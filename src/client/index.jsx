import App from "./App";
import { getStore } from "./redux";
import { bootstrapClient } from "./socketio";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

document.addEventListener("DOMContentLoaded", async () => {
  const root = document.getElementById("AppRoot");
  if (!root) {
    throw new Error("Missing AppRoot element.");
  }

  await ReactDOM.render(
    <Provider store={getStore()}>
      <App />
    </Provider>,
    root,
  );
  bootstrapClient();
});

const registerServiceWorker = async () => {
  if("serviceWorker" in navigator) {
    const reg = await navigator.serviceWorker.register("./service-worker.js");
    console.log(reg);
  }
}

registerServiceWorker();
