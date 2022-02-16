import { OverworldMap } from "./OverworldMap.js";
import { DirectionInput } from "./DirectionInput.js";
import { Person } from "./Person.js";
import utils from "./utils.js";
import io from "socket.io-client";
import _const from "../config/const.js";

let myStream;
let pcObj = {
  // remoteSocketId: pc
};

let peopleInRoom = 1;

const characters = [];
const charMap = {};

const Overworld = (data) => {
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
  const adjustValue = data.adjust;
  const otherMaps = data.otherMaps;
  const directionInput = new DirectionInput();
  directionInput.init();
  let closer = [];
  
  // data 안에 소켓id, nickname 있음
  // data for문 돌면서 isUserCalling checking 혹은..
  // [PASS] 2명+3명 그룹 합쳐질 때 그룹 통화중이라는 것을 표시해둬야 함 / 변수 하나 더 추가 true, false 체크

  function sortStreams() {
    const streams = document.querySelector("#streams");
    const streamArr = streams.querySelectorAll("div");
    streamArr.forEach((stream) => (stream.className = `people${peopleInRoom}`));
  }

  function handleAddStream(event, remoteSocketId, remoteNickname) {
    const peerStream = event.stream;
    console.log(peerStream);
    const user = charMap[remoteSocketId] // person.js에 있는 거랑 같이
    if (!user.isUserJoin) { // 유저가 어떤 그룹에도 속하지 않을 때 영상을 키겠다
      user.isUserJoin = true;
    paintPeerFace(peerStream, remoteSocketId, remoteNickname);
    }
  }

  // 영상 connect
  function paintPeerFace(peerStream, id, remoteNickname) {
    const streams = document.querySelector("#streams");
    const div = document.createElement("div");
    // div.classList.add("userVideoContainer");
    div.id = id;
    const video = document.createElement("video");
    video.className = "userVideo";
    video.autoplay = true;
    video.playsInline = true;
    video.srcObject = peerStream;
    div.appendChild(video);
    streams.appendChild(div);
    sortStreams();
  }

  // 영상 disconnect
  function removePeerFace(id) {
    const streams = document.querySelector("#streams");
    const streamArr = streams.querySelectorAll("div");
    console.log("총 길이 " , streamArr.length);
    streamArr.forEach((streamElement) => {
      console.log(streamArr, streamElement.id, id);
      if (streamElement.id === id) {
        streams.removeChild(streamElement);

      }
    });
    console.log(streams);
  }

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
      handleIce(event, remoteSocketId);
      console.log("+------Ice------+");
    });
    myPeerConnection.addEventListener("addstream", (event) => {
      handleAddStream(event, remoteSocketId, remoteNickname);
      console.log("+------addstream------+");
    });

    console.log("+------before getTracks------+");
    myStream
      .getTracks()
      .forEach((track) => myPeerConnection.addTrack(track, myStream));
    console.log("+------getTracks------+", myStream);

    pcObj[remoteSocketId] = myPeerConnection;

    ++peopleInRoom;
    sortStreams();
    return myPeerConnection;
  }

  function handleIce(event, remoteSocketId) {
    if (event.candidate) {
      socket.emit("ice", event.candidate, remoteSocketId);
    }
  }

  async function getMedia() {
    const myFace = document.querySelector("#myFace");

    try {
      myStream = await navigator.mediaDevices.getUserMedia(cameraConstraints);
      console.log("mystream", myStream);
      // stream을 mute하는 것이 아니라 HTML video element를 mute한다.
      myFace.srcObject = myStream;
    } catch (error) {
      console.log(error);
    }
  }

  async function initCall() {
    // welcome.hidden = true;            // HTML 관련 코드
    // call.classList.remove(HIDDEN_CN); // HTML 관련 코드
    console.log("initCall 함수");
    await getMedia(); // Room.js에 들어있음
  }
  
  // chat form
  
  const chatForm = document.querySelector("#chatForm");
  const chatBox = document.querySelector("#chatBox");
  
  const MYCHAT_CN = "myChat";
  const NOTICE_CN = "noticeChat";
  
  chatForm.addEventListener("submit", handleChatSubmit);

  function handleChatSubmit(event) {
    event.preventDefault();
    const chatInput = chatForm.querySelector("input");
    const message = chatInput.value;
    chatInput.value = "";

    let nickname = "Anon";
    let groupName = 1;

    socket.emit("chat", `${nickname}: ${message}`, groupName);
    writeChat(`You: ${message}`, MYCHAT_CN);
  }

  function writeChat(message, className = null) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.innerText = message;
    li.appendChild(span);
    li.classList.add(className);
    chatBox.prepend(li);
  }

  // 남는 사람 기준
  socket.on("leave_succ", function(data){
    removePeerFace(data.removeSid);
  })

  socket.on("chat", (message) => {
    writeChat(message);
  });

  socket.on("accept_join", async (userObjArr) => {
    await initCall();

    const length = userObjArr.length;
    if (length === 1) {
      return;
    }

    for (let i = 0; i < length - 1; ++i) {
      try {
        const newPC = createConnection(
          userObjArr[i].socketId,
          userObjArr[i].nickname
        );
        const offer = await newPC.createOffer();
        await newPC.setLocalDescription(offer);
        socket.emit(
          "offer",
          offer,
          userObjArr[i].socketId,
          userObjArr[i].nickname
        );
      } catch (err) {
        console.error(err);
      }
    }
    // writeChat("is in the room.", NOTICE_CN);
  });

  socket.on("offer", async (offer, remoteSocketId, remoteNickname) => {
    try {
      const newPC = createConnection(remoteSocketId, remoteNickname);
      await newPC.setRemoteDescription(offer);
      const answer = await newPC.createAnswer();
      await newPC.setLocalDescription(answer);
      socket.emit("answer", answer, remoteSocketId);
      // writeChat(`notice! __${remoteNickname}__ joined the room`, NOTICE_CN);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("answer", async (answer, remoteSocketId) => {
    await pcObj[remoteSocketId].setRemoteDescription(answer);
  });

  socket.on("ice", async (ice, remoteSocketId) => {
    await pcObj[remoteSocketId].addIceCandidate(ice);
  });

  socket.on("join_user", function (data) {
    //====================  비디오 추가 함수 =================//
    console.log("새로운 유저 접속");
    // paintPeerFace(cameraConstraints)

    // console.log(socket.id);
    // console.log(map.gameObjects.player.sprite.image.src);
    socket.emit("send_user_src", {
      id: socket.id,
      src: map.gameObjects.player.sprite.image.src,
    });
    joinUser(data.id, data.x, data.y);
  });

  socket.on("user_src", function (data) {
    const User = charMap[data.id];
    // console.log(User.sprite.image.src);
    User.sprite.image.src = data.src;
    // Object.values(charMap).forEach((object) => {
    //   object.sprite.image.src = data.src;
  });

  // });
  socket.on("leave_user", function () {
    leaveUser(data);
  });
  
  socket.on("update_state", function (data) {
    // console.log(data);
    updateLocation(data);
  });

  const startGameLoop = () => {
    const step = () => {
      //Clear off the canvas
      if (map.roomNum !== 1) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = 100;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //Establish the camera person
      const cameraPerson = charMap[socket.id] || map.gameObjects.player;
      const player = charMap[socket.id];
      // console.log(player);
      //Update all objects
      // console.log(charMap);
      Object.values(charMap).forEach((object) => {
        if (object.id === socket.id) {
          // console.log(object.sprite.image.src);
          for (let i = 0; i < otherMaps.length; i++) {
            if (object.x === otherMaps[i].x && object.y === otherMaps[i].y) {
              console.log("warp!!!");
              // console.log(object.sprite.image.src);
              window.location.replace(
                `${otherMaps[i].url}?src=${object.sprite.image.src}`
              );
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
          if (
            !object.isUserCalling &&
            Math.abs(player.x - object.x) < 64 &&
            Math.abs(player.y - object.y) < 96
          ) {
            //화상 통화 연결
            closer.push(object.id);
            console.log("가까워짐");
            player.isUserCalling = true;
            object.isUserCalling = true;
            socket.emit("user_call", {
              caller: player.id,
              callee: object.id,
            });
          }
            if (object.isUserCalling && (Math.abs(player.x - object.x) > 96 || Math.abs(player.y - object.y) > 128)) {
              console.log("멀어짐")
              closer = closer.filter((element) => element !== object.id);
              // console.log(socket)
              object.isUserCalling = false;
              // console.log(player, object);
              // socket.emit("disconnected");
              
            }
          }
        });
        const playercheck = player ? player.isUserCalling : false;
        if (playercheck && closer.length === 0) { // 나가는 사람 기준
          const stream = document.querySelector("#streams");
          while(stream.hasChildNodes()){ // 내가 가지고있는 다른 사람의 영상을 전부 삭제
            stream.removeChild(stream.firstChild)
          }
          socket.emit("leave_Group", player.id); 
          player.isUserCalling = false; 
        }
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

  const joinUser = (id, x, y) => {
    let character = new Person({
      x: 0,
      y: 0,
      id: id,
    });
    character.id = id;
    character.x = x;
    character.y = y;
    character.sprite.xaxios = adjustValue.xaxios;
    character.sprite.yaxios = adjustValue.yaxios;
    character.sprite.yratio = adjustValue.yratio;
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

export default Overworld;
