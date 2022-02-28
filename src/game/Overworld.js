import { OverworldMap } from "./OverworldMap.js";
import { DirectionInput } from "./DirectionInput.js";
import utils from "./utils.js";
import _const from "../config/const.js";
import { useEffect, useRef, useState } from "react";
import LoadingComponent from "../components/Loading.js";
import { useNavigate } from "react-router";

let myStream;
let cameraOff = false;
let muted = true;
let pcObj = {
  // remoteSocketId: pc (peer connection)
  // pcObj[remoteSocketId] = myPeerConnection 이다
};
var sendChannel = []; // RTCDataChannel for the local (sender)
var receiveChannel = []; // RTCDataChannel for the remote (receiver)
var localConnection = []; // RTCPeerConnection for our "local" connection
var remoteConnection = []; // RTCPeerConnection for the "remote"

let peopleInRoom = 1;

const Overworld = ({ setOpenDraw, Room, otherMaps, charMap, socket, openDraw }) => {
  const [isLoading, setIsLoading] = useState(true);
  const containerEl = useRef();
  const canvasRef = useRef();
  const navigate = useNavigate();
  const directionInput = new DirectionInput();
  directionInput.init();

  const cameraConstraints = {
    audio: true,
    video: true,
  };

  const map = new OverworldMap(Room);

  let closer = [];
  const socketDisconnect = () => {
    socket.close();
  };

  useEffect(() => {
    const keydownHandler = (e) => {
      const player = charMap[socket.id];
      if (
        (e.key === "x" || e.key === "X" || e.key === "ㅌ") &&
        player.x === 48 &&
        player.y === 48
      ) {
        setOpenDraw((prev) => !prev);
      } else if ((!openDraw && (e.key === "x" || e.key === "X" || e.key === "ㅌ"))
        || directionInput.direction) {
        setOpenDraw(false);
      }
    };
    window.addEventListener("popstate", socketDisconnect);
    window.addEventListener("keydown", keydownHandler);
    return () => {
      window.removeEventListener("popstate", socketDisconnect);
      window.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  useEffect(()=>{

  initCall();

  async function handleAddStream(event, remoteSocketId, remoteNickname) {
    const peerStream = event.stream;
    // console.log(peerStream);
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
      // console.log(streamArr, streamElement.id, id);
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
      // console.log(pcObj);

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
      // console.log("mystream", myStream);
      // stream을 mute하는 것이 아니라 HTML video element를 mute한다.
      myFace.srcObject = myStream;
      myFace.muted = true;

      myStream // mute default
        .getAudioTracks()
        .forEach((track) => (track.enabled = false));
    } else {
      myStream = await navigator.mediaDevices.getDisplayMedia(
        displayMediaOptions
      );
      // console.log("mystream", myStream);
      // stream을 mute하는 것이 아니라 HTML video element를 mute한다.
      myFace.srcObject = myStream;
      myFace.muted = true;

      myStream // mute default
        .getAudioTracks()
        .forEach((track) => (track.enabled = false));
    }
  }

  async function initCall() {
    console.log("initCall 함수");
    try {
      await getMedia(false); // Room.js에 들어있음
    } catch (err) {
      console.log(err);
    }
  }

  // 남는 사람 기준
  socket.on("leave_succ", function (data) {
    const user = charMap[data.removeSid];
    user.isUserJoin = false;
    removePeerFace(data.removeSid);
  });

  socket.on("accept_join", async (userObjArr) => {
    try {
      const length = userObjArr.length;
      if (length === 1) {
        return;
      }

      for (let i = 0; i < length - 1; ++i) {
        const newPC = await createConnection(
          userObjArr[i].socketId,
          userObjArr[i].nickname
        );
        // sendChannel[userObjArr[i].socketId] = await newPC.createDataChannel("sendChannel");
        // sendChannel[userObjArr[i].socketId].addEventListener("message", console.log);
        // console.log("made data channel", "local", socket.id, "remote", userObjArr[i].socketId);

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
      // console.log('*******', remoteSocketId);
      // console.log('****pcObj', pcObj);

      // pcObj[remoteSocketId].ondatachannel = ev => {
      //   sendChannel[remoteSocketId] = ev.channel;
      //   sendChannel[remoteSocketId].addEventListener("message", console.log);
      // };
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
  },[])
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let isLoop = true;
    const startGameLoop = () => {
      const step = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        //Clear off the canvas
        ctx.clearRect(0, 0, canvas?.width, canvas?.height);

        //Establish the camera person
        const cameraPerson = charMap[socket.id] || map.gameObjects.player;
        const player = charMap[socket.id];

        //Update all objects
        Object.values(charMap).forEach((object) => {
          if (object.id === socket.id) {
            for (let i = 0; i < otherMaps.length; i++) {
              if (object.x === otherMaps[i].x && object.y === otherMaps[i].y) {
                // console.log("warp!!!");
                socket.close();
                navigate(otherMaps[i].url);
                // window.location.href = `${otherMaps[i].url}`;
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
              object.isUserCalling = false;
              object.isUserJoin = false;
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
            object.sprite.draw(ctx, cameraPerson, map.roomNum);

            const objectNicknameContainer = document.getElementById(
              `${object.nickname}`
            );
            // console.dir(objectNicknameContainer);
            if (!objectNicknameContainer) {
              return;
            }
            objectNicknameContainer.style.top =
              object.y -
              25 +
              utils.withGrid(ctx.canvas.clientHeight / 16 / 2) -
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
          };
          socket.emit("input", data);
        }
        if (isLoop) {
          requestAnimationFrame(() => {
            step();
          });
        }
      };
      step();
    };
    setTimeout(() => {
      setIsLoading(false);
      startGameLoop();
    }, 3000);
    return () => {
      isLoop = false;
    };
  }, []);

  return (
    <>
      {isLoading && <LoadingComponent />}
      <div
        ref={containerEl}
        className="game-container"
        style={{ backgroundColor: "black", width: "100vw", height: "100vh" }}
      >
        <canvas ref={canvasRef} className="game-canvas"></canvas>
      </div>
    </>
  );
};

export default Overworld;

