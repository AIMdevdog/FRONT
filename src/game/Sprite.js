import utils from "./utils.js";
export class Sprite {
  constructor(config) {
    //Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    //Shadow
    this.shadow = new Image();
    this.useShadow = true; //config.useShadow || false
    if (this.useShadow) {
      this.shadow.src = "/images/characters/shadow.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    };

    //Configure Animation & Initial State
    this.animations = config.animations || {
      "idle-down": [[0, 0]],
      "idle-right": [[9, 0]],
      "idle-up": [[6, 0]],
      "idle-left": [[3, 0]],
      "walk-down": [
        [1, 0],
        [0, 0],
        [2, 0],
        [0, 0],
      ],
      "walk-right": [
        [10, 0],
        [9, 0],
        [11, 0],
        [9, 0],
      ],
      "walk-up": [
        [7, 0],
        [6, 0],
        [8, 0],
        [6, 0],
      ],
      "walk-left": [
        [4, 0],
        [3, 0],
        [5, 0],
        [3, 0],
      ],
    };
    this.currentAnimation = "idle-right"; // config.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 8;
    this.animationFrameProgress = this.animationFrameLimit;

    //Reference the game object
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    //Downtick frame progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    //Reset the counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(ctx, cameraPerson) {
    const x =
      this.gameObject.x -
      8 +
      utils.withGrid(ctx.canvas.clientWidth / 16 / 2) -
      cameraPerson.x;
    const y =
      this.gameObject.y -
      18 +
      utils.withGrid(ctx.canvas.clientHeight / 16 / 2) -
      cameraPerson.y;

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    const [frameX, frameY] = this.frame;

    this.isLoaded &&
      // ctx.drawImage(this.image, frameX * 32, frameY * 32, 32, 32, x, y, 32, 32);
      ctx.drawImage(this.image, frameX * 32, frameY * 64, 32, 64, x, y, 32, 64);

    this.updateAnimationProgress();
  }
}
