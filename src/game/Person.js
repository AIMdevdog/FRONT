import { GameObject } from "./GameObject.js";
export class Person extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;
    this.nextDirection = [];
    this.userid = config.id || false;
    this.directionUpdate = {
      up: ["y", -2],
      down: ["y", 2],
      left: ["x", -2],
      right: ["x", 2],
    };

    this.isUserCalling = false;
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      // More cases for starting to walk will come here
      // Case: We're keyboard ready and have an arrow pressed
      if (state.arrow) {
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow,
        });
      }
      this.updateSprite(state);
    }
  }

  startBehavior(state, behavior) {
    //Set character direction to whatever behavior has
    this.direction = behavior.direction;

    if (behavior.type === "walk") {
      //Stop here if space is not free
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        behavior.retry &&
          setTimeout(() => {
            this.startBehavior(state, behavior);
          }, 6);

        return;
      }

      //Ready to walk!
      this.movingProgressRemaining = 16;
      this.updateSprite(state);
    }
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-" + this.direction);
      return;
    }

    this.sprite.setAnimation("idle-" + this.direction);
  }
}
