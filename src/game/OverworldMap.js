import { Person } from "./Person.js";
import { OverworldEvent } from "./OverworldEvent.js";

import utils from "./utils.js";
export class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpace = config.cutsceneSpace || {};
    this.walls = config.walls || {};

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

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      });
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    // Reset NPCs to do their idle behabior
    Object.values(this.gameObjects).forEach((object) =>
      object.doBehaviorEvent(this)
    );
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });

    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpace[`${hero.x},${hero.y}`];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
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

if (typeof window !== "undefined") {
  window.OverworldMaps = {
    DemoRoom: {
      lowerSrc: "/src/game/images/maps/DemoLower.png",
      upperSrc: "/src/game/images/maps/DemoUpper.png",
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(5),
          y: utils.withGrid(6),
        }),
        npcA: new Person({
          x: utils.withGrid(7),
          y: utils.withGrid(9),
          src: "/images/characters/people/npc1.png",
          behaviorLoop: [
            { type: "stand", direction: "left", time: 800 },
            { type: "stand", direction: "up", time: 800 },
            { type: "stand", direction: "right", time: 1200 },
            { type: "stand", direction: "up", time: 300 },
          ],
          talking: [
            {
              events: [
                { type: "textMessage", text: "I'm busy...", faceHero: "npcA" },
                { type: "textMessage", text: "Go away!" },
                { who: "hero", type: "walk", direction: "up" },
              ],
            },
          ],
        }),
        npcB: new Person({
          x: utils.withGrid(8),
          y: utils.withGrid(5),
          src: "/images/characters/people/npc2.png",
          // behaviorLoop: [
          //   { type: "walk", direction: "left" },
          //   { type: "stand", direction: "up", time: 800 },
          //   { type: "walk", direction: "up" },
          //   { type: "walk", direction: "right" },
          //   { type: "walk", direction: "down" },
          // ],
        }),
      },
      walls: {
        [utils.asGridCoord(7, 6)]: true,
        [utils.asGridCoord(8, 6)]: true,
        [utils.asGridCoord(7, 7)]: true,
        [utils.asGridCoord(8, 7)]: true,
      },
      cutsceneSpace: {
        [utils.asGridCoord(7, 4)]: [
          {
            events: [
              { who: "npcB", type: "walk", direction: "left" },
              { who: "npcB", type: "stand", direction: "up", time: 500 },
              { type: "textMessage", text: "You can't be in there" },
              { who: "npcB", type: "walk", direction: "right" },
              { who: "hero", type: "walk", direction: "down" },
              { who: "hero", type: "walk", direction: "left" },
            ],
          },
        ],
        [utils.asGridCoord(5, 10)]: [
          {
            events: [{ type: "changeMap", map: "Kitchen" }],
          },
        ],
      },
    },
    Kitchen: {
      lowerSrc: "/images/maps/KitchenLower.png",
      upperSrc: "/images/maps/KitchenUpper.png",
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(5),
          y: utils.withGrid(5),
        }),
        npcB: new Person({
          x: utils.withGrid(10),
          y: utils.withGrid(8),
          src: "/images/characters/people/npc3.png",
          talking: [
            {
              events: [
                { type: "textMessage", text: "You made it", faceHero: "npcB" },
              ],
            },
          ],
        }),
      },
    },
    TestingRoom: {
      lowerSrc:
        "https://aim-image-storage.s3.ap-northeast-2.amazonaws.com/map2.png",
      upperSrc: "/src/game/images/maps/KitchenUpper.png",
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(5),
          y: utils.withGrid(5),
          src: "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-MPN2TapcbBVMdbCP0jR6.png",
        }),
        npcB: new Person({
          x: utils.withGrid(5),
          y: utils.withGrid(5),
          src: "/src/game/images/characters/people/avatar-dQCYs4n7O99ksXuBIe33-UzbB5TTbkmeLg7hfrUii-yFpcQh7UcvdChVN8WvIW-Qjhn5Biz0wHk7Jh0Lg0w-CgjGnJ2FTTfWiE3tf7Uj-09g8XhwETZ7wAhFTUs4s.png",
          talking: [
            {
              events: [
                { type: "textMessage", text: "You made it", faceHero: "npcB" },
              ],
            },
          ],
        }),
      },
    },
  };
}
