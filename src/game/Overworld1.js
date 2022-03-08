import { OverworldMap } from "./OverworldMap.js";
import { DirectionInput } from "./DirectionInput.js";
import utils from "./utils.js";
import _const from "../config/const.js";
import { useEffect, useRef, useState } from "react";
import LoadingComponent from "../components/Loading.js";
import { useNavigate } from "react-router";
import styled from "styled-components";
const GameLayout = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  align-items: center;
  background-color: rgb(19, 19, 20, 0);
  // z-index: 10;
`;

const StreamsContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 64px;
  top: 20px;
  width: 100%;
  z-index: 99;

  .streams-container {
    max-width: 1024px;
    min-width: 1024px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-x: scroll;
    scroll-behavior: smooth;
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }

    div {
      width: 200px;
      margin-right: 20px;

      .userVideo {
        width: 200px;
        border-radius: 10px;
        /*Mirror code starts*/
        transform: rotateY(180deg);
        -webkit-transform: rotateY(180deg); /* Safari and Chrome */
        -moz-transform: rotateY(180deg); /* Firefox */

        /*Mirror code ends*/
        &:hover {
          outline: 2px solid red;
          cursor: pointer;
        }
      }
      .videoNickname {
        position: relative;
        bottom: 140px;
        left: 5px;
        display: inline;
        background-color: rgb(0, 0, 0, 0.6);
        padding: 5px;
        border-radius: 10px;
        color: white;
      }
    }
  }
`;

const Overworld1 = ({
  myStream,
  url,
  Room,
  charMap,
  otherMaps,
  socket,
  setCameraPosition,
  setYCameraPosition,
}) => {
  const mediasoupClient = require("mediasoup-client");
  const containerEl = useRef();
  const canvasRef = useRef();
  const navigate = useNavigate();
  const directionInput = new DirectionInput();
  let rotationAngle = 1;
  directionInput.init();

  const map = new OverworldMap(Room);

  let closer = [];
  let reduplication = []; //해결하고 지울게요 ㅜㅜ
  let audio_reduplication = [];  //해결하고 지울게요 ㅜㅜ

  const mediaOff = () => {
    myStream.getTracks().forEach((track) => track.stop());
  };

  const socketDisconnect = () => {
    socket.close();
    mediaOff();
  };

  useEffect(() => {
    window.addEventListener("popstate", socketDisconnect);
    return () => {
      window.removeEventListener("popstate", socketDisconnect);
    };
  }, []);

  useEffect(() => {
    let cameraOff = false;
    let muted = true;
    let pcObj = {
      // remoteSocketId: pc (peer connection)
      // pcObj[remoteSocketId] = myPeerConnection 이다
    };
    var sendChannel = []; // RTCDataChannel for the local (sender)
    var receiveChannel = []; // RTCDataChannel for the remote (receiver)
    var localConnection = []; // RTCPeerConnect~ion for our "local" connection
    var remoteConnection = []; // RTCPeerConnection for the "remote"
    let video_stream;
    let audio_stream;

    let videoConstraints = {
      audio: false,
      video: true,
    }
    let audioConstraints = {
      audio: true,
      video: false,
    }

    // WebRTC SFU (mediasoup)
    let params_audio = {
      codecOptions: {
        opusStereo: 1,
        opusDtx: 1,
      },
    };
    let params_video = {
      // mediasoup params
      encodings: [
        {
          rid: "r0",
          maxBitrate: 100000,
          scalabilityMode: "S1T3",
        },
        {
          rid: "r1",
          maxBitrate: 300000,
          scalabilityMode: "S1T3",
        },
        {
          rid: "r2",
          maxBitrate: 900000,
          scalabilityMode: "S1T3",
        },
      ],
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
      codecOptions: {
        videoGoogleStartBitrate: 1000,
      },
    };

    let device;
    let rtpCapabilities;
    let producerTransport;
    let consumerTransports = [];
    let producer;
    let consumer;
    let isProducer = false;

    initCall();
    // 음성 connect
    async function setAudio(peerStream, socketId) {
      console.log(`socketID ${socketId} peer의 audio 태그 생성`);
      const streamContainer = document.querySelector(".streams-container");

      const div = document.querySelector(`#${socketId}`);
      let elem = document.createElement("audio");
      elem.srcObject = peerStream;
      elem.playsinline = false;
      elem.autoplay = true;

      div.appendChild(elem);
      streamContainer.appendChild(div);
    }
    // 영상 connect
    async function paintPeerFace(peerStream, socketId) {
      console.log(`socketID ${socketId} peer의 vidoe 태그 생성`);
      const user = charMap[socketId];
      const streamContainer = document.querySelector(".streams-container");
      const div = document.createElement("div");
      const nicknameDiv = document.createElement("div");
      nicknameDiv.className = "videoNickname";
      nicknameDiv.innerText = user.nickname;
      // div.classList.add("userVideoContainer");
      div.id = socketId;

      // console.log("-------- 커넥션 상태 --------", pcObj[id].iceConnectionState);

      try {
        // console.log("******peerstream", peerStream);
        const video = document.createElement("video");
        video.srcObject = await peerStream;
        video.className = "userVideo";
        video.autoplay = true;
        video.playsInline = true;
        video.controls = true;
        div.appendChild(video);
        div.appendChild(nicknameDiv);
        streamContainer.appendChild(div);

        const divSelector = document.querySelectorAll(".streams-container div");

        if (divSelector?.length > 4) {
          streamContainer.style.justifyContent = "flex-start";
        }
        // await sortStreams();
      } catch (err) {
        console.error(err);
      }
    }

    // 영상 disconnect
    function removePeerFace(id) {
      console.log("삭제되어야해!", id);
      const streamContainer = document.querySelector(".streams-container");
      const streamArr = streamContainer.querySelectorAll("div");
      // console.log("총 길이 " , streamArr.length);
      streamArr.forEach((streamElement) => {
        if (streamElement.id === id) {
          streamContainer.removeChild(streamElement);
        }
      });
    }

    function handleMuteClick() {
      myStream
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

    async function getMedia() {
      const myFace = document.querySelector("#myFace");
      const camBtn = document.querySelector("#camBtn");
      camBtn.style.display = "block";
      myStream // mute default
        .getAudioTracks()
        .forEach((track) => (track.enabled = true));
      const video_track = myStream.getVideoTracks()[0];
      const audio_track = myStream.getAudioTracks()[0];
      myFace.srcObject = new MediaStream([video_track]);

      params_audio = {
        track: audio_track,
        ...params_audio,
      };

      params_video = {
        track: video_track,
        ...params_video,
      };
    }

    async function initCall() {
      try {
        await getMedia(); // Room.js에 들어있음
      } catch (err) {
        console.log(err);
      }
    }

    // A device is an endpoint connecting to a Router on the
    // server side to send/recive media
    const createDevice = async () => {
      try {
        // console.log("createDevice 실행");
        device = new mediasoupClient.Device();
        // device = getMedia(false)
        // console.log("**********device체크", device);

        // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
        // Loads the device with RTP capabilities of the Router (server side)
        await device.load({
          // see getRtpCapabilities() below
          routerRtpCapabilities: rtpCapabilities,
        });

        // console.log("Device RTP Capabilities", device.rtpCapabilities);

        // once the device loads, create transport
        createSendTransport();
      } catch (error) {
        console.log(error);
        if (error.name === "UnsupportedError")
          console.warn("browser not supported");
      }
    };

    const createSendTransport = () => {
      // console.log("createSendTransport 실행");

      // see server's socket.on('createWebRtcTransport', sender?, ...)
      // this is a call from Producer, so sender = true
      socket.emit(
        "createWebRtcTransport",
        { consumer: false },
        ({ params }) => {
          // console.log(
          //   "createSendTransport에서 createWebRtcTransport 콜백 실행"
          // );

          // The server sends back params needed
          // to create Send Transport on the client side
          if (params.error) {
            console.log(params.error);
            return;
          }

          // creates a new WebRTC Transport to send media
          // based on the server's producer transport params
          // console.log(params);
          producerTransport = device.createSendTransport(params);

          // see connectSendTransport() below
          // this event is raised when a first call to transport.produce() is made
          producerTransport.on(
            "connect",
            async ({ dtlsParameters }, callback, errback) => {
              try {
                // see server's socket.on('transport-dconnect', ...)
                // Signal local DTLS parameters to the server side transport
                await socket.emit("transport-connect", {
                  dtlsParameters,
                });
                // Tell the transport that parameters were transmitted.
                callback();
              } catch (error) {
                errback(error);
              }
            }
          );

          producerTransport.on(
            "produce",
            async (parameters, callback, errback) => {
              console.log("producerTransport의 produce 이벤트 실행");
              try {
                // tell the server to create a Producer
                // with the following parameters and produce
                // and expect back a server side producer id
                // see server's socket.on('transport-produce', ...)
                await socket.emit(
                  "transport-produce",
                  {
                    kind: parameters.kind,
                    rtpParameters: parameters.rtpParameters,
                    appData: parameters.appData,
                  },
                  ({ id, producersExist }) => {
                    // Tell the transport that parameters were transmitted and provide it with the
                    // server side producer's id.
                    callback({ id });

                    // if producers exist, then join room
                    // console.log(
                    //   "############# producersExist : ",
                    //   producersExist
                    // );
                    if (producersExist) getProducers();
                  }
                );
              } catch (error) {
                errback(error);
              }
            }
          );
          connectSendTransport();
        }
      );
    };

    const connectSendTransport = async () => {
      console.log("connectSendTransport 실행");

      // we now call produce() to instruct the producer transport
      // to send media to the Router
      // this action will trigger the 'connect' and 'produce' events above
      producer = await producerTransport.produce(params_video);
      await producerTransport.produce(params_audio);

      producer.on("trackended", () => {
        console.log("track ended");
        // close video track
      });

      producer.on("transportclose", () => {
        console.log("transport ended");
        // close video track
      });
    };

    // server informs the client of a new producer just joined
    socket.on("new-producer", ({ producerId, socketId }) =>
      signalNewConsumerTransport(producerId, socketId)
    );

    const getProducers = () => {
      // console.log("getProducers 실행");

      socket.emit("getProducers", (producerIds) => {
        // console.log("getProducers 콜백 실행");

        console.log("", producerIds);
        // for each of the producer create a consumer
        producerIds.forEach((ids) =>
          signalNewConsumerTransport(ids.producerId, ids.socketId)
        );
        // producerIds.forEach(signalNewConsumerTransport);
      });
    };

    const signalNewConsumerTransport = async (remoteProducerId, socketId) => {
      // console.log("signalNewConsumerTransport 실행");
      await socket.emit(
        "createWebRtcTransport",
        { consumer: true },
        ({ params }) => {
          // console.log(
          //   "signalNewConsumerTransport에서 createWebRtcTransport 콜백 실행"
          // );
          // The server sends back params needed
          // to create Send Transport on the client side
          if (params.error) {
            console.log(params.error);
            return;
          }
          // console.log(`PARAMS... ${params}`);

          let consumerTransport;
          try {
            consumerTransport = device.createRecvTransport(params);
          } catch (error) {
            // exceptions:
            // {InvalidStateError} if not loaded
            // {TypeError} if wrong arguments.
            console.log(error);
            return;
          }

          consumerTransport.on(
            "connect",
            async ({ dtlsParameters }, callback, errback) => {
              console.log("consumerTransport의 connect 이벤트 실행");
              try {
                console.log("&&&&&connect&&&&&");
                // Signal local DTLS parameters to the server side transport
                // see server's socket.on('transport-recv-connect', ...)
                await socket.emit("transport-recv-connect", {
                  dtlsParameters,
                  serverConsumerTransportId: params.id,
                });

                // Tell the transport that parameters were transmitted.
                callback();
              } catch (error) {
                // Tell the transport that something was wrong
                errback(error);
              }
            }
          );
          connectRecvTransport(
            consumerTransport,
            remoteProducerId,
            params.id,
            socketId
          );
        }
      );
    };

    const connectRecvTransport = async (
      consumerTransport,
      remoteProducerId,
      serverConsumerTransportId,
      remoteSocketId
    ) => {
      console.log("connectRecvTransport실행", remoteSocketId);
      // for consumer, we need to tell the server first
      // to create a consumer based on the rtpCapabilities and consume
      // if the router can consume, it will send back a set of params as below
      await socket.emit(
        "consume",
        {
          rtpCapabilities: device.rtpCapabilities,
          remoteProducerId,
          serverConsumerTransportId,
          remoteSocketId,
        },
        async ({ params }) => {
          if (params.error) {
            console.log("******Cannot Consume******");
            return;
          }
          // console.log(`******Consumer Params ${params}*******`);
          // then consume with the local consumer transport
          // which creates a consumer
          const consumer = await consumerTransport.consume({
            id: params.id,
            producerId: params.producerId,
            kind: params.kind,
            rtpParameters: params.rtpParameters,
          });

          consumerTransports = [
            ...consumerTransports,
            {
              consumerTransport,
              serverConsumerTransportId: params.id,
              producerId: remoteProducerId,
              consumer,
            },
          ];
          // destructure and retrieve the video track from the producer
          const { track } = consumer;
          // console.log("---------------- consumer : ", consumer);
          // console.log("---------------- params : ", params)
          const peerStream = new MediaStream([track]);
          if (track.kind === "video") {
            console.log("!!!!video  태그 추가 요청", remoteSocketId);
            let check = reduplication.filter(
              (element) => element === remoteSocketId
            );
            if (check.length === 0) {
              // console.log("video check안으로 들어옴")
              console.log("only one", reduplication);
              reduplication.push(remoteSocketId);
              await paintPeerFace(peerStream, remoteSocketId);
            }
          } else {
            console.log("!!!!audio 태그 추가 요청", remoteSocketId);
            let check = audio_reduplication.filter(
              (element) => element === remoteSocketId
            );
            if (check.length === 0) {
              // console.log("audio check안으로 들어옴")
              audio_reduplication.push(remoteSocketId);
              console.log("only one", audio_reduplication);
              await setAudio(peerStream, remoteSocketId);
            }
          }

          // document.getElementById(remoteProducerId).srcObject = new MediaStream([track])

          // the server consumer started with media paused
          // so we need to inform the server to resume
          socket.emit("consumer-resume", {
            serverConsumerId: params.serverConsumerId,
          });
        }
      );
    };

    socket.on("producer-closed", ({ remoteProducerId, remoteSocketId }) => {
      console.log("producer-closed 콜백 실행");

      // server notification is received when a producer is closed
      // we need to close the client-side consumer and associated transport
      const producerToClose = consumerTransports.find(
        (transportData) => transportData.producerId === remoteProducerId
      );
      producerToClose.consumerTransport.close();
      producerToClose.consumer.close();

      // remove the consumer transport from the list
      consumerTransports = consumerTransports.filter(
        (transportData) => transportData.producerId !== remoteProducerId
      );

      // remove the video div element
      // videoContainer.removeChild(document.getElementById(`td-${remoteProducerId}`))
      removePeerFace(remoteSocketId);
    });

    // ---------------------------------------- ^ SFU

    socket.on("remove_reduplication", (remoteSocketId) => {
      reduplication = reduplication.filter((element) => element !== remoteSocketId)
      audio_reduplication = audio_reduplication.filter((element) => element !== remoteSocketId)
    });

    // 남는 사람 기준
    socket.on("leave_succ", function (data) {
      console.log("leave_succ");
      const user = charMap[data.removeSid];
      user.isUserJoin = false;
      user.groupName = 0;
      reduplication = reduplication.filter((element) => element !== data.removeSid)
      audio_reduplication = audio_reduplication.filter((element) => element !== data.remveSid)
      console.log("reduplication video, audio ", reduplication, audio_reduplication)
      removePeerFace(data.removeSid);
    });

    socket.on("leave_user", function (data) {
      removePeerFace(data.id);
    });

    socket.on("accept_join", async (groupName) => {
      try {
        // SFU
        console.log("accept_join", groupName);
        // charMap[socket.id].groupName = groupName;
        socket.emit("getRtpCapabilities", groupName, (data) => {
          // console.log(`Router RTP Capabilities... ${data.rtpCapabilities}`);
          // we assign to local variable and will be used when
          // loading the client Device (see createDevice above)
          rtpCapabilities = data.rtpCapabilities;

          // once we have rtpCapabilities from the Router, create Device
          createDevice();
        });
      } catch (err) {
        console.error(err);
      }
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let dataBuffer = [];
    let isLoop = true;
    const bufferSend = (player, data) => {
      dataBuffer.push(data);
      let stay_num = dataBuffer.filter(
        (element) =>
          element.direction === undefined &&
          element.x === player.x &&
          element.y === player.y
      ).length;
      if (stay_num > 4) {
        dataBuffer = [];
      }
      if (dataBuffer.length > 4) {
        socket.emit("input", dataBuffer);
        dataBuffer = [];
      }
    };

    const startGameLoop = () => {
      const step = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        //Clear off the canvas
        ctx.clearRect(0, 0, canvas?.width, canvas?.height);

        //Establish the camera person
        const player = charMap[socket.id] || map.gameObjects.player;

        if (setCameraPosition) {
          setYCameraPosition(-player.y / 80);
          setCameraPosition(-player.x / 80);
        }

        //Update all objects
        Object.values(charMap).forEach((object) => {
          if (object.id === socket.id) {
            for (let i = 0; i < otherMaps.length; i++) {
              if (
                (map.roomNum === 3 && object.y > 656) ||
                (object.y < -1250 && object.x > 1232)
              ) {
                socket.close();
                mediaOff();
                navigate(url, { state: { x: 1584, y: 784 } });
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
          const streamContainer = document.querySelector(".streams-container");
          while (streamContainer.hasChildNodes()) {
            // 내가 가지고있는 다른 사람의 영상을 전부 삭제
            streamContainer.removeChild(streamContainer.firstChild);
          }

          socket.emit("leave_Group", player.id);
          player.isUserCalling = false;
          player.isUserJoin = false;
        }
        //Draw Lower layer
        map.drawLowerImage(ctx, player);

        //Draw Game Objects
        Object.values(charMap)
          .sort((a, b) => {
            return a.y - b.y;
          })
          .forEach((object) => {
            if (object.id === player.id) {
              object.sprite.draw(ctx, player, map.roomNum, true, rotationAngle);
            } else {
              object.sprite.draw(
                ctx,
                player,
                map.roomNum,
                false,
                rotationAngle
              );
            }

            const objectNicknameContainer = document.getElementById(
              `${object.nickname}`
            );
            // console.dir(objectNicknameContainer);
            if (!objectNicknameContainer) {
              return;
            }
            objectNicknameContainer.style.top =
              object.y +
              225 +
              utils.withGrid(ctx.canvas.clientHeight / 16 / 2) -
              player.y +
              "px";
            objectNicknameContainer.style.left =
              object.x +
              utils.withGrid(ctx.canvas.clientWidth / 16 / 2) -
              player.x +
              "px";
          });
        if (player) {
          const data = {
            id: socket.id,
            x: player.x,
            y: player.y,
            direction: directionInput.direction,
          };
          bufferSend(player, data);
        }
        if (isLoop) {
          requestAnimationFrame(() => {
            step();
          });
        }
      };
      step();
    };

    const cameraRotate = (e) => {
      switch (e.key) {
        case "e":
        case "E":
        case "ㄷ":
          rotationAngle += 1;
          if (rotationAngle > 4) {
            rotationAngle = 1;
          }
          characterRotate(rotationAngle);
          break;
        case "q":
        case "Q":
        case "ㅂ":
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
          break;
      }
    };
    if (map.roomNum === 3) {
      document.addEventListener("keydown", cameraRotate);
      startGameLoop();
    }

    return () => {
      if (map.roomNum === 3) {
        document.removeEventListener("keydown", cameraRotate);
      }
      isLoop = false;
    };
  }, []);

  return (
    <>
      <GameLayout>
        <div
          ref={containerEl}
          className="game-container"
          style={{
            backgroundColor: "rgb(37, 127, 190, 0)",
            width: "100vw",
            height: "100vh",
          }}
        >
          <canvas ref={canvasRef} className="game-canvas"></canvas>
        </div>
        <StreamsContainer id="streams">
          <div className="streams-container"></div>
        </StreamsContainer>
      </GameLayout>

    </>
  );
};

export default Overworld1;
