import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import Overworld from "../game/Overworld";
import { Person } from "../game/Person";
import React from "react";
import RoomSideBar from "../components/RoomSidebar";
import styled from "styled-components";
import VideoButton from "../components/VideoButton";
import { connect } from "react-redux";
import PictureFrame from "../components/pictureFrame";
import { joinUser, updateLocation } from "../utils/game/character";
import { io } from "socket.io-client";
import _const from "../config/const";
import CharacterNickname from "../components/CharacterNickname";
import LoadingComponent from "../components/Loading.js";
import PptSlider from "../components/pptSlider";
import { user } from "../config/api";
import VisitorsBook from "../components/VisitorBook";
import ExhibitionGuide from "../components/ExhibitionGuide";
import mapImage from "../assets/images/game/mapImage.png";

const MyVideoNickname = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  display: inline;
  background-color: rgb(0, 0, 0, 0.6);
  padding: 5px;
  border-radius: 10px;
  color: white;
  z-index: 10;
`;

const MyVideoBox = styled.div`
  position: absolute;
  right: 30px;
  bottom: 20px;
  width: 200px;
  z-index: 90;
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

const cameraConstraints = {
  audio: true,
  video: true,
};

const Room = ({ userData }) => {
  const charMap = {};
  const [socket, setSocket] = useState(null);
  const params = useParams();
  const location = useLocation();
  const roomId = params.roomId;
  const url = "/lobby";
  const [nicknames, setNicknames] = useState([]);

  const [openDraw, setOpenDraw] = useState(0);

  const [collapsed, setCollapsed] = useState(true);

  const [openPPT, setOpenPPT] = useState(false);
  const [openVisitorsBook, setIsOpenVisitorsBook] = useState(false);

  const [openGuide, setOpenGuide] = useState(0);


  const ppt1Imgs = [
    "https://aim-front.s3.ap-northeast-2.amazonaws.com/2.jpeg",
    "https://aim-front.s3.ap-northeast-2.amazonaws.com/3.jpeg",
    "https://aim-front.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  ];
  const [isCharacter, setIsCharacter] = useState([]);
  const [isUser, setUser] = useState(null);
  const [myStream, setMyStream] = useState(null);

  const room = {
    RoomSrc: mapImage,
    // "https://aim-front.s3.ap-northeast-2.amazonaws.com/new_map.png",
    roomNum: 0,
    gameObjects: {
      player: new Person({
        id: null,
        isPlayerControlled: true,
        x: 1183,
        y: 1072,
        src:
          isUser?.character ||
          "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-MPN2TapcbBVMdbCP0jR6.png",
      }),
    },
    walls: {
      [`1287,976`]: true,
      [`1255,432`]: true,
      [`935,528`]: true,
      [`551,752`]: true,

    }
  };

  useEffect(async () => {
    setMyStream(await navigator.mediaDevices.getUserMedia(cameraConstraints));
    const getUser = async () => {
      try {
        const requestUserData = await user.getUserInfo();
        const {
          data: { result },
        } = requestUserData;
        if (result) {
          setUser(result);
          setSocket(io(_const.HOST));
        }
      } catch (e) {
        console.log(e);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    if (isUser && socket) {
      socket.on("join_user", function () {
        console.log("새로운 유저 접속");
        socket.emit("send_user_info", {
          src:
            isUser?.character ||
            "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-MPN2TapcbBVMdbCP0jR6.png",
          x: location.state.x,
          y: location.state.y,
          nickname: isUser?.nickname,
          roomId: "room/" + roomId,
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
          // console.log(data[i]);
          updateLocation(data[i], character, socket.id);
        });
      });
    }
  }, [isUser, socket]);

  const openDrawFuction = (openDraw) => {
    switch (openDraw) {
      case 1:
        return <PictureFrame socket={socket} drawNum={1} />;
      case 2:
        return <PictureFrame socket={socket} drawNum={2} />;
      case 3:
        return <PictureFrame socket={socket} drawNum={3} />;
      case 4:
        return <PictureFrame socket={socket} drawNum={4} />;
      case 5:
        return <PictureFrame socket={socket} drawNum={5} />;
      default:
        return null;
    }
  }

  const openGuideFuction = (openGuide) => {
    switch (openGuide) {
      case 1:
        return <ExhibitionGuide title="안녕" description="안녕하세요1" />;
      case 2:
        return <ExhibitionGuide title="안녕" description="안녕하세요2" />;
      case 3:
        return <ExhibitionGuide title="안녕" description="안녕하세요3" />;
      default:
        return null;
    }
  }
  return (
    <>
      <div className="roomContainer" style={{ display: "flex" }}>
        {socket && myStream ? (
          <>
            {openPPT ? <PptSlider pptImgs={ppt1Imgs} /> : null}
            {/* {openPPT2 ? <PptSlider pptImgs={ppt2Imgs} /> : null} */}
            {openVisitorsBook ? <VisitorsBook isUser={isUser} /> : null}
            <RoomSideBar
              url={url}
              socket={socket}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              setOpenDraw={setOpenDraw}
              charMap={charMap}
              characters={isCharacter}
              openDraw={openDraw}
              myStream={myStream}
            />
            {/* 그림창 열기 */}
            {openDrawFuction(openDraw)}
            {openGuideFuction(openGuide)}
            {/* {openGuide1 ? (
              <ExhibitionGuide title="안녕" description="안녕하세요" />
            ) : null}
            {openGuide2 ? (
              <ExhibitionGuide title="안녕" description="안녕하세요" />
            ) : null}
            {openGuide3 ? (
              <ExhibitionGuide title="안녕" description="안녕하세요" />
            ) : null} */}
            <CharacterNickname nicknames={nicknames} />
            <Overworld
              myStream={myStream}
              setOpenDraw={setOpenDraw}
              roomId={roomId}
              Room={room}
              charMap={charMap}
              characters={isCharacter}
              socket={socket}
              setOpenPPT={setOpenPPT}
              setIsOpenVisitorsBook={setIsOpenVisitorsBook}
              setOpenGuide={setOpenGuide}
            />
          </>
        ) : (
          <LoadingComponent />
        )}
      </div>

      {/* <StreamsContainer id="streams"></StreamsContainer> */}
      <MyVideoBox>
        <MyVideo id="myFace" autoPlay="autoplay"></MyVideo>
        <CamBtn id="camBtn">
          <VideoButton />
        </CamBtn>
        <MyVideoNickname>{isUser?.nickname}</MyVideoNickname>
      </MyVideoBox>
    </>
  );
};

function mapStateProps(state) {
  return {
    userData: state,
  };
}

export default connect(mapStateProps)(Room);
