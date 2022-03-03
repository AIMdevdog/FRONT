import { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Person } from "../game/Person";
import React from "react";
import RoomSideBar from "../components/RoomSidebar";
import styled from "styled-components";
import VideoButton from "../components/VideoButton";
import { connect } from "react-redux";
import { joinUser, updateLocation } from "../utils/game/character";
import { io } from "socket.io-client";
import _const from "../config/const";
import Overworld1 from "../game/Overworld1";
import Gallery2 from "../components/Gallery2";

const pexel = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;
const GOLDENRATIO = 1.61803398875;

const images = [
  {
    position: [-11 * GOLDENRATIO + 1.17, 0.018, -3.5],
    rotation: [0, Math.PI / 4, 0],
    url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/city-3021474+3.png",
  },
  {
    position: [0.5, 0, -9],
    rotation: [0, 0, 0],
    url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/city-3021474+4.png",
    middle: "middle",
  },
  {
    position: [11 * GOLDENRATIO - 0.17, 0.018, -3.5],
    rotation: [0, -Math.PI / 4, 0],
    url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/city-3021474+2.png",
  },
  {
    position: [0, 13, -5],
    rotation: [-Math.PI / 2, 0, 0],
    url: pexel(4175054),
    ceil: "ceil",
  },
  {
    position: [25, 0, 9.5],
    rotation: [0, Math.PI / 2, 0],
    url: pexel(2860810),
  },
  {
    position: [-24, 0, 9.5],
    rotation: [0, -Math.PI / 2, 0],
    url: pexel(3156125),
  }
];

const StreamsContainer = styled.div`
  position: fixed;
  display: flex;
  left: 50%;
  top: 60px;
  width: 20%;
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
const ThreeCanvas = styled.div`
  display:block;
  canvas {
    width: 100vw;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
`;

const Room2 = ({ userData }) => {
  const charMap = {};
  const params = useParams();
  const roomId = params.roomId;
  const [socket, setSocket] = useState(null);

  const [nicknames, setNicknames] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  const [isCharacter, setIsCharacter] = useState([]);
  const [isUser, setUser] = useState(null);

  const url = `/room/${roomId}`;

  const [cameraPosition, setCameraPosition] = useState(0);
  const [yCameraPosition, setYCameraPosition] = useState(0);

  useEffect(() => {
    userData.then((data) => {
      setUser(data);
      setSocket(io(_const.HOST));
    });
  }, []);

  useEffect(() => {
    if (isUser && socket) {
      socket.on("join_user", function () {
        console.log("새로운 유저 접속");
        socket.emit("send_user_info", {
          src: isUser.character,
          x: 80,
          y: 80,
          nickname: isUser.nickname,
          roomId: "room1" + roomId,
        });
      });

      socket.on("get_user_info", function (data) {
        const user = joinUser(data.id, data.x, data.y, data.nickname, data.src);
        user.sprite.yaxios = 350;
        user.directionUpdate = {
          up: ["y", -4],
          down: ["y", 4],
          left: ["x", -4],
          right: ["x", 4],
        };
        setIsCharacter((prev) => [...prev, user]);
        charMap[data.id] = user;
        setNicknames((prev) => [...prev, data.nickname]);
      });

      socket.on("leave_user", function (data) {
        setIsCharacter((prev) => prev.filter((char) => char.id !== data.id));
        setNicknames((prev) =>
          prev.filter((nickname) => nickname !== data.nickname)
        );
        delete charMap[data.id];
      });

      socket.on("update_state", function (data) {
        Object.values(charMap).forEach((character, i) => {
          updateLocation(data[i], character, socket.id);
        });
      });
    }
  }, [isUser, socket]);

  const room = {
    RoomSrc: null,
    roomNum: 2,
    gameObjects: {
      player: new Person({
        id: null,
        isPlayerControlled: true,
        x: 80,
        y: 80,
        src:
          isUser?.character ||
          "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-MPN2TapcbBVMdbCP0jR6.png",
      }),
    },
  };
  const otherMaps = [
    {
      x: 16,
      y: 448,
      url: `/room3/${roomId}`,
    },
  ];

  return (
    <>
      <div className="roomContainer" style={{ display: "flex", height: "100vh" }}>
        {socket ? (
          <>
            <RoomSideBar
              socket={socket}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              characters={isCharacter}
            />
            <Overworld1
              Room={room}
              url={url}
              otherMaps={otherMaps}
              charMap={charMap}
              socket={socket}
              setCameraPosition={setCameraPosition}
              setYCameraPosition={setYCameraPosition}
            />
            <ThreeCanvas className="gallery">
              <Suspense fallback={null}>
                <Gallery2 images={images} roomId={roomId} cameraPosition={cameraPosition} yCameraPosition={yCameraPosition} />
              </Suspense>
            </ThreeCanvas>
            {/* <CharacterNickname nicknames={nicknames} /> */}
          </>
        ) : null}
      </div>

      <StreamsContainer id="streams"></StreamsContainer>
      <MyVideoBox>
        <MyVideo id="myFace" autoPlay="autoplay"></MyVideo>
        <CamBtn id="camBtn">
          <VideoButton />
        </CamBtn>
      </MyVideoBox>
      {/* <ScreenBottomBar /> */}
    </>
  );
};

function mapStateProps(state) {
  return {
    userData: state,
  };
}

export default connect(mapStateProps)(Room2);