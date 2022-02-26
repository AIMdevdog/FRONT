import { useEffect, useState } from "react";
import { useParams } from "react-router";
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
import { connect } from "react-redux";
import ScreenBottomBar from "../components/ScreenBottomBar";
import PictureFrame from "../components/pictureFrame";
import { user } from "../config/api";
import { joinUser, leaveUser, updateLocation } from "../utils/game/character";
import { io } from "socket.io-client";
import _const from "../config/const";
import { DirectionInput } from "../game/DirectionInput";

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

const CharacterNickname = styled.div`
  span {
    color: white;
  }
`;
// const ShareArt = styled.div`
//   div{
//     position: fixed;
//     width: 500px;
//     height: 500px;
//     background-color: red;
//     left: 30%;
//     top: 30%;
//   }
// `;

// const Draw = styled.div`
//   position: fixed;
//   width: 500px;
//   height: 500px;
//   background-color: red;
//   left: 30%;
//   top: 30%;
// `;

const Room = ({ userData }) => {
  const characters = [];
  const charMap = {};
  const [socket, setSocket] = useState(null);
  const params = useParams();
  const roomId = params.roomId;
  const url = "http://localhost:3000/lobby";
  const nicknameContainer = document.querySelector(".nickname");

  const [openDraw, setOpenDraw] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const [isCharacter, setIsCharacter] = useState([]);

  const [isUser, setUser] = useState(null);

  useEffect(() => {
    userData.then((data) => {
      setUser(data);
      setSocket(io(_const.HOST));
    });
    return () => {
      console.log("room leave!!");
    };
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
          roomId: "room" + roomId,
        });
      });

      socket.on("get_user_info", function (data) {
        // console.log(data);
        const user = joinUser(data.id, data.x, data.y, data.nickname, data.src);
        // characters.push(user);
        // setIsCharacter([...isCharacter, user]);
        setIsCharacter((prev) => [...prev, user]);

        charMap[data.id] = user;

        // const nicknameDiv = document.createElement("div");
        // nicknameDiv.id = data.nickname;
        // nicknameDiv.innerHTML = data.nickname;

        // nicknameDiv.style.width = 100;
        // nicknameDiv.style.transform = "translateX(-40%)";
        // nicknameDiv.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
        // nicknameDiv.style.padding = "6px";
        // nicknameDiv.style.borderRadius = "6px";
        // nicknameDiv.style.color = "white";
        // nicknameDiv.style.fontSize = "12px";
        // nicknameDiv.style.textAlign = "center";
        // nicknameDiv.style.position = "absolute";

        // nicknameContainer.appendChild(nicknameDiv);

        // user list
        // if (data.isShareCollapsed) {
        //   const userList = document.querySelector(".user-list");

        //   userListItem = document.createElement("li");
        //   userNicknameSpan = document.createElement("span");
        //   userImg = document.createElement("img");
        //   userInfoDiv = document.createElement("div");
        //   shareInput = document.createElement("input");
        //   onOffButton = document.createElement("p");

        //   userImg.src = data.src;
        //   userListItem.className = data.id;
        //   userNicknameSpan.innerHTML = data.nickname;
        //   shareInput.type = "checkbox";
        //   shareInput.className = "share-checkbox";
        //   shareInput.name = "share-checkbox-name";
        //   shareInput.value = data.id;

        // userInfoDiv.appendChild(userImg);
        // userInfoDiv.appendChild(userNicknameSpan);
        // userListItem.appendChild(userInfoDiv);
        // userListItem.appendChild(onOffButton);

        // if (socket.id !== data.id) {
        //   // userListItem.appendChild(shareInput);
        // }

        // userList.appendChild(userListItem);
        // }
      });

      socket.on("leave_user", function (data) {
        leaveUser(data, charMap, isCharacter);
      });

      socket.on("update_state", function (data) {
        updateLocation(data, charMap, isCharacter, socket.id);
      });
    }
  }, [isUser, socket]);

  const room = {
    RoomSrc:
      "https://aim-image-storage.s3.ap-northeast-2.amazonaws.com/map2.png",
    roomNum: 0,
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
  const adjust = {
    xaxios: 0,
    yaxios: 0,
    yratio: 1,
  };
  const otherMaps = [
    {
      x: 16,
      y: 448,
      url: `http://localhost:3000/room3/${roomId}`,
      // url: "/room1",
    },
  ];

  // const isOpenPicture = () => {

  // const directionInput = new DirectionInput();
  // directionInput.init();

  // const keydownHandler = (e) => {
  //   const player = charMap[socket?.id];
  //   if (
  //     (e.key === "x" || e.key === "X" || e.key === "ㅌ") &&
  //     player.x === 48 &&
  //     player.y === 48
  //   ) {
  //     setOpenDraw((prev) => !prev);
  //   } else if (directionInput.direction) {
  //     setOpenDraw(false);
  //   }
  // };
  // document.addEventListener("keydown", (e) => {
  //   keydownHandler(e);
  // });

  // }

  console.log(characters);

  return (
    <>
      <div className="roomContainer" style={{ display: "flex" }}>
        {socket ? (
          <>
            {openDraw ? (
              <div id="Arts">
                <PictureFrame collapsed={collapsed} socket={socket} />
              </div>
            ) : null}
            <Overworld
              setOpenDraw={setOpenDraw}
              Room={room}
              adjust={adjust}
              otherMaps={otherMaps}
              charMap={charMap}
              characters={characters}
              socket={socket}
            />
            <RoomSideBar
              url={url}
              socket={socket}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              setOpenDraw={setOpenDraw}
              charMap={charMap}
              characters={isCharacter}
              openDraw={openDraw}
            />
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
      <ScreenBottomBar />
      <ScreenBottomBar />
      {/* <div id="share" style={{position: 'absolute', top: 0, right: 0}}>
          <button>share</button>
        </div> */}
    </>
  );
};

function cursorPosition() {
  var e = window.event;

  var posX = e.clientX;
  var posY = e.clientY;
}

function mapStateProps(state) {
  return {
    userData: state,
  };
}

export default connect(mapStateProps)(Room);
