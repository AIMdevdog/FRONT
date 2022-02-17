import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Overworld from "../game/Overworld";
import { Person } from "../game/Person";
import React from "react";
import Aside from "../components/Mainside";
import RoomSideBar from "../components/RoomSidebar";
import Header from "../components/Header";

import styled from "styled-components";

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
`;

const MyVideo = styled.video`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */
`;

const Room = () => {
  const location = useLocation();
  // const { state } = location;
  const urlStr = window.location.href;
  const url = new URL(urlStr);
  const urlParams = url.searchParams;
  const src = urlParams.get("src");
  const [isState, setIsState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    src ||
    location.state.isCurrentImg ||
    "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-sb7g6nQb3ZYxzNHryIbM.png";
  useEffect(() => {
    Overworld({
      config: document.querySelector(".game-container"),
      Room: {
        RoomSrc:
          "https://aim-image-storage.s3.ap-northeast-2.amazonaws.com/map2.png",
        id: 123,
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
        </div>
      </div>
      <StreamsContainer id="streams"></StreamsContainer>
      <MyVideoBox>
        <MyVideo id="myFace" autoPlay="autoplay"></MyVideo>
      </MyVideoBox>
    </>
  );
};

export default Room;
