import { OverworldMap } from "./OverworldMap.js";
import { DirectionInput } from "./DirectionInput.js";
import { Person } from "./Person.js";
import utils from "./utils.js";
import io from 'socket.io-client';



const characters = [];
const charMap = {};


// socket.on("join_user", function (data) {
//   joinUser(data.id, data.x, data.y);
// });

// socket.on("leave_user", function (data) {
//   leaveUser(data);
// });

// socket.on("update_state", function (data) {
//   updateLocation(data);
// })





export const Overworld = (config) => {
  const element = config;
  const canvas = element.querySelector(".game-canvas")
  const ctx = canvas.getContext("2d");

  const map = new OverworldMap({
      lowerSrc: "https://aim-image-storage.s3.ap-northeast-2.amazonaws.com/map2.png",
      upperSrc: "/images/maps/KitchenUpper.png",
      id: 123,
      gameObjects: {
        hero: new Person({
          id: null,
          isPlayerControlled: true,
          x: utils.withGrid(5),
          y: utils.withGrid(5),
          src: "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-MPN2TapcbBVMdbCP0jR6.png"
        }),
      },
  });
  //   map.overworld = this;
  //   map.mountObjects();
  const directionInput = new DirectionInput();
  directionInput.init();
  const socket = io("localhost:4001");


  socket.on("join_user", function (data) {
    socket.emit("send_user_src", {
      src: map.gameObjects.hero.sprite.image.src,
    })
    joinUser(data.id, data.x, data.y);
    socket.on("user_src", function (data){
      Object.values(charMap).forEach((object) => {
          object.sprite.image.src = data.src;
        });
    })

  });

  socket.on("leave_user", function (data) {
    leaveUser(data);
  });

  socket.on("update_state", function (data) {
    // console.log(data);
    updateLocation(data);
  })

  const startGameLoop = () => {
    const step = () => {
      //Clear off the canvas
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //Establish the camera person
      const cameraPerson = charMap[socket.id] || map.gameObjects.hero;
      const player = charMap[socket.id];
      //Update all objects
      Object.values(charMap).forEach((object) => {
        if (object.id === socket.id) {
          object.update({
            arrow: directionInput.direction,
            map: map,
            // id: socket.id,
          });
        } else {
          object.update({
            arrow: object.nextDirection.shift(),
            map: map,
            // id: socket.id,
          });
          if(Math.abs(player.x -object.x) < 64 && Math.abs(player.y - object.y) < 96){
            socket.emit("close",function(data){

            })
          }
        }
      });


      //Draw Lower layer
      map.drawLowerImage(ctx, cameraPerson);

      //Draw Game Objects
      Object.values(charMap)
        .sort((a, b) => {
          return a.y - b.y;
        })
        .forEach((object) => {
          object.sprite.draw(ctx, cameraPerson);
        });


      if (player) {
        const data = {
          id: socket.id,
          x: player.x,
          y: player.y,
          direction: directionInput.direction,
        }
        socket.emit('input', data)
      }

      //Draw Upper layer
      // this.map.drawUpperImage(this.ctx, cameraPerson);

      requestAnimationFrame(() => {
        step();
      });
    };
    step();
  }
  const updateLocation = (data) => {
    let char;
    for (let i = 0; i < characters.length; i++) {
      char = charMap[data[i].id];
      if (char.id === socket.id) {
        continue;
      }

      char.nextDirection.unshift(data[i].direction);
      char.x = data[i].x;
      char.y = data[i].y;
    }
  }

  const leaveUser = (id) => {
    for (let i = 0; i < characters.length; ++i) {
      if (characters[i].id === id) {
        characters.splice(i, 1);
        break;
      }
    }
    delete charMap[id];
  }

  const joinUser = (id, x, y, src) => {
    let character = new Person({
      x: 0,
      y: 0,
      id: id,
      src: src,
    });
    character.id = id;
    character.x = x;
    character.y = y;
    characters.push(character);
    charMap[id] = character;
    return character;
  };


  // // bindActionInput() {
  // //   new KeyPressListener("Enter", () => {
  // //     // Is there a person here to talk to?
  // //     this.map.checkForActionCutscene();
  // //   });
  // // }

  // // bindHeroPositionCheck() {
  // //   document.addEventListener("PersonWalkingComplete", (e) => {
  // //     if (e.detail.whoId === "hero") {
  // //       // Hero's position has changed
  // //       this.map.checkForFootstepCutscene();
  // //     }
  // //   });
  // // }

  // // this.bindActionInput();
  // // this.bindHeroPositionCheck();



  startGameLoop();
}
