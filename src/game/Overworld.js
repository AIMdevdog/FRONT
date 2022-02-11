import { OverworldMap } from "./OverworldMap.js";
import { KeyPressListener } from "./KeyPressListener.js";
import { DirectionInput } from "./DirectionInput.js";
export class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }

  startGameLoop() {
    const step = () => {
      //Clear off the canvas
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Establish the camera person
      const cameraPerson = this.map.gameObjects.hero;

      //Update all objects
      Object.values(this.map.gameObjects).forEach((object) => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });

      //Draw Lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);

      //Draw Game Objects
      Object.values(this.map.gameObjects)
        .sort((a, b) => {
          return a.y - b.y;
        })
        .forEach((object) => {
          object.sprite.draw(this.ctx, cameraPerson);
        });

      //Draw Upper layer
      this.map.drawUpperImage(this.ctx, cameraPerson);

      requestAnimationFrame(() => {
        step();
      });
    };
    step();
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      // Is there a person here to talk to?
      this.map.checkForActionCutscene();
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", (e) => {
      if (e.detail.whoId === "hero") {
        // Hero's position has changed
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startMap(mapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
  }

  init() {
    // const socket = io("localhost:3000");

    this.startMap(window.OverworldMaps.TestingRoom);

    // socket.on("input", function (data) {
    //   // console.log(window.OverworldMaps.DemoRoom);
    //   // this.startMap();
    //   console.log(data, "this");
    // });

    // socket.on("join_user", function (data) {
    //   console.log(data);
    // });
    // console.log(this.map);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    this.map.startCutscene([
      // { type: "battle", },
      // { type: "changeMap", map: "DemoRoom" },
      // { type: "textMessage", text: "This is the very first message" },
    ]);
  }
}
