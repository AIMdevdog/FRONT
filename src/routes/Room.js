import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Overworld from "../game/Overworld";
import { Person } from "../game/Person";
import React from "react";
import RoomSideBar from "../components/RoomSidebar";
import styled from "styled-components";
import VideoButton from "../components/VideoButton";
import { connect } from "react-redux";
import ScreenBottomBar from "../components/ScreenBottomBar";
import PictureFrame from "../components/pictureFrame"
import { joinUser, updateLocation } from "../utils/game/character";
import { io } from "socket.io-client";
import _const from "../config/const";
import CharacterNickname from "../components/CharacterNickname";

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

const Room = ({ userData }) => {
  const charMap = {};
  const [socket, setSocket] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const roomId = params.roomId;
  const url = "/lobby";
  const [nicknames, setNicknames] = useState([]);
  const [openDraw, setOpenDraw] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const [isCharacter, setIsCharacter] = useState([]);

  const [isUser, setUser] = useState(null);
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
          x: 1552,
          y: 1424,
          nickname: isUser.nickname,
          roomId: "room" + roomId,
        });
      });

      socket.on("get_user_info", function (data) {
        const user = joinUser(data.id, data.x, data.y, data.nickname, data.src);
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
    RoomSrc:
      "https://aim-front.s3.ap-northeast-2.amazonaws.com/aim-map.png",
    roomNum: 0,
    gameObjects: {
      player: new Person({
        id: null,
        isPlayerControlled: true,
        x: 1552,
        y: 1424,
        src:
          isUser?.character ||
          "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-MPN2TapcbBVMdbCP0jR6.png",
      }),
    },
  };

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
              roomId={roomId}
              charMap={charMap}
              socket={socket}
              openDraw={openDraw}
            />
            <CharacterNickname nicknames={nicknames} />
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
            <Overworld
              setOpenDraw={setOpenDraw}
              Room={room}
              adjust={adjust}
              otherMaps={otherMaps}
              charMap={charMap}
              socket={socket}
              openDraw={openDraw}
            />
            <CharacterNickname nicknames={nicknames} />
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
      {/* <div id="share" style={{position: 'absolute', top: 0, right: 0}}>
          <button>share</button>
        </div> */}
    </>
  );
};

function mapStateProps(state) {
  return {
    userData: state,
  };
}


export default connect(mapStateProps)(Room);
