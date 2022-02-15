import { OverworldMap } from "./OverworldMap.js";
import { DirectionInput } from "./DirectionInput.js";
import { Person } from "./Person.js";
// import utils from "./utils.js";
import io from 'socket.io-client';
import _const from "../config/const.js";

let myStream;
let pcObj = {
  // remoteSocketId: pc
};

let peopleInRoom = 1;

const characters = [];
const charMap = {};

function sortStreams() {
  const streams = document.querySelector("#streams");
  const streamArr = streams.querySelectorAll("div");
  streamArr.forEach((stream) => (stream.className = `people${peopleInRoom}`));
}

function handleAddStream(event, remoteSocketId, remoteNickname) {

  console.log(event);
  const peerStream = event.stream;
  console.log(peerStream);
  console.log("handleAddstream실행");
  paintPeerFace(peerStream, remoteSocketId, remoteNickname);
}

function paintPeerFace(peerStream, id, remoteNickname) {
  const streams = document.querySelector("#streams");
  const div = document.createElement("div");
  div.id = id;
  const video = document.createElement("video");
  video.autoplay = true;
  video.playsInline = true;
  video.width = "200";
  video.height = "100";
  video.srcObject = peerStream;
  div.appendChild(video);
  streams.appendChild(div);
  sortStreams();
}


export const Overworld = (data) => {
  const config = data.config;
  const element = config;
  const canvas = element.querySelector(".game-canvas");
  const ctx = canvas.getContext("2d");
  const socket = io(_const.HOST);
  const cameraConstraints = {
    audio: true,
    video: true,
  };

  const map = new OverworldMap(data.Room);
  const otherMaps = data.otherMaps;
  const directionInput = new DirectionInput();
  directionInput.init();
  // const socket = io("localhost:4001");
  // const wssocket = io("localhost:8000");

  // const startTest = () => {

  // }
  // startTest();

  function handleIce(event, remoteSocketId) {
    if (event.candidate) {
      socket.emit("ice", event.candidate, remoteSocketId);
    }
  }

  const getMedia = async () =>  {
    console.log("getMedia함수");
    const myFace = document.querySelector("#myFace");
    
    try {
      myStream = await navigator.mediaDevices.getUserMedia(cameraConstraints);
      // console.log(myStream)
      // stream을 mute하는 것이 아니라 HTML video element를 mute한다.
      myFace.srcObject = myStream;
      // myFace.muted = true;
  
      } catch (error) {
        console.log(error);
      }
    }
  
    // getMedia();
    // paintPeerFace();
  
    
  async function initCall() {
    // welcome.hidden = true;            // HTML 관련 코드
    // call.classList.remove(HIDDEN_CN); // HTML 관련 코드
    console.log("initCall 함수");
    await getMedia(); // Room.js에 들어있음
  }


  // data 안에 소켓id, nickname 있음 
  // data for문 돌면서 isUserCalling checking 혹은..
  // [PASS] 2명+3명 그룹 합쳐질 때 그룹 통화중이라는 것을 표시해둬야 함 / 변수 하나 더 추가 true, false 체크
    
  socket.on("accept_join", async (userObjArr) => {
    console.log("accept join 실행");
    console.log(userObjArr);
    await initCall();
  
    const length = userObjArr.length;
    if (length === 1) {
      console.log("한명이라 offer안함");
      return;
    }
  
    // writeChat("Notice!", NOTICE_CN);
    for (let i = 0; i < length - 1; ++i) {
      try {
        console.log(userObjArr[i].socketId,userObjArr[i].nickname);
        const newPC = createConnection(
          userObjArr[i].socketId,
          userObjArr[i].nickname
        );
        const offer = await newPC.createOffer();
        await newPC.setLocalDescription(offer);
        socket.emit("offer", offer, userObjArr[i].socketId, userObjArr[i].nickname);
        // writeChat(`__${userObjArr[i].nickname}__`, NOTICE_CN);
      } catch (err) {
        console.error(err);
      }
    }
    // writeChat("is in the room.", NOTICE_CN);
  });

  socket.on("offer", async (offer, remoteSocketId, remoteNickname) => {
    try {
      console.log("received the offer");
      const newPC = createConnection(remoteSocketId, remoteNickname);
      await newPC.setRemoteDescription(offer);
      const answer = await newPC.createAnswer();
      await newPC.setLocalDescription(answer);
      socket.emit("answer", answer, remoteSocketId);
      console.log("sent the answer");
      // writeChat(`notice! __${remoteNickname}__ joined the room`, NOTICE_CN);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("answer", async (answer, remoteSocketId) => {
    console.log("received the answer");
    await pcObj[remoteSocketId].setRemoteDescription(answer);
  });

  socket.on("ice", async (ice, remoteSocketId) => {
    console.log("received candidate");
    await pcObj[remoteSocketId].addIceCandidate(ice);
  });

  socket.on("join_user", function (data) {
    //====================  비디오 추가 함수 =================//
    console.log("새로운 유저 접속")
    // paintPeerFace(cameraConstraints)

    // console.log(socket.id);
    // console.log("join_serrrrr")
    // console.log(map.gameObjects.player.sprite.image.src);
    socket.emit("send_user_src", {
      id: socket.id,
      src: map.gameObjects.player.sprite.image.src,
    });
    joinUser(data.id, data.x, data.y);
  });

  socket.on("user_src", function (data) {
    // console.log("user_srcccccccc")
    const User = charMap[data.id];
    // console.log(User.sprite.image.src);
    User.sprite.image.src = data.src;
    // Object.values(charMap).forEach((object) => {
    //   object.sprite.image.src = data.src;
  });
  
  // });
  socket.on("leave_user", function (data) {
    leaveUser(data);
  });

  socket.on("update_state", function (data) {
    // console.log(data);
    updateLocation(data);
  });

  function createConnection(remoteSocketId, remoteNickname) {
    const myPeerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
          ],
        },
      ],
    });
    myPeerConnection.addEventListener("icecandidate", (event) => {
      console.log("icecheck")
      handleIce(event, remoteSocketId);
    });
    myPeerConnection.addEventListener("addstream", (event) => {
      console.log("addstream이 돼야지");
      handleAddStream(event, remoteSocketId, remoteNickname);
    });
    myStream 
      .getTracks()
      .forEach((track) => myPeerConnection.addTrack(track, myStream));
    
    pcObj[remoteSocketId] = myPeerConnection;
  
    ++peopleInRoom;
    sortStreams();
    return myPeerConnection;
  }
  
  console.log(pcObj);

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
          if (!object.isUserCalling && Math.abs(player.x - object.x) < 64 && Math.abs(player.y - object.y) < 96) {
            //화상 통화 연결
            player.isUserCalling = true;
            object.isUserCalling = true;
            socket.emit("user_call", {
              caller: player.id,
              callee: object.id,
            });
            // console.log("가까워짐")
            // socket.emit("makegroup", {
            //     caller: player.id,
            //     callee: object.id,
            //   });
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
        };
        socket.emit("input", data);
      }

      //Draw Upper layer
      // this.map.drawUpperImage(this.ctx, cameraPerson);

      requestAnimationFrame(() => {
        step();
      });
    };
    step();
  };
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
  };

  const leaveUser = (id) => {
    for (let i = 0; i < characters.length; ++i) {
      if (characters[i].id === id) {
        characters.splice(i, 1);
        break;
      }
    }
    delete charMap[id];
  };

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
};
