import { OverworldMap } from "./OverworldMap.js";
import { DirectionInput } from "./DirectionInput.js";
import { Person } from "./Person.js";
import utils from "./utils.js";
import io from "socket.io-client";
import _const from "../config/const.js";

let myStream;
let cameraOff = false;
let muted = true;
let pcObj = {
  // remoteSocketId: pc (peer connection)
  // pcObj[remoteSocketId] = myPeerConnection 이다
};

let peopleInRoom = 1;

const characters = [];
const charMap = {};

const Overworld3 = (data) => {
  const config = data.config;
  const nickname = data.nickname;
  const element = config;
  const canvas = element.querySelector(".game-canvas");
  const ctx = canvas.getContext("2d");
  const cameraConstraints = {
    audio: true,
    video: true,
  };

  const map = new OverworldMap(data.Room);
  const adjustValue = data.adjust;
  const otherMaps = data.otherMaps;
  const directionInput = new DirectionInput();
  directionInput.init();
  let roomId = "room" + map.roomId
  let prevAngle = 1;
  let rotationAngle = 1;


  const socket = io(_const.HOST);
  let closer = [];




  const cameraRotate = (e) => {
    switch (e.key) {
      case "e" || "E" || "ㄷ":
        rotationAngle += 1;
        if (rotationAngle > 4) {
          rotationAngle = 1;
        }
        characterRotate(rotationAngle);
        break;
      case "q" || "Q" || "ㅂ":
        rotationAngle -= 1;
        if (rotationAngle < 1) {
          rotationAngle = 4;
        }
        characterRotate(rotationAngle);
        break;
    }
  };

  const characterRotate = (angle) => {
    const player = charMap[socket.id];
    switch (angle) {
      case 1:
        player.angle = 1;
        directionInput.heldDirections = [];
        directionInput.map = {
          ArrowUp: "up",
          ArrowDown: "down",
          ArrowLeft: "left",
          ArrowRight: "right",
        };
        if(prevAngle === 4){
          player.x -= 320;
          player.y += 384;
        }else if(prevAngle === 2){
          player.x += 192;
          player.y += 384;
        }
        prevAngle = angle;
        break;
      case 2:
        player.angle = 2;
        directionInput.heldDirections = [];
        directionInput.map = {
          ArrowUp: "right",
          ArrowDown: "left",
          ArrowLeft: "up",
          ArrowRight: "down",
        };
        if(prevAngle === 1){
          player.x -= 192;
          player.y -= 384;
        }else if(prevAngle === 3){
          player.x -= 266;
          player.y += 384;
        }
        prevAngle = angle;
        break;
      case 3:
        player.angle = 3;
        directionInput.heldDirections = [];
        directionInput.map = {
          ArrowUp: "down",
          ArrowDown: "up",
          ArrowLeft: "right",
          ArrowRight: "left",
        };
        if(prevAngle === 2){
          player.x += 266;
          player.y -= 384;
        }else if(prevAngle === 4){
          player.x -= 246;
          player.y -= 384;
        }
        prevAngle = angle;
        break;
      case 4:
        player.angle = 4;
        directionInput.heldDirections = [];
        directionInput.map = {
          ArrowUp: "left",
          ArrowDown: "right",
          ArrowLeft: "down",
          ArrowRight: "up",
        };
        if(prevAngle === 3){
          player.x += 246;
          player.y += 384;
        }else if(prevAngle === 1){
          player.x += 320;
          player.y -= 384;
        }
        prevAngle = angle;
        break;
    }
  }


  document.addEventListener("keydown", cameraRotate);


  async function handleAddStream(event, remoteSocketId, remoteNickname) {
    const peerStream = event.stream;
    console.log(peerStream);
    const user = charMap[remoteSocketId]; // person.js에 있는 거랑 같이

    if (!user.isUserJoin) {
      // 유저가 어떤 그룹에도 속하지 않을 때 영상을 키겠다
      user.isUserJoin = true;
      try {
        await paintPeerFace(peerStream, remoteSocketId, remoteNickname);
      } catch (err) {
        console.error(err);
      }
    }
  }

  // 영상 connect
  async function paintPeerFace(peerStream, id, remoteNickname) {
    const streams = document.querySelector("#streams");
    const div = document.createElement("div");
    // div.classList.add("userVideoContainer");
    div.id = id;

    // console.log("-------- 커넥션 상태 --------", pcObj[id].iceConnectionState);

    try {
      const video = document.createElement("video");
      video.className = "userVideo";
      video.autoplay = true;
      video.playsInline = true;
      video.srcObject = peerStream;
      div.appendChild(video);
      streams.appendChild(div);
      // await sortStreams();
    } catch (err) {
      console.error(err);
    }
  }

  // 영상 disconnect
  function removePeerFace(id) {
    const streams = document.querySelector("#streams");
    const streamArr = streams.querySelectorAll("div");
    // console.log("총 길이 " , streamArr.length);
    streamArr.forEach((streamElement) => {
      console.log(streamArr, streamElement.id, id);
      if (streamElement.id === id) {
        streams.removeChild(streamElement);
      }
    });
    // console.log(streams);
  }

  async function createConnection(remoteSocketId, remoteNickname) {
    try {
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
      myPeerConnection.addEventListener("icecandidate", async (event) => {
        try {
          await handleIce(event, remoteSocketId, remoteNickname);
        } catch (e) {
          console.log(e);
        }
        console.log("+------Ice------+");
      });
      myPeerConnection.addEventListener("addstream", async (event) => {
        try {
          await handleAddStream(event, remoteSocketId, remoteNickname);
        } catch (err) {
          console.error(err);
        }
        console.log("+------addstream------+");
      });

      console.log("+------before getTracks------+");
      myStream
        .getTracks()
        .forEach((track) => myPeerConnection.addTrack(track, myStream));
      console.log("+------getTracks------+", myStream);

      pcObj[remoteSocketId] = myPeerConnection;

      ++peopleInRoom;
      // sortStreams();
      return myPeerConnection;
    } catch (e) {
      console.log(e);
    }
  }

  function handleIce(event, remoteSocketId, remoteNickname) {
    if (event.candidate) {
      socket.emit("ice", event.candidate, remoteSocketId, remoteNickname);
    }
  }

  function handleMuteClick() {
    myStream //
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    if (muted) {
      muteBtn.innerText = 'Unmute';
      //   unMuteIcon.classList.remove(HIDDEN_CN);
      //   muteIcon.classList.add(HIDDEN_CN);
      muted = false;
    } else {
      muteBtn.innerText = 'Mute';
      //   muteIcon.classList.remove(HIDDEN_CN);
      //   unMuteIcon.classList.add(HIDDEN_CN);
      muted = true;
    }
  }

  function handleCameraClick() {
    myStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    if (cameraOff) {
      // cameraIcon.classList.remove(HIDDEN_CN);
      // unCameraIcon.classList.add(HIDDEN_CN);
      cameraBtn.innerText = 'camera on';
      cameraOff = false;
    } else {
      cameraBtn.innerText = 'camera off';
      cameraOff = true;
    }
  }

  const muteBtn = document.querySelector("#playerMute");
  const cameraBtn = document.querySelector("#playerCamera");
  muteBtn.addEventListener("click", handleMuteClick);
  cameraBtn.addEventListener("click", handleCameraClick);


  async function getMedia() {
    const myFace = document.querySelector("#myFace");
    const camBtn = document.querySelector("#camBtn");
    camBtn.style.display = "block";

    try {
      myStream = await navigator.mediaDevices.getUserMedia(cameraConstraints);
      console.log("mystream", myStream);
      // stream을 mute하는 것이 아니라 HTML video element를 mute한다.
      myFace.srcObject = myStream;
      myFace.muted = true;

      myStream // mute default
        .getAudioTracks()
        .forEach((track) => (track.enabled = false));

    } catch (err) {
      console.log(err);
    }
  }

  async function initCall() {
    // welcome.hidden = true;            // HTML 관련 코드
    // call.classList.remove(HIDDEN_CN); // HTML 관련 코드
    console.log("initCall 함수");
    try {
      await getMedia(); // Room.js에 들어있음
    } catch (err) {
      console.log(err);
    }
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
    li.classList.add("message-list");
    chatBox.appendChild(li);
  }

  // 남는 사람 기준
  socket.on("leave_succ", function (data) {
    const user = charMap[data.removeSid];
    user.isUserJoin = false;
    removePeerFace(data.removeSid);
  });

  socket.on("chat", (message) => {
    writeChat(message);
  });

  socket.on("accept_join", async (userObjArr) => {
    try {
      await initCall();

      const length = userObjArr.length;
      if (length === 1) {
        return;
      }

      for (let i = 0; i < length - 1; ++i) {
        const newPC = await createConnection(
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
      }
    } catch (err) {
      console.error(err);
    }
    // writeChat("is in the room.", NOTICE_CN);
  });

  socket.on("offer", async (offer, remoteSocketId, remoteNickname) => {
    try {
      const newPC = await createConnection(remoteSocketId, remoteNickname);
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

  socket.on("ice", async (ice, remoteSocketId, remoteNickname) => {
    await pcObj[remoteSocketId].addIceCandidate(ice);
    const state = pcObj[remoteSocketId].iceConnectionState;
    if (state === "failed" || state === "closed") {
      const newPC = await createConnection(
        remoteSocketId,
        remoteNickname
      );
      const offer = await newPC.createOffer();
      await newPC.setLocalDescription(offer);
      socket.emit("offer", offer, remoteSocketId, remoteNickname);
      console.log("iceCandidate 실패! 재연결 시도");
    }
  });

  socket.on("join_user", function (data) {
    //====================  비디오 추가 함수 =================//
    console.log("새로운 유저 접속");

    socket.emit("send_user_info", {
      src: map.gameObjects.player.sprite.image.src,
      x: map.gameObjects.player.x,
      y: map.gameObjects.player.y,
      nickname: nickname,
      roomId,
    });

  });

  socket.on("get_user_info", function (data) {
    joinUser(data.id, data.x, data.y, data.nickname, data.src);
  });

  socket.on("leave_user", function (data) {
    leaveUser(data);
  });

  socket.on("update_state", function (data) {
    updateLocation(data);
  });

  const startGameLoop = () => {
    const step = () => {
      //Clear off the canvas
      canvas.width = 70;
      canvas.height = 80;
      data.mainContainer.style.height = window.innerHeight + "px";

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //Establish the camera person
      const cameraPerson = charMap[socket.id] || map.gameObjects.player;
      const player = charMap[socket.id];

      if (data.setCameraPosition) {
        data.setYCameraPosition(-cameraPerson.y / 80 - 3.5);
        data.setCameraPosition(-cameraPerson.x / 80 + 6);

      }

      //Update all objects
      Object.values(charMap).forEach((object) => {
        if (object.id === socket.id) {
          // console.log(object.sprite.image.src);
          for (let i = 0; i < otherMaps.length; i++) {
            if (object.x === otherMaps[i].x && object.y === otherMaps[i].y) {
              console.log("warp!!!");
              // console.log(object.sprite.image.src);
              window.location.replace(
                `${otherMaps[i].url}`
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
            Math.abs(player?.x - object.x) < 64 &&
            Math.abs(player?.y - object.y) < 96
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
          if (
            object.isUserCalling &&
            (Math.abs(player.x - object.x) > 96 ||
              Math.abs(player.y - object.y) > 128)
          ) {
            console.log("멀어짐");
            closer = closer.filter((element) => element !== object.id);
            // console.log(socket)
            object.isUserCalling = false;
            object.isUserJoin = false;
            // console.log(player, object);
            // socket.emit("disconnected");
          }
        }
      });
      const playercheck = player ? player.isUserCalling : false;
      if (playercheck && closer.length === 0) {
        // 나가는 사람 기준
        const stream = document.querySelector("#streams");
        while (stream.hasChildNodes()) {
          // 내가 가지고있는 다른 사람의 영상을 전부 삭제
          stream.removeChild(stream.firstChild);
        }

        // for (let remoteSocketId in pcObj){
        //   // console.log("-------- 커넥션 상태 --------", pcObj[remoteSocketId].iceConnectionState);
        // }
        socket.emit("leave_Group", player.id);
        player.isUserCalling = false;
        player.isUserJoin = false;
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
          ctx.fillStyle = "rgb(50, 50, 50)";
          ctx.font = "24px bold Arial";
          ctx.textAlign = 'center';
          ctx.fillText(`${object.nickname}`,
            object.x + 8 + utils.withGrid(ctx.canvas.clientWidth / 16 / 2) - cameraPerson.x,
            object.y - 8 + utils.withGrid(ctx.canvas.clientHeight / 16 / 2) - cameraPerson.y
          );
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
      // console.log("[x,y]: [", player?.x, player?.y, "]");

      //Draw Upper layer
      // this.map.drawUpperImage(this.ctx, cameraPerson);
      // console.log(player?.y);
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

  const leaveUser = (data) => {
    for (let i = 0; i < characters.length; i++) {
      if (characters[i].id === data.id) {
        characters.splice(i, 1);
        break;
      }
    }
    delete charMap[data.id];
  };

  const joinUser = (id, x, y, nickname, src) => {
    let character = new Person({
      x: 0,
      y: 0,
      id: id,
    });
    character.id = id;
    character.x = x;
    character.y = y;
    character.nickname = nickname;
    character.sprite.image.src = src;
    character.sprite.xaxios = adjustValue.xaxios;
    character.sprite.yaxios = adjustValue.yaxios;
    character.sprite.yratio = adjustValue.yratio;
    character.directionUpdate = {
      up: ["y", -4],
      down: ["y", 4],
      left: ["x", -4],
      right: ["x", 4],
    };
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

export default Overworld3;
