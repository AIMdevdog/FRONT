import { OverworldMap } from "./OverworldMap.js";
import { KeyPressListener } from "./KeyPressListener.js";
import { DirectionInput } from "./DirectionInput.js";
import { Person } from "./Person.js";
import io from 'socket.io-client';

const socket = io("localhost:4001");
const characters = [];
const charMap = {};


socket.on("join_user", function (data) {
  joinUser(data.id, data.x, data.y);
});

socket.on("leave_user", function (data) {
  leaveUser(data);
});

socket.on("update_state", function(data){
  console.log(data);
  updateLocation(data);
})

function updateLocation(data){
  let char;
  for(let i=0; i<characters.length; i++){
    char = charMap[data[i].id];
    if(char.id === socket.id){
      continue;
    }


    // console.log(data[i]);
    char.id = data[i].id;
    char.nextDirection.unshift(data[i].direction);
    char.x = data[i].x;
    char.y = data[i].y;
  }
}

function leaveUser(id){
  for (let i = 0; i < characters.length; ++i) {
    if (characters[i].id === id) {
        characters.splice(i, 1);
        break;
    }
}
delete charMap[id];
}

function joinUser(id, x, y) {
  let character = new Person({
    x: 0,
    y: 0,
    src: "/images/characters/people/avatar-dQCYs4n7O99ksXuBIe33-UzbB5TTbkmeLg7hfrUii-yFpcQh7UcvdChVN8WvIW-Qjhn5Biz0wHk7Jh0Lg0w-CgjGnJ2FTTfWiE3tf7Uj-09g8XhwETZ7wAhFTUs4s.png",
    id: id,
  });
  character.id = id;
  character.x = x;
  character.y = y;
  characters.push(character);
  charMap[id] = character;
  return character;
}



export class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }

  startGameLoop() {
    const step = () => {
      //Clear off the canvas
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      console.log(charMap);

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Establish the camera person
      const cameraPerson = charMap[socket.id] || this.map.gameObjects.hero;

      //Update all objects
      // console.log(this.directionInput.direction);
      Object.values(charMap).forEach((object) => {
        // console.log(object.id);
        // console.log(socket.id);
        if (object.id === socket.id) {
          object.update({
            arrow: this.directionInput.direction,
            map: this.map,
            // id: socket.id,
          });
        } else {
          object.update({
            arrow: object.nextDirection.shift(),
            map: this.map,
            // id: socket.id,
          });
        }
      });

      //Draw Lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);

      //Draw Game Objects
      Object.values(charMap)
        .sort((a, b) => {
          return a.y - b.y;
        })
        .forEach((object) => {
          object.sprite.draw(this.ctx, cameraPerson);
        });

      const player = charMap[socket.id];
      if (player) {
        const data = {
          id: socket.id,
          x: player.x,
          y: player.y,
          direction: this.directionInput.direction,
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

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      // Is there a person here to talk to?
      this.map.checkForActionCutscene();
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", (e) => {
      if (e.detail.whoId === "hero") {
        // Hero's position has changed
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startMap(mapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
  }

  init() {
    // const socket = io("localhost:3000");

    this.startMap(window.OverworldMaps.TestingRoom);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
  }
}
