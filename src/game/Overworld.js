import { OverworldMap } from "./OverworldMap.js";
import { DirectionInput } from "./DirectionInput.js";
import utils from "./utils.js";
import _const from "../config/const.js";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { throttle } from "lodash";
import { cloneDeep } from "lodash";

const StreamsContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 64px;
  top: 20px;
  width: 100%;
  z-index: 1;

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

let producer;

const Overworld = ({
  myStream,
  setOpenDraw,
  Room,
  roomId,
  charMap,
  socket,
  setOpenPPT,
  setIsOpenVisitorsBook,
  setOpenGuide,
}) => {
  const mediasoupClient = require("mediasoup-client");
  const containerEl = useRef();
  const canvasRef = useRef();
  const navigate = useNavigate();
  let reduplication = []; //해결하고 지울게요 ㅜㅜ
  let audio_reduplication = []; //해결하고 지울게요 ㅜㅜ
  const directionInput = new DirectionInput();
  directionInput.init();

  const map = new OverworldMap(Room);

  let closer = 0;
  const mediaOff = () => {
    myStream.getTracks().forEach((track) => track.stop());
  };

  const socketDisconnect = async () => {
    mediaOff();
    socket.close();
  };

  useEffect(() => {
    const keydownHandler = (e) => {
      if (e.key !== "x" && e.key !== "X" && e.key !== "ㅌ" && !directionInput.direction) {
        return;
      }
      const player = charMap[socket.id];
      if (player.y === 880 && !directionInput.direction) {
        if (player.x === 695 || player.x === 727 || player.x === 759) {
          console.log("openDraw1");
          setOpenDraw((prev) => {
            if (prev) {
              socket.emit("closeDraw", player.nickname, 1);
              return 0;
            } else {
              socket.emit("openDraw", socket.id, 1);
              return 1;
            }
          });
        } else if (player.x === 823 || player.x === 855) {
          console.log("openDraw2");
          setOpenDraw((prev) => {
            if (prev) {
              socket.emit("closeDraw", player.nickname, 2);
              return 0;
            } else {
              socket.emit("openDraw", socket.id, 2);
              return 2;
            }
          });
        } else if (player.x === 919 || player.x === 951 || player.x === 983) {
          console.log("openDraw3");
          setOpenDraw((prev) => {
            if (prev) {
              socket.emit("closeDraw", player.nickname, 3);
              return 0;
            } else {
              socket.emit("openDraw", socket.id, 3);
              return 3;
            }
          });
        } else if (player.x === 1047 || player.x === 1079 || player.x === 1111) {
          console.log("openDraw4");
          setOpenDraw((prev) => {
            if (prev) {
              socket.emit("closeDraw", player.nickname, 4);
              return 0;
            } else {
              socket.emit("openDraw", socket.id, 4);
              return 4;
            }
          });
        } else if (player.x === 1175 || player.x === 1207 || player.x === 1239) {
          console.log("openDraw5");
          setOpenDraw((prev) => {
            if (prev) {
              socket.emit("closeDraw", player.nickname, 5);
              return 0;
            } else {
              socket.emit("openDraw", socket.id, 5);
              return 5;
            }
          });
        }
      } else if (
        player.x === 1655 &&
        player.y === 1328 && !directionInput.direction
      ) {
        setOpenPPT((prev) => !prev);
      } else if (
        player.x === 1431 &&
        player.y === 784 && !directionInput.direction
      ) {
        setIsOpenVisitorsBook((prev) => !prev);
      } else if (
        player.x === 1303 &&
        player.y === 880 && !directionInput.direction
      ) {
        setOpenGuide((prev) => {
          if (prev) {
            return 0;
          } else {
            return 1;
          }
        });
      } else if (
        player.x === 919 &&
        player.y === 1040 && !directionInput.direction
      ) {
        setOpenGuide((prev) => {
          if (prev) {
            return 0;
          } else {
            return 2;
          }
        });
      } else if (
        player.x === 1623 &&
        player.y === 784 && !directionInput.direction
      ) {
        setOpenGuide((prev) => {
          if (prev) {
            return 0;
          } else {
            return 3;
          }
        });
      } else {
        setOpenPPT(false);
        setOpenGuide(0);
        setIsOpenVisitorsBook(false);
        setOpenDraw((prevNum) => {
          if (prevNum) {
            socket.emit("closeDraw", player.nickname, prevNum);
          }
          return 0;
        });
      }
    };
    const throttleKeydownHanler = throttle(keydownHandler, 100);
    window.addEventListener("popstate", socketDisconnect);
    window.addEventListener("keydown", throttleKeydownHanler);
    return () => {
      window.removeEventListener("popstate", socketDisconnect);
      window.removeEventListener("keydown", throttleKeydownHanler);
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
    };
    let audioConstraints = {
      audio: true,
      video: false,
    };

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
    let consumer;
    let isProducer = false;

    initCall();

    // async function handleAddStream(event, remoteSocketId) {
    //   const peerStream = event.stream;
    //   // console.log(peerStream);
    //   const user = charMap[remoteSocketId]; // person.js에 있는 거랑 같이
    //   // console.log("haddleAddStream USER: ", user);
    //   if (!user.isUserJoin) {
    //     // 유저가 어떤 그룹에도 속하지 않을 때 영상을 키겠다
    //     user.isUserJoin = true;
    //     try {
    //       await paintPeerFace(peerStream, remoteSocketId);
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   }
    // }
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

    async function removeAudio(peerStream, socketId) { }
    // 영상 connect
    async function paintPeerFace(peerStream, socketId) {
      console.log(`socketID ${socketId} peer의 vidoe 태그 생성`);
      const user = charMap[socketId];
      const streamContainer = document.querySelector(".streams-container");
      const div = document.createElement("div");
      const nicknameDiv = document.createElement("div");
      nicknameDiv.className = "videoNickname";
      nicknameDiv.innerText = user.nickname;
      console.log(user.nickname)
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

    // async function createConnection(remoteSocketId, remoteNickname) {
    //   try {
    //     const myPeerConnection = new RTCPeerConnection({
    //       iceServers: [
    //         {
    //           urls: [
    //             "stun:stun.l.google.com:19302",
    //             "stun:stun1.l.google.com:19302",
    //             "stun:stun2.l.google.com:19302",
    //             "stun:stun3.l.google.com:19302",
    //             "stun:stun4.l.google.com:19302",
    //           ],
    //         },
    //       ],
    //     });
    //     myPeerConnection.addEventListener("icecandidate", async (event) => {
    //       try {
    //         await handleIce(event, remoteSocketId, remoteNickname);
    //       } catch (e) {
    //         console.log(e);
    //       }
    //       // console.log("+------Ice------+");
    //     });
    //     myPeerConnection.addEventListener("addstream", async (event) => {
    //       try {
    //         await handleAddStream(event, remoteSocketId, remoteNickname);
    //       } catch (err) {
    //         console.error(err);
    //       }
    //       // console.log("+------addstream------+");
    //     });

    //     // console.log("+------before getTracks------+");
    //     myStream
    //       .getTracks()
    //       .forEach((track) => myPeerConnection.addTrack(track, myStream));
    //     // console.log("+------getTracks------+", myStream);

    //     pcObj[remoteSocketId] = myPeerConnection;

    //     ++peopleInRoom;
    //     // sortStreams();
    //     return myPeerConnection;
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }

    // function handleIce(event, remoteSocketId, remoteNickname) {
    //   if (event.candidate) {
    //     socket.emit("ice", event.candidate, remoteSocketId, remoteNickname);
    //   }
    // }

    // async function handleScreenSharing() {
    //   try {
    //     console.log("handleScreenSharing 실행");
    //     await getMedia(true);
    //     const peerConnectionObjArr = Object.values(pcObj);
    //     if (peerConnectionObjArr.length > 0) {
    //       const newVideoTrack = myStream.getVideoTracks()[0];
    //       peerConnectionObjArr.forEach((peerConnection) => {
    //         console.log("peerConnection", peerConnection);
    //         const peerVideoSender = peerConnection
    //           .getSenders()
    //           .find((sender) => sender.track.kind === "video");
    //         peerVideoSender.replaceTrack(newVideoTrack);
    //       });
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    // async function closeScreenSharing() {
    //   try {
    //     console.log("closeScreenSharing 실행");
    //     await getMedia(false);
    //     const peerConnectionObjArr = Object.values(pcObj);
    //     if (peerConnectionObjArr.length > 0) {
    //       const newVideoTrack = myStream.getVideoTracks()[0];
    //       peerConnectionObjArr.forEach((peerConnection) => {
    //         console.log("peerConnection", peerConnection);
    //         const peerVideoSender = peerConnection
    //           .getSenders()
    //           .find((sender) => sender.track.kind === "video");
    //         peerVideoSender.replaceTrack(newVideoTrack);
    //       });
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    // const shareBtn = document.querySelector("#shareBtn");
    // const myFaceBtn = document.querySelector("#myFaceBtn");
    // shareBtn.addEventListener("click", handleScreenSharing);
    // myFaceBtn.addEventListener("click", closeScreenSharing);

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

    // var displayMediaOptions = {
    //   video: {
    //     cursor: "always",
    //   },
    //   audio: true,
    // };

    async function getMedia(sharing) {
      const myFace = document.querySelector("#myFace");
      const camBtn = document.querySelector("#camBtn");
      camBtn.style.display = "block";
      if (!sharing) {
        // console.log("mystream", myStream);
        // stream을 mute하는 것이 아니라 HTML video element를 mute한다.
        // video_stream = navigator.mediaDevices.getUserMedia(videoConstraints);
        // audio_stream = navigator.mediaDevices.getUserMedia(audioConstraints);
        myStream // mute default
          .getAudioTracks()
          .forEach((track) => (track.enabled = true));
        const video_track = myStream.getVideoTracks()[0];
        const audio_track = myStream.getAudioTracks()[0];
        myFace.srcObject = new MediaStream([video_track]);
        // myFace.muted = true;
        // myStream // mute default
        //   .getAudioTracks()
        //   .forEach((track) => (console.log("@@@@@@@@@@@@@@@@@ track.enabled", track.enabled)));

        params_audio = {
          track: audio_track,
          ...params_audio,
        };

        params_video = {
          track: video_track,
          ...params_video,
        };
      }
      // console.log("----------- myTrack : ", track);
      // } else {
      //   myStream = await navigator.mediaDevices.getDisplayMedia(
      //     displayMediaOptions
      //   );
      //   // console.log("mystream", myStream);
      //   // stream을 mute하는 것이 아니라 HTML video element를 mute한다.
      //   myFace.srcObject = myStream;
      //   myFace.muted = false;

      //   myStream // mute default
      //     .getAudioTracks()
      //     .forEach((track) => (track.enabled = true));
      // }
    }

    async function initCall() {
      // console.log("initCall 함수");
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
              console.log("-----", socket.id, parameters.kind);
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
                  ({ id, producersExist, kind }) => {
                    // Tell the transport that parameters were transmitted and provide it with the
                    // server side producer's id.
                    callback({ id });

                    // if producers exist, then join room
                    if (producersExist) getProducers(kind);
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

      // producer_audio.on("trackended", () => {
      //   console.log("producer의 trackended 이벤트 실행");

      //   console.log("track ended");

      //   // close video track
      // });

      // producer_audio.on("transportclose", () => {
      //   console.log("producer의 transportclose 이벤트 실행");

      //   console.log("producer");
      //   console.log("transport ended");

      // close video track
      // });
    };

    // server informs the client of a new producer just joined
    socket.on("new-producer", ({ producerId, socketId }) =>
      signalNewConsumerTransport(producerId, socketId)
    );

    const getProducers = (kind) => {
      // console.log("getProducers 실행");
      socket.emit("getProducers", { kind }, (producerIds) => {
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
      console.log("몇번 실행?, signalNewConsumerTransport 실행");
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
      reduplication = reduplication.filter(
        (element) => element !== remoteSocketId
      );
      audio_reduplication = audio_reduplication.filter(
        (element) => element !== remoteSocketId
      );
    });

    // 남는 사람 기준
    socket.on("leave_succ", function (data) {
      console.log("leave_succ");
      const user = charMap[data.removeSid];
      user.isUserJoin = false;
      user.groupName = 0;
      reduplication = reduplication.filter(
        (element) => element !== data.removeSid
      );
      audio_reduplication = audio_reduplication.filter(
        (element) => element !== data.remveSid
      );
      console.log(
        "reduplication video, audio ",
        reduplication,
        audio_reduplication
      );
      // removePeerFace(data.removeSid);
    });

    // socket.on("leave_user", function (data) {
    //   removePeerFace(data.id);
    // });

    socket.on("accept_join", async (groupName) => {
      try {
        // SFU
        charMap[socket.id].groupName = groupName;
        socket.emit("getRtpCapabilities", groupName, (data) => {
          // console.log(`Router RTP Capabilities... ${data.rtpCapabilities}`);
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

    // socket.on("offer", async (offer, remoteSocketId, remoteNickname) => {
    //   try {
    //     const newPC = await createConnection(remoteSocketId, remoteNickname);
    //     await newPC.setRemoteDescription(offer);
    //     const answer = await newPC.createAnswer();
    //     await newPC.setLocalDescription(answer);
    //     socket.emit("answer", answer, remoteSocketId);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // });

    // socket.on("answer", async (answer, remoteSocketId) => {
    //   await pcObj[remoteSocketId].setRemoteDescription(answer);
    // });

    // socket.on("ice", async (ice, remoteSocketId, remoteNickname) => {
    //   await pcObj[remoteSocketId].addIceCandidate(ice);
    // const state = pcObj[remoteSocketId].iceConnectionState;
    // if (state === "failed" || state === "closed") {
    //   const newPC = await createConnection(remoteSocketId, remoteNickname);
    //   const offer = await newPC.createOffer();
    //   await newPC.setLocalDescription(offer);
    //   socket.emit("offer", offer, remoteSocketId, remoteNickname);
    //   console.log("iceCandidate 실패! 재연결 시도");
    // }
    // });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
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
      if (closer < 7){
        if (stay_num > 4) {
          dataBuffer = [];
        }
        if (dataBuffer.length > 4) {
          socket.emit("input", dataBuffer);
          dataBuffer = [];
        }
      }else{
        if (stay_num > 8) {
          dataBuffer = [];
        }
        if (dataBuffer.length > 8) {
          socket.emit("input", dataBuffer);
          dataBuffer = [];
        }        
      }
    };
    for (let i = 631; i < 1272; i += 32) {
      map.walls[`${i},848`] = true
    }
    const startGameLoop = () => {
      console.log("StartGameLoop");
      const step = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;

        //Clear off the canvas
        ctx.clearRect(0, 0, canvas?.width, canvas?.height);

        //Establish the camera person
        const cameraPerson = cloneDeep(charMap[socket.id]) || cloneDeep(map.gameObjects.player);
        if (cameraPerson.x - halfWidth < 23) {
          cameraPerson.x = halfWidth + 23;
        }
        else
          if (cameraPerson.x + halfWidth > 1719) {
            cameraPerson.x = 1719 - halfWidth;
          }
        if (cameraPerson.y - halfHeight < 0) {
          cameraPerson.y = halfHeight;
        } else if (cameraPerson.y + halfHeight > 1232) {
          cameraPerson.y = 1232 - halfHeight;
        }
        const player = charMap[socket.id];
        // console.log(player?.y, cameraPerson.y, halfHeight);

        //Update all objects
        Object.values(charMap).forEach((object) => {
          if (object.id === socket.id) {
            // console.log(object.x, object.y);
            if (object.x >= 951 && object.x <= 1015 && object.y <= 1132) {
              socket.close();
              mediaOff();
              navigate(`/room1/${roomId}`);
            } else if (
              object.x >= 1527 &&
              object.x <= 1591 &&
              object.y >= 736
            ) {
              socket.close();
              mediaOff();
              navigate(`/room2/${roomId}`);
            }
            object.update({
              arrow: directionInput.direction,
              map: map,
            });
          } else {
            const next = object.nextDirection.shift();
            if (next) {
              object.x = next.x;
              object.y = next.y;
            }
            object.update({
              arrow: next?.direction,
              map: map,
            });

            if (
              //기존 !object.isUserCalling에서 아래로 대체함 (전에 groupName 고정되어있을때 사용했었음)
              //그룹이
              !object.isUserCalling &&
              // !object.groupName &&
              Math.abs(player?.x - object.x) < 64 &&
              Math.abs(player?.y - object.y) < 96
            ) {
              //화상 통화 연결
              closer += 1;
              console.log("가까워짐 closer: ", closer);
              player.isUserCalling = true;
              object.isUserCalling = true;
              socket.emit("user_call", {
                caller: player.id,
                callee: object.id,
              });
            }
            if (
              //그룹이 같다.
              object.isUserCalling &&
              // object.groupName &&
              (Math.abs(player?.x - object.x) > 96 ||
                Math.abs(player?.y - object.y) > 128)
            ) {
              closer -= 1;
              console.log("멀어짐 closer: ", closer);
              object.isUserCalling = false;
              object.isUserJoin = false;
            }
          }
        });
        const playercheck = player ? player.isUserCalling : false;
        // console.log("멀어짐 로직 player.socketId", player.socketId,"근처에 있는",closer)
        if (playercheck && closer === 0) {
          // 나가는 사람 기준
          const streamContainer = document.querySelector(".streams-container");
          while (streamContainer.hasChildNodes()) {
            // 내가 가지고있는 다른 사람의 영상을 전부 삭제
            streamContainer.removeChild(streamContainer.firstChild);
          }
          // producer_audio.emit("producerclose");
          producer.emit("producerclose");
          socket.emit("leave_Group", player.id);
          producer.emit("producerclose")
          player.isUserCalling = false;
          player.isUserJoin = false;
          // console.log(`video ${reduplication}, audio ${audio_reduplication}`)
          reduplication = [];
          audio_reduplication = [];
          // console.log(`video ${reduplication}, audio ${audio_reduplication}`)
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
            const x =
              object.x +
              ctx.canvas.clientWidth / 2 -
              cameraPerson.x;
            const y =
              object.y -
              25 +
              ctx.canvas.clientHeight / 2 -
              cameraPerson.y;
            // console.dir(objectNicknameContainer);
            if (!objectNicknameContainer) {
              return;
            }
            if (
              x < 0 ||
              x > window.innerWidth ||
              y < 0 ||
              y > window.innerHeight
            ) {
              objectNicknameContainer.style.left = 0;
              objectNicknameContainer.style.top = 0;
            } else {
              objectNicknameContainer.style.left = x + "px";
              objectNicknameContainer.style.top = y + "px";
            }
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
    startGameLoop();
    return () => {
      isLoop = false;
    };
  }, []);

  return (
    <>
      <div
        ref={containerEl}
        className="game-container"
        style={{ backgroundColor: "black", width: "100vw", height: "100vh" }}
      >
        <canvas ref={canvasRef} className="game-canvas"></canvas>
      </div>
      <StreamsContainer id="streams">
        <div className="streams-container"></div>
      </StreamsContainer>
    </>
  );
};
export default Overworld;
