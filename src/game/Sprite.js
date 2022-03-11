import utils from "./utils.js";
export class Sprite {
  constructor(config) {
    //Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
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
    this.currentAnimation = config.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 8;
    this.animationFrameProgress = this.animationFrameLimit;

    //Reference the game object
    this.gameObject = config.gameObject;

    //컨셉방을 위한 조정 값
    this.xaxios = 0;
    this.xratio = 1;
    this.yaxios = 0;
    this.yratio = 1;
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

  draw(ctx, cameraPerson, roomNum, isPlayer, angle) {
    if (roomNum === 0) {
      const x = this.gameObject.x - 8 + this.xaxios + utils.withGrid(ctx.canvas.clientWidth / 16 / 2) - cameraPerson.x;
      const y = this.gameObject.y - 18 + this.yaxios + utils.withGrid(ctx.canvas.clientHeight / 16 / 2) - cameraPerson.y;

      const [frameX, frameY] = this.frame;
      this.isLoaded && ctx.drawImage(this.image, frameX * 32, frameY * 64, 32, 64, x, y, 32, 64);
    }
    else {
      const gab = this.gameObject.y - cameraPerson.y;
      if (gab < -74.805 && angle === 1) {
        const dif = Math.abs(gab);
        const diff = - dif / 3000 + 1;
        const x = (this.gameObject.x - cameraPerson.x) * (Math.exp(-dif / 1200)) - 8 + this.xaxios + utils.withGrid(ctx.canvas.clientWidth / 16 / 2);
        const y = - 20.5 * Math.pow(Math.abs(gab), 0.3) - 18 + this.yaxios + utils.withGrid(ctx.canvas.clientHeight / 16 / 2);
        const [frameX, frameY] = this.frame;
        this.isLoaded && ctx.drawImage(this.image, frameX * 32, frameY * 64, 32, 64, x, y, 48 * diff, 96 * diff);
      }
      else if (this.gameObject.y >= cameraPerson.y && angle === 3) {
        const dif = Math.abs(gab);
        const diff = - dif / 3000 + 1;
        const x = -(this.gameObject.x - cameraPerson.x) * (Math.exp(-dif / 1200)) - 8 + utils.withGrid(ctx.canvas.clientWidth / 16 / 2);
        const y = - 18.5 * Math.pow(Math.abs(gab), 0.3) - 18 + this.yaxios + utils.withGrid(ctx.canvas.clientHeight / 16 / 2);
        let [frameX, frameY] = this.frame;
        if (!isPlayer) {
          frameX = (frameX + 6) % 12;
        }
        this.isLoaded && ctx.drawImage(this.image, frameX * 32, frameY * 64, 32, 64, x, y - 20, 48 * diff, 96 * diff);
      } else if (angle === 3) {
        const x = this.gameObject.x - 8 + this.xaxios + utils.withGrid(ctx.canvas.clientWidth / 32) - cameraPerson.x;
        const y = - this.gameObject.y - 18 + this.yaxios + utils.withGrid(ctx.canvas.clientHeight / 32) + cameraPerson.y;
        let [frameX, frameY] = this.frame;
        if (!isPlayer) {
          frameX = (frameX + 6) % 12;
        }
        this.isLoaded && ctx.drawImage(this.image, frameX * 32, frameY * 64, 32, 64, x, y, 48, 96);
      } else if (
        // isPlayer || 
        angle === 1) {
        const x = (this.gameObject.x - cameraPerson.x - 8) + this.xaxios + utils.withGrid(ctx.canvas.clientWidth / 32);
        const y = this.gameObject.y - 18 + this.yaxios + utils.withGrid(ctx.canvas.clientHeight / 32) - cameraPerson.y;
        const [frameX, frameY] = this.frame;
        this.isLoaded && ctx.drawImage(this.image, frameX * 32, frameY * 64, 32, 64, x, y, 48, 96);
      } else if (angle === 4) {
        const diff = - Math.abs(this.gameObject.x - cameraPerson.x) / 5000 + 1;
        const x = 0.35 * (this.gameObject.x - cameraPerson.x) + this.xaxios + utils.withGrid(ctx.canvas.clientWidth / 32);
        const y = -(this.gameObject.y - cameraPerson.y) + this.yaxios + utils.withGrid(ctx.canvas.clientHeight / 32);
        let [frameX, frameY] = this.frame;
        if (!isPlayer) {
          frameX = (frameX + 3) % 12;
        }
        this.isLoaded && ctx.drawImage(this.image, frameX * 32, frameY * 64, 32, 64, y, x, 48*diff, 96*diff);
      }
      else if (angle === 2) {
        const diff = - Math.abs(this.gameObject.x - cameraPerson.x) / 5000 + 1;
        const x = -0.35 * (this.gameObject.x - cameraPerson.x) + this.xaxios + utils.withGrid(ctx.canvas.clientWidth / 32);
        const y = this.gameObject.y - cameraPerson.y + this.yaxios + utils.withGrid(ctx.canvas.clientHeight / 32);
        let [frameX, frameY] = this.frame;
        if (!isPlayer) {
          frameX = (frameX + 9) % 12;
        }
        this.isLoaded && ctx.drawImage(this.image, frameX * 32, frameY * 64, 32, 64, y, x, 48, 96);
        // this.isLoaded && ctx.drawImage(this.image, frameX * 32, frameY * 64, 32, 64, y * 0.8, x, 48, 96);
      }
    }



    this.updateAnimationProgress();
  }
}
