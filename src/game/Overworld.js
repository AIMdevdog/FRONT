import { OverworldMap } from "./OverworldMap.js";
import { DirectionInput } from "./DirectionInput.js";
import { Person } from "./Person.js";
import { FaVideo } from "react-icons/fa";
import utils from "./utils.js";
import io from "socket.io-client";
import _const from "../config/const.js";
import mediasoupClient from 'mediasoup-client'

let myStream;
let cameraOff = false;
let muted = true;
let pcObj = {
  // remoteSocketId: pc (peer connection)
  // pcObj[remoteSocketId] = myPeerConnection 이다
};

// WebRTC SFU (mediasoup)
let params = {
  // mediasoup params
  encodings: [
    {
      rid: 'r0',
      maxBitrate: 100000,
      scalabilityMode: 'S1T3',
    },
    {
      rid: 'r1',
      maxBitrate: 300000,
      scalabilityMode: 'S1T3',
    },
    {
      rid: 'r2',
      maxBitrate: 900000,
      scalabilityMode: 'S1T3',
    },
  ],
  // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
  codecOptions: {
    videoGoogleStartBitrate: 1000
  }
}

let device
let rtpCapabilities
let producerTransport
let consumerTransports = []
let producer
let consumer
let isProducer = false

let peopleInRoom = 1;

const characters = [];
const charMap = {};

const Overworld = (data) => {
  const config = data.config;
  const nickname = data.nickname;
  const element = config;
  const canvas = element.querySelector(".game-canvas");
  const ctx = canvas.getContext("2d");
  const cameraConstraints = {
    audio: true,
    video: true,
  };

  const nicknameContainer = document.querySelector(".nickname");

  const map = new OverworldMap(data.Room);
  const adjustValue = data.adjust;
  const otherMaps = data.otherMaps;
  const directionInput = new DirectionInput();
  directionInput.init();
  let roomId;
  if (map.roomNum === 0) {
    roomId = "room" + map.roomId;
  } else if (map.roomNum === 1) {
    roomId = "room1" + map.roomId;
  }

  const socket = io(_const.HOST);
  let closer = [];

  // data 안에 소켓id, nickname 있음
  // data for문 돌면서 isUserCalling checking 혹은..
  // [PASS] 2명+3명 그룹 합쳐질 때 그룹 통화중이라는 것을 표시해둬야 함 / 변수 하나 더 추가 true, false 체크

  // function sortStreams() {
  //   const streams = document.querySelector("#streams");
  //   const streamArr = streams.querySelectorAll("div");
  //   streamArr.forEach((stream) => (stream.className = `people${peopleInRoom}`));
  // }

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

  async function handleScreenSharing() {
    try {
      console.log("handleScreenSharing 실행");
      await getMedia(true);
      const peerConnectionObjArr = Object.values(pcObj);
      if (peerConnectionObjArr.length > 0) {
        const newVideoTrack = myStream.getVideoTracks()[0];
        peerConnectionObjArr.forEach((peerConnection) => {
          console.log("peerConnection", peerConnection);
          const peerVideoSender = peerConnection
            .getSenders()
            .find((sender) => sender.track.kind === "video");
          peerVideoSender.replaceTrack(newVideoTrack);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function closeScreenSharing() {
    try {
      console.log("closeScreenSharing 실행");
      await getMedia(false);
      const peerConnectionObjArr = Object.values(pcObj);
      if (peerConnectionObjArr.length > 0) {
        const newVideoTrack = myStream.getVideoTracks()[0];
        peerConnectionObjArr.forEach((peerConnection) => {
          console.log("peerConnection", peerConnection);
          const peerVideoSender = peerConnection
            .getSenders()
            .find((sender) => sender.track.kind === "video");
          peerVideoSender.replaceTrack(newVideoTrack);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  const shareBtn = document.querySelector("#shareBtn");
  const myFaceBtn = document.querySelector("#myFaceBtn");
  shareBtn.addEventListener("click", handleScreenSharing);
  myFaceBtn.addEventListener("click", closeScreenSharing);

  function handleMuteClick() {
    myStream //
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    if (muted) {
      muted = false;
    } else {
      muted = true;
    }
  }

  function handleCameraClick() {
    myStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));

    if (cameraOff) {
      cameraOff = false;
    } else {
      cameraOff = true;
    }
  }

  const cameraBtn = document.querySelector("#playerCamera");
  const muteBtn = document.querySelector("#playerMute");

  cameraBtn.addEventListener("click", handleCameraClick);
  muteBtn.addEventListener("click", handleMuteClick);

  var displayMediaOptions = {
    video: {
      cursor: "always",
    },
    audio: false,
  };

  async function getMedia(sharing) {
    const myFace = document.querySelector("#myFace");
    const camBtn = document.querySelector("#camBtn");
    camBtn.style.display = "block";
    if (!sharing) {
      myStream = await navigator.mediaDevices.getUserMedia(cameraConstraints);
      console.log("mystream", myStream);
      // stream을 mute하는 것이 아니라 HTML video element를 mute한다.
      myFace.srcObject = myStream;
      myFace.muted = true;

      myStream // mute default
        .getAudioTracks()
        .forEach((track) => (track.enabled = false));
      let track = myStream.getVideoTracks()[0]
      params = {
        track,
        ...params
      }
    } else {
      myStream = await navigator.mediaDevices.getDisplayMedia(
        displayMediaOptions
      );
      console.log("mystream", myStream);
      // stream을 mute하는 것이 아니라 HTML video element를 mute한다.
      myFace.srcObject = myStream;
      myFace.muted = true;

      myStream // mute default
        .getAudioTracks()
        .forEach((track) => (track.enabled = false));
    }
  }

  async function initCall() {
    // welcome.hidden = true;            // HTML 관련 코드
    // call.classList.remove(HIDDEN_CN); // HTML 관련 코드
    console.log("initCall 함수");
    try {
      await getMedia(false); // Room.js에 들어있음
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

  // WebRTC SFU (mediasoup) functions

  // A device is an endpoint connecting to a Router on the
  // server side to send/recive media
  const createDevice = async () => {
    try {
      device = new mediasoupClient.Device()

      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
      // Loads the device with RTP capabilities of the Router (server side)
      await device.load({
        // see getRtpCapabilities() below
        routerRtpCapabilities: rtpCapabilities
      })

      console.log('Device RTP Capabilities', device.rtpCapabilities)

      // once the device loads, create transport
      createSendTransport()

    } catch (error) {
      console.log(error)
      if (error.name === 'UnsupportedError')
        console.warn('browser not supported')
    }
  }

  const createSendTransport = () => {
    // see server's socket.on('createWebRtcTransport', sender?, ...)
    // this is a call from Producer, so sender = true
    socket.emit('createWebRtcTransport', { consumer: false }, ({ params }) => {
      // The server sends back params needed 
      // to create Send Transport on the client side
      if (params.error) {
        console.log(params.error)
        return
      }
  
      console.log(params)
  
      // creates a new WebRTC Transport to send media
      // based on the server's producer transport params
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
      producerTransport = device.createSendTransport(params)
  
      // https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
      // this event is raised when a first call to transport.produce() is made
      // see connectSendTransport() below
      producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          // Signal local DTLS parameters to the server side transport
          // see server's socket.on('transport-dconnect', ...)
          await socket.emit('transport-connect', {
            dtlsParameters,
          })
  
          // Tell the transport that parameters were transmitted.
          callback()
  
        } catch (error) {
          errback(error)
        }
      })
  
      producerTransport.on('produce', async (parameters, callback, errback) => {
        console.log(parameters)
  
        try {
          // tell the server to create a Producer
          // with the following parameters and produce
          // and expect back a server side producer id
          // see server's socket.on('transport-produce', ...)
          await socket.emit('transport-produce', {
            kind: parameters.kind,
            rtpParameters: parameters.rtpParameters,
            appData: parameters.appData,
          }, ({ id, producersExist }) => {
            // Tell the transport that parameters were transmitted and provide it with the
            // server side producer's id.
            callback({ id })
  
            // if producers exist, then join room
            if (producersExist) getProducers()
          })
        } catch (error) {
          errback(error)
        }
      })
  
      connectSendTransport()
    })
  }

  const connectSendTransport = async () => {
    // we now call produce() to instruct the producer transport
    // to send media to the Router
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
    // this action will trigger the 'connect' and 'produce' events above
    producer = await producerTransport.produce(params)
  
    producer.on('trackended', () => {
      console.log('track ended')
  
      // close video track
    })
  
    producer.on('transportclose', () => {
      console.log('transport ended')
  
      // close video track
    })
  }

  const getProducers = () => {
    socket.emit('getProducers', producerIds => {
      console.log(producerIds)
      // for each of the producer create a consumer
      // producerIds.forEach(id => signalNewConsumerTransport(id))
      producerIds.forEach(signalNewConsumerTransport)
    })
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
      socket.emit('getRtpCapabilities', (data) => {
        console.log(`Router RTP Capabilities... ${data.rtpCapabilities}`)
        // we assign to local variable and will be used when
        // loading the client Device (see createDevice above)
        rtpCapabilities = data.rtpCapabilities
    
        // once we have rtpCapabilities from the Router, create Device
        createDevice()
      })



      // const length = userObjArr.length;
      // if (length === 1) {
      //   return;
      // }

      // for (let i = 0; i < length - 1; ++i) {
      //   const newPC = await createConnection(
      //     userObjArr[i].socketId,
      //     userObjArr[i].nickname
      //   );
      //   const offer = await newPC.createOffer();
      //   await newPC.setLocalDescription(offer);
      //   socket.emit(
      //     "offer",
      //     offer,
      //     userObjArr[i].socketId,
      //     userObjArr[i].nickname
      //   );
      // }
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
    // const state = pcObj[remoteSocketId].iceConnectionState;
    // if (state === "failed" || state === "closed") {
    //   const newPC = await createConnection(remoteSocketId, remoteNickname);
    //   const offer = await newPC.createOffer();
    //   await newPC.setLocalDescription(offer);
    //   socket.emit("offer", offer, remoteSocketId, remoteNickname);
    //   console.log("iceCandidate 실패! 재연결 시도");
    // }
  });

  let nicknameDiv;

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
    // console.log(data);
  });

  socket.on("get_user_info", function (data) {
    console.log(data);
    joinUser(data.id, data.x, data.y, data.nickname, data.src);

    const cameraPerson = charMap[socket.id] || map.gameObjects.player;

    console.log(cameraPerson);

    nicknameDiv = document.createElement("div");
    nicknameDiv.className = data.id;
    nicknameDiv.innerHTML = nickname;

    nicknameDiv.style.width = 100;
    nicknameDiv.style.transform = "translateX(-40%)";
    nicknameDiv.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    nicknameDiv.style.padding = "6px";
    nicknameDiv.style.borderRadius = "6px";
    nicknameDiv.style.color = "white";
    nicknameDiv.style.fontSize = "12px";
    nicknameDiv.style.textAlign = "center";
    nicknameDiv.style.position = "absolute";

    nicknameContainer.appendChild(nicknameDiv);
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
      if (map.roomNum !== 1) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 750;
      }

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
              window.location.replace(`${otherMaps[i].url}`);
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

      // console.log(charNickname);

      //Draw Game Objects
      Object.values(charMap)
        .sort((a, b) => {
          return a.y - b.y;
        })
        .forEach((object) => {
          object.sprite.draw(ctx, cameraPerson);

          const objectNicknameContainer = document.querySelector(
            `.${object.id}`
          );

          objectNicknameContainer.style.top =
            object.y -
            25 +
            utils.withGrid(ctx.canvas.clientHeight / 16 / 2) -
            // utils.withGrid(ctx.canvas.clientWidth / 16 / 2) -
            cameraPerson.y +
            "px";
          objectNicknameContainer.style.left =
            object.x +
            utils.withGrid(ctx.canvas.clientWidth / 16 / 2) -
            cameraPerson.x +
            "px";
        });

      if (player) {
        const data = {
          id: socket.id,
          x: player.x,
          y: player.y,
          direction: directionInput.direction,
          nickname: player.nickname,
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
