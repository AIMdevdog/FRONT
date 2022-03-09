import { Person } from "./Person.js";

import utils from "./utils.js";
export class OverworldMap {
  constructor(config) {
    // const {config, src} = data;
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    // this.cutsceneSpace = config.cutsceneSpace || {};
    this.walls = config.walls || {};
    this.roomNum = config.roomNum;
    // this.roomId = config.roomId;
    this.lowerImage = new Image();
    this.lowerImage.src = config.RoomSrc;


    //이미지 로드 확인
    this.isImageLoaded = false;
    this.lowerImage.onload = () => {
      this.isImageLoaded = true;
    };
  }

  drawLowerImage(ctx, cameraPerson) {
    this.isImageLoaded && ctx.drawImage(
      this.lowerImage,
      ctx.canvas.clientWidth / 2 - cameraPerson.x,
      ctx.canvas.clientHeight / 2 - cameraPerson.y
    );
  }
  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
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
