import { Sprite } from "./Sprite.js";
import { OverworldEvent } from "./OverworldEvent";

export class GameObject {
  constructor(config) {
    // console.log("gameobject_src: ", config.src);
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "up";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src,
    });
    this.nickname = "";

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;
    this.talking = config.talking || [];
  }

  mount(map) {
    console.log("mounting!");
    //If we have a behavior, kick off after a short delay
  }

  update() {}
}
