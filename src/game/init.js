import { Overworld } from "./Overworld.js";

(function () {
  const overworld = new Overworld({
    element: document.querySelector(".game-container"),
  });
  overworld.init();
})();
