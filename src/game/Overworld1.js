import { OverworldMap } from "./OverworldMap.js";
import { DirectionInput } from "./DirectionInput.js";
import utils from "./utils.js";
import _const from "../config/const.js";
import { useEffect, useRef, useState } from "react";
import LoadingComponent from "../components/Loading.js";
import { useNavigate } from "react-router";
import styled from "styled-components";
const mediasoupClient = require("mediasoup-client");

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
let peopleInRoom = 1;

// ------------------------------------^ SFU

const GameLayout = styled.div`
  display: flex; 
  justify-content: center;
  position: fixed;
  align-items: center;
  background-color: rgb(19,19,20, 1);
`;

const Overworld1 = ({
  url,
  Room,
  otherMaps,
  charMap,
  socket,
  setCameraPosition,
  setYCameraPosition
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const containerEl = useRef();
  const canvasRef = useRef();
  const navigate = useNavigate();
  const directionInput = new DirectionInput();
  let prevAngle = 1;
  let rotationAngle = 1;
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
    window.addEventListener("popstate", socketDisconnect);
    return () => {
      window.removeEventListener("popstate", socketDisconnect);
    }
  }, []);

  useEffect(() => {
    initCall();

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
    async function paintPeerFace(peerStream, remoteProducerId, remoteNickname) {
      const streams = document.querySelector("#streams");
      const div = document.createElement("div");
      // div.classList.add("userVideoContainer");
      div.id = remoteProducerId;

      // console.log("-------- 커넥션 상태 --------", pcObj[id].iceConnectionState);

      try {
        console.log("******peerstream", peerStream);
        const video = document.createElement("video");
        video.srcObject = await peerStream;
        video.className = "userVideo";
        video.autoplay = true;
        video.playsInline = true;
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

    var displayMediaOptions = {
      video: {
        cursor: "always",
      },
      audio: true,
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
        myFace.muted = false;

        myStream // mute default
          .getAudioTracks()
          .forEach((track) => (track.enabled = true));
        const track = myStream.getVideoTracks()[0];
        params = {
          track,
          ...params,
        };
        console.log("----------- myTrack : ", track);
      } else {
        myStream = await navigator.mediaDevices.getDisplayMedia(
          displayMediaOptions
        );
        console.log("mystream", myStream);
        // stream을 mute하는 것이 아니라 HTML video element를 mute한다.
        myFace.srcObject = myStream;
        myFace.muted = false;

        myStream // mute default
          .getAudioTracks()
          .forEach((track) => (track.enabled = true));
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

    // WebRTC SFU (mediasoup) functions

    // A device is an endpoint connecting to a Router on the
    // server side to send/recive media
    const createDevice = async () => {
      try {
        console.log("createDevice 실행");
        device = new mediasoupClient.Device();
        // device = getMedia(false)
        console.log("**********device체크", device);

        // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
        // Loads the device with RTP capabilities of the Router (server side)
        await device.load({
          // see getRtpCapabilities() below
          routerRtpCapabilities: rtpCapabilities,
        });

        console.log("Device RTP Capabilities", device.rtpCapabilities);

        // once the device loads, create transport
        createSendTransport();
      } catch (error) {
        console.log(error);
        if (error.name === "UnsupportedError")
          console.warn("browser not supported");
      }
    };

    const createSendTransport = () => {
      console.log("createSendTransport 실행");

      // see server's socket.on('createWebRtcTransport', sender?, ...)
      // this is a call from Producer, so sender = true
      socket.emit("createWebRtcTransport", { consumer: false }, ({ params }) => {
        console.log("createSendTransport에서 createWebRtcTransport 콜백 실행");

        // The server sends back params needed
        // to create Send Transport on the client side
        if (params.error) {
          console.log(params.error);
          return;
        }

        // creates a new WebRTC Transport to send media
        // based on the server's producer transport params
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

        producerTransport.on("produce", async (parameters, callback, errback) => {
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
                track: myStream.getVideoTracks()[0],
              },
              ({ id, producersExist }) => {
                // Tell the transport that parameters were transmitted and provide it with the
                // server side producer's id.
                callback({ id });

                // if producers exist, then join room
                console.log("############# producersExist : ", producersExist);
                if (producersExist) getProducers();
              }
            );
          } catch (error) {
            errback(error);
          }
        });

        connectSendTransport();
      });
    };

    const connectSendTransport = async () => {
      console.log("connectSendTransport 실행");

      // we now call produce() to instruct the producer transport
      // to send media to the Router
      // this action will trigger the 'connect' and 'produce' events above

      console.log("--------------- params : ", params);
      producer = await producerTransport.produce(params);

      producer.on("trackended", () => {
        console.log("producer의 trackended 이벤트 실행");

        console.log("track ended");

        // close video track
      });

      producer.on("transportclose", () => {
        console.log("producer의 transportclose 이벤트 실행");

        console.log("producer");
        console.log("transport ended");

        // close video track
      });
    };

    // server informs the client of a new producer just joined
    socket.on("new-producer", ({ producerId }) =>
      signalNewConsumerTransport(producerId)
    );

    const getProducers = () => {
      console.log("getProducers 실행");

      socket.emit("getProducers", (producerIds) => {
        console.log("getProducers 콜백 실행");

        console.log(producerIds);
        // for each of the producer create a consumer
        // producerIds.forEach(id => signalNewConsumerTransport(id))
        producerIds.forEach(signalNewConsumerTransport);
      });
    };

    const signalNewConsumerTransport = async (remoteProducerId) => {
      console.log("signalNewConsumerTransport 실행");

      await socket.emit(
        "createWebRtcTransport",
        { consumer: true },
        ({ params }) => {
          console.log(
            "signalNewConsumerTransport에서 createWebRtcTransport 콜백 실행"
          );
          // The server sends back params needed
          // to create Send Transport on the client side
          if (params.error) {
            console.log(params.error);
            return;
          }
          console.log(`PARAMS... ${params}`);

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
          connectRecvTransport(consumerTransport, remoteProducerId, params.id);
        }
      );
    };

    const connectRecvTransport = async (
      consumerTransport,
      remoteProducerId,
      serverConsumerTransportId
    ) => {
      console.log("connectRecvTransport 실행");

      // for consumer, we need to tell the server first
      // to create a consumer based on the rtpCapabilities and consume
      // if the router can consume, it will send back a set of params as below
      await socket.emit(
        "consume",
        {
          rtpCapabilities: device.rtpCapabilities,
          remoteProducerId,
          serverConsumerTransportId,
        },
        async ({ params }) => {
          if (params.error) {
            console.log("******Cannot Consume******");
            return;
          }

          console.log(`******Consumer Params ${params}*******`);
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

          // create a new div element for the new consumer media
          // and append to the video container
          // const newElem = document.createElement("div")
          // newElem.setAttribute('id', `td-${remoteProducerId}`)
          // newElem.setAttribute('class', 'remoteVideo')
          // newElem.innerHTML = '<video id="' + remoteProducerId + '" autoplay class="video" ></video>'
          // videoContainer.appendChild(newElem)

          // destructure and retrieve the video track from the producer
          const { track } = consumer;
          console.log("---------------- consumer : ", consumer);
          console.log("---------------- params : ", params);
          const peerStream = new MediaStream([track]);
          // console.log("----------- peer's Track : ", track)
          // console.log('**************', peerStream);
          try {
            await paintPeerFace(peerStream, remoteProducerId, "nickname");
          } catch (e) {
            console.log(e);
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

    socket.on("producer-closed", ({ remoteProducerId }) => {
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
      removePeerFace(remoteProducerId);
    });

    // ---------------------------------------- ^ SFU

    // 남는 사람 기준
    socket.on("leave_succ", function (data) {
      const user = charMap[data.removeSid];
      user.isUserJoin = false;
      removePeerFace(data.removeSid);
    });

    socket.on("accept_join", async (groupName) => {
      try {
        // SFU
        socket.emit("getRtpCapabilities", groupName, (data) => {
          console.log(`Router RTP Capabilities... ${data.rtpCapabilities}`);
          // we assign to local variable and will be used when
          // loading the client Device (see createDevice above)
          rtpCapabilities = data.rtpCapabilities;

          // once we have rtpCapabilities from the Router, create Device
          createDevice();

          // Mesh코드~
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
        });
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("offer", async (offer, remoteSocketId, remoteNickname) => {
      try {
        const newPC = await createConnection(remoteSocketId, remoteNickname);
        await newPC.setRemoteDescription(offer);
        const answer = await newPC.createAnswer();
        await newPC.setLocalDescription(answer);
        socket.emit("answer", answer, remoteSocketId);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("answer", async (answer, remoteSocketId) => {
      await pcObj[remoteSocketId].setRemoteDescription(answer);
    });

    socket.on("ice", async (ice, remoteSocketId, remoteNickname) => {
      await pcObj[remoteSocketId].addIceCandidate(ice);
    });




  }, [])

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let isLoop = true;
    const bufferSend = (player, data) => {
      dataBuffer.push(data);
      let stay_num = dataBuffer.filter(
        (element) =>
          element.direction === undefined 
          && element.x === player.x 
          && element.y === player.y
      ).length;
      if (stay_num > 5){
        dataBuffer = [];
      }
      if(dataBuffer.length > 4){
        socket.emit("input", dataBuffer);
        dataBuffer = [];
      } 
    }


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
              if (map.roomNum === 3 && object.y > 656 || (object.y < -1250 && object.x > 1232)) {
                socket.close();
                navigate(url, {state: {x: 1584, y: 784}});
              }
              else if (map.roomNum === 2 && object.y > 208){
                socket.close();
                navigate(url, {state: {x: 1008, y: 1072}});
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
              object.sprite.draw(ctx, player, map.roomNum, false, rotationAngle);
            }

            const objectNicknameContainer = document.getElementById(
              `${object.nickname}`
            );
            // console.dir(objectNicknameContainer);
            if (!objectNicknameContainer) {
              return;
            }
            objectNicknameContainer.style.top =
              object.y + 225 +
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
        case "e": case "E": case "ㄷ":
          rotationAngle += 1;
          if (rotationAngle > 4) {
            rotationAngle = 1;
          }
          characterRotate(rotationAngle);
          break;
        case "q": case "Q": case "ㅂ":
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
          prevAngle = angle;
          break;
      }
    }
    if (map.roomNum === 3) {
      document.addEventListener("keydown", cameraRotate);
    }

    setTimeout(() => {
      setIsLoading(false);
      startGameLoop();
    }, 3000);
    return () => {
      if (map.roomNum === 3) {
        document.removeEventListener("keydown", cameraRotate);
      }
      isLoop = false;
    };
  }, []);

  return (
    <>
      {isLoading && <LoadingComponent />}
      <GameLayout>
        <div
          ref={containerEl}
          className="game-container"
          style={{ backgroundColor: "rgb(19,19,20)", width: "100vw", height: "100vh" }}
        >
          <canvas ref={canvasRef} className="game-canvas">
          </canvas>
        </div>
      </GameLayout>
    </>
  );
};

export default Overworld1;
