import { Sprite } from "./Sprite.js";

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
    
  }

  mount(map) {
    console.log("mounting!");
    //If we have a behavior, kick off after a short delay
  }

  update() {}
}
