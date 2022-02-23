import React from "react";
import ReactDOM from "react-dom";
import ReactModal from "react-modal";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";

ReactModal.setAppElement("#root");

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
