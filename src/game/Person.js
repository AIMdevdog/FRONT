import { GameObject } from "./GameObject.js";
export class Person extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;
    this.nextDirection = [];
    this.userid = config.id || false;
    this.directionUpdate = {
      up: ["y", -4],
      down: ["y", 4],
      left: ["x", -4],
      right: ["x", 4],
    };
    this.isUserCalling = false;
    this.isUserJoin = false;
    this.groupName = 0;
    this.angle = 1;
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
      this.movingProgressRemaining = 8;
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
      if (this.angle === 1) {
        this.sprite.setAnimation("walk-" + this.direction);
      } else if (this.angle === 2) {
        switch (this.direction) {
          case "up":
            this.sprite.setAnimation("walk-" + "left");
            // this.direction = "right"
            break;
          case "down":
            this.sprite.setAnimation("walk-" + "right");
            // this.direction = "left"
            break;
          case "right":
            this.sprite.setAnimation("walk-" + "up");
            // this.direction = "down"
            break;
          case "left":
            this.sprite.setAnimation("walk-" + "down");
            // this.direction = "up"
            break;
        }
      } else if (this.angle === 3) {
        switch (this.direction) {
          case "up":
            this.sprite.setAnimation("walk-" + "down");
            // this.direction = "right"
            break;
          case "down":
            this.sprite.setAnimation("walk-" + "up");
            // this.direction = "left"
            break;
          case "right":
            this.sprite.setAnimation("walk-" + "left");
            // this.direction = "down"
            break;
          case "left":
            this.sprite.setAnimation("walk-" + "right");
            // this.direction = "up"
            break;
        }
      } else if (this.angle === 4) {
        switch (this.direction) {
          case "up":
            this.sprite.setAnimation("walk-" + "right");
            // this.direction = "right"
            break;
          case "down":
            this.sprite.setAnimation("walk-" + "left");
            // this.direction = "left"
            break;
          case "right":
            this.sprite.setAnimation("walk-" + "down");
            // this.direction = "down"
            break;
          case "left":
            this.sprite.setAnimation("walk-" + "up");
            // this.direction = "up"
            break;
        }
      }
      return;
    }
    if (this.angle === 1) {
      this.sprite.setAnimation("idle-" + this.direction);
    } else if(this.angle === 2) {
      switch (this.direction) {
        case "up":
          this.sprite.setAnimation("idle-" + "left");
          // this.direction = "right"
          break;
        case "down":
          this.sprite.setAnimation("idle-" + "right");
          // this.direction = "left"
          break;
        case "right":
          this.sprite.setAnimation("idle-" + "up");
          // this.direction = "down"
          break;
        case "left":
          this.sprite.setAnimation("idle-" + "down");
          // this.direction = "up"
          break;
      }
    } else if(this.angle === 3) {
      switch (this.direction) {
        case "up":
          this.sprite.setAnimation("idle-" + "down");
          // this.direction = "right"
          break;
        case "down":
          this.sprite.setAnimation("idle-" + "up");
          // this.direction = "left"
          break;
        case "right":
          this.sprite.setAnimation("idle-" + "left");
          // this.direction = "down"
          break;
        case "left":
          this.sprite.setAnimation("idle-" + "right");
          // this.direction = "up"
          break;
      }
    } else if(this.angle === 4) {
      switch (this.direction) {
        case "up":
          this.sprite.setAnimation("idle-" + "right");
          // this.direction = "right"
          break;
        case "down":
          this.sprite.setAnimation("idle-" + "left");
          // this.direction = "left"
          break;
        case "right":
          this.sprite.setAnimation("idle-" + "down");
          // this.direction = "down"
          break;
        case "left":
          this.sprite.setAnimation("idle-" + "up");
          // this.direction = "up"
          break;
      }
    }
  }
}
