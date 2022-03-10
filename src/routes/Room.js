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
    "https://aim-front.s3.ap-northeast-2.amazonaws.com/info1.png"
  ];
  const [isCharacter, setIsCharacter] = useState([]);
  const [isUser, setUser] = useState(null);
  const [myStream, setMyStream] = useState(null);

  const room = {
    RoomSrc: "https://aim-front.s3.ap-northeast-2.amazonaws.com/new_map.png",
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
      [`1655,1296`]: true,
      [`1623,752`]: true,
      [`1431,752`]: true,
      [`919,1072`]: true,

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
  const socketJoinUser = () => {
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
  }
  useEffect(() => {
    if (isUser && socket) {
      socket.on("join_user", socketJoinUser);

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
    const Guide = [
      {
        title: "1층 전시관 이용 방법",
        description: ["'X' 버튼을 작품 앞에서 클릭하면 그림을 크게 볼 수 있습니다.", "그림을 감상하는 중에는 좌측 바에 있는 화살표 아이콘을 클릭하시고 원하는 유저를 선택 후 공유하기 버튼을 누르면 해당 유저와 그림을 공유하게 되고 공유 중에는 서로의 마우스 위치가 보이게 됩니다."],
      },
      {
        title: "파노라마 전시관 이용 방법",
        description: [
          "파노라마 관은 거대한 크기의 작품을 전시하기 위한 방입니다.",
          "조작방법",
          "A : 좌로 회전  D : 우로 회전  W: 카메라 시점 위로 이동  S: 카메라 시점 아래로 이동",
          "↑: 앞으로 이동  ↓ : 뒤로 이동  ←: 왼쪽으로 이동  →: 오른쪽으로 이동 ",
        ],
        drawing: [
          "작품명: 수련 : 구름 (Les Nymphéas : les Nuages)",
          "작가 : 모네",
          "작품설명: 이 그림은 거대한 화폭을 자랑하는데, 그만큼 모네의 작업은 대담하고 자유로웠다는 것을 방증한다. 모네가 큰 화폭을 선택한 까닭은 실물 크기로 수련을 그리기 위한 것이었다. 즉, 보이는 그대로 수련을 물감의 재료성으로 옮겨놓고자 한 것이다. ‘수련' 연작은 파노라마처럼 현실의 세계를 재현하고, 다양한 기법을 실험했는데, 이러한 방식의 표현으로 인해 작품을 마주하는 관객은 파노라마 안에서 모네의 수련 정원을 통해 걷는 듯한 환영을 경험하게 된다."
        ]
      },
      {
        title: "3D 전시관 이용 방법",
        description: ["3D관은 사용자에게 실제 전시공간과 유사한 경험을 제공해주기 위해 만들어진 공간입니다.", "조작방법", "Q : 좌측 화면 전환, E : 우측 화면 전환", "← ↑ → ↓ : 캐릭터 조작"],
      },
    ]

    if (openGuide) {
      return <ExhibitionGuide
        title={Guide[openGuide - 1].title}
        description={Guide[openGuide - 1].description}
        drawing={Guide[openGuide - 1].drawing}
      />;
    } else {
      return null;
    }
    // switch (openGuide) {
    //   case 1:
    //     return ;
    //   case 2:
    //     return <ExhibitionGuide title="안녕2" description="안녕하세요2" />;
    //   case 3:
    //     return <ExhibitionGuide title="안녕3" description="안녕하세요3" />;
    //   default:
    //     return null;
    // }
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
