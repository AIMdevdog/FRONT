import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import Overworld from "../game/Overworld";
import { Person } from "../game/Person";
import React from "react";
import {
  FaVideoSlash,
  FaVideo,
  FaVolumeUp,
  FaVolumeMute,
  FaVolumeOff,
} from "react-icons/fa";
import RoomSideBar from "../components/RoomSidebar";

import styled from "styled-components";
import VideoButton from "../components/VideoButton";

const StreamsContainer = styled.div`
  position: fixed;
  display: flex;
  left: 0;
  top: 60px;
  width: 100%;
  height: 100px;
  justify-content: center;
  align-items: center;

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
  }
`;

const MyVideoBox = styled.div`
  position: absolute;
  right: 30px;
  bottom: 20px;
  width: 200px;
  z-index: 99;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
  }
`;

const MyVideo = styled.video`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */
`;

const CamBtn = styled.div`
  /* display: none;
  position: relative;
  justify-content: space-between;
  padding: 0 20px; */
  padding: 0 20px;
  width: 100%;
  position: absolute;
  display: flex;
  height: 98%;
  right: 0;
  top: 0;
  background: black;
  border-radius: 10px;
  opacity: 0;
  &:hover {
    opacity: 0.8;
  }

  button {
    position: absolute;
    /* width: 40%;
    bottom: 10px; */
    border-radius: 50%;
    /* border: 1px solid red; */
    background-color: transparent;

    &:hover {
      cursor: pointer;
      opacity: 0.5;
    }
  }

  .voice-feature {
    left: 50%;
  }
`;

const CharacterNickname = styled.div`
  span {
    color: white;
  }
`;

const Room = () => {
  const location = useLocation();
  const [isVoice, isSetVoice] = useState(false);
  const [isCamera, isSetCamera] = useState(false);
  // const { state } = location;
  // const urlStr = window.location.href;
  // const url = new URL(urlStr);
  // const urlParams = url.searchParams;
  // const src = urlParams.get("src");
  // const [isState, setIsState] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);

  // useState(() => {
  //   setIsLoading(true);
  //   const RoomInint = () => {
  //     setIsState(location?.state);
  //   };

  //   RoomInint();
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
  // }, []);

  const charSrc =
    location.state.isCurrentImg ||
    "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-MPN2TapcbBVMdbCP0jR6.png";
  useEffect(() => {
    Overworld({
      config: document.querySelector(".game-container"),
      nickname: location.state.nickname,
      Room: {
        RoomSrc:
          "https://aim-image-storage.s3.ap-northeast-2.amazonaws.com/map2.png",
        // "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/D2KjI21f5Kbh2IkF/3vfdF7s7Bjw3bJhuuecvDt",
        roomId: location.pathname,
        roomNum: 0,
        gameObjects: {
          player: new Person({
            id: null,
            isPlayerControlled: true,
            x: 80,
            y: 80,
            src: charSrc,
          }),
        },
      },
      adjust: {
        xaxios: 0,
        yaxios: 0,
        yratio: 1,
      },
      otherMaps: [
        {
          x: 16,
          y: 448,
          // url: "http://localhost:3000/room1",
          url: "/room1",
        },
      ],
    });
    // overworld.init();
  });

  return (
    <>
      <div style={{ display: "flex" }}>
        <RoomSideBar />
        <div className="game-container" style={{ backgroundColor: "black" }}>
          <canvas className="game-canvas"></canvas>
          <CharacterNickname className="nickname">
            {/* <span className="nickname"></span> */}
          </CharacterNickname>
        </div>
      </div>
      <StreamsContainer id="streams"></StreamsContainer>
      <MyVideoBox>
        <MyVideo id="myFace" autoPlay="autoplay"></MyVideo>
        <CamBtn id="camBtn">
          <VideoButton />
        </CamBtn>
      </MyVideoBox>
    </>
  );
};

export default Room;
