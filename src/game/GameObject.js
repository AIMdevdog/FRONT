import { Sprite } from "./Sprite.js";
import { OverworldEvent } from "./OverworldEvent";

export class GameObject {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src:
        config.src ||
        "/src/game/images/characters/people/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-MPN2TapcbBVMdbCP0jR6.png",
    });

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;
    this.talking = config.talking || [];
  }

  mount(map) {
    console.log("mounting!");
    this.isMounted = true;
    map.addWall(this.x, this.y);

    //If we have a behavior, kick off after a short delay
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10);
  }

  update() {}

  async doBehaviorEvent(map) {
    //Don't do anything if there is a more important cutscene or I don't have config to do anything
    //anyway.
    if (
      map.isCutscenePlaying ||
      this.behaviorLoop.length === 0 ||
      this.isStanding
    ) {
      return;
    }

    //Setting up our event with relevant info
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    //Create an event instance out of our next event config
    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init();

    //Setting the next event to fire
    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    //Do it again!
    this.doBehaviorEvent(map);
  }
}
