import App from "./App.jsx";
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

if (process.env.NODE_ENV === "production") {
  if("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js");
  }
}
