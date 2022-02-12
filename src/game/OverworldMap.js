import { Person } from "./Person.js";

import utils from "./utils.js";
export class OverworldMap {
  constructor(config) {
    // const {config, src} = data;
    
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpace = config.cutsceneSpace || {};
    this.walls = config.walls || {};
    // console.log(this.gameObjects.hero.src);
    // this.gameObjects.hero.src = src;
    // console.log(this.gameObjects.hero.src);

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      // utils.withGrid(10.5) - cameraPerson.x,
      // utils.withGrid(6) - cameraPerson.y
      utils.withGrid(ctx.canvas.clientWidth / 16 / 2) - cameraPerson.x,
      utils.withGrid(ctx.canvas.clientHeight / 16 / 2) - cameraPerson.y
    );
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);
    });
  }

  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

// window.OverworldMaps = {
//   TestingRoom: {
//     lowerSrc: "https://aim-image-storage.s3.ap-northeast-2.amazonaws.com/map2.png",
//     upperSrc: "/images/maps/KitchenUpper.png",
//     id: 123,
//     gameObjects: {
//       hero: new Person({
//         id: null,
//         isPlayerControlled: true,
//         x: utils.withGrid(5),
//         y: utils.withGrid(5),
//         // src: "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-MPN2TapcbBVMdbCP0jR6.png"
//       }),
//     },
//   },
// };