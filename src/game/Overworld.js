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





export const Overworld = (data) => {
  const config = data.config;
  const element = config;
  const canvas = element.querySelector(".game-canvas")
  const ctx = canvas.getContext("2d");

  const map = new OverworldMap(data.Room);
  const otherMaps = data.otherMaps;
  const directionInput = new DirectionInput();
  directionInput.init();
  const socket = io("localhost:4001");
  // const wssocket = io("localhost:8000");

  

  const startTest = () => {
    socket.emit("join_room", 1, 2);
  }
  startTest();



  socket.on("join_user", function (data) {

    // console.log(socket.id);
    // console.log("join_serrrrr")
    // console.log(map.gameObjects.player.sprite.image.src);
    socket.emit("send_user_src", {
      id: socket.id,
      src: map.gameObjects.player.sprite.image.src,
    })
    joinUser(data.id, data.x, data.y);

  });
  socket.on("user_src", function (data) {
    // console.log("user_srcccccccc")
    const User = charMap[data.id];
    // console.log(User.sprite.image.src);
    User.sprite.image.src = data.src;
    // Object.values(charMap).forEach((object) => {
    //   object.sprite.image.src = data.src;
    // });
  })

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
      const cameraPerson = charMap[socket.id] || map.gameObjects.player;
      const player = charMap[socket.id];
      //Update all objects
      // console.log(charMap);
      Object.values(charMap).forEach((object) => {
        if (object.id === socket.id) {
          for (let i = 0; i < otherMaps.length; i++) {
            if (object.x === otherMaps[i].x && object.y === otherMaps[i].y) {
              console.log("warp!!!");
              window.location.replace(otherMaps[i].url);
            }
          }
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
          if (Math.abs(player.x - object.x) < 64 && Math.abs(player.y - object.y) < 96) {
            //화상 통화 연결
            socket.emit("user_call", {
              caller: player.id,
              callee: object.id,
            })
            // console.log("가까워짐")
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
  // //     if (e.detail.whoId === "player") {
  // //       // Hero's position has changed
  // //       this.map.checkForFootstepCutscene();
  // //     }
  // //   });
  // // }

  // // this.bindActionInput();
  // // this.bindHeroPositionCheck();



  startGameLoop();
}
