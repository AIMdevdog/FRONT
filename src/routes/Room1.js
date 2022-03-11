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
import LoadingComponent from "../components/Loading.js";
import ThreeCanvas from "../components/ThreeCanvas";
import { user } from "../config/api";

const pexel = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;
const GOLDENRATIO = 1.61803398875;

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



const cameraConstraints = {
  audio: true,
  video: true,
};

//ceil
const ceil = [
  {
    position: [12, 5.7, 3],
    rotation: [-Math.PI / 2, 0, 0],
    url: pexel(4175054),
    ceil: "ceil",
  },
];

const images = [
  //BACK right
  [
    {
      position: [0, 0, 10 * GOLDENRATIO],
      rotation: [0, 0, 0],
      url: pexel(695644),
      wall: "wall",
    },
    {
      position: [6 * GOLDENRATIO + 0.18, 0, -3.1 * GOLDENRATIO - 0.2],
      rotation: [0, Math.PI, 0],
      url: pexel(2860810),
    },
    {
      position: [16.3, 0, -2 * GOLDENRATIO + 0.02],
      rotation: [0, 0, 0],
      url: pexel(1324349),
    },
  ],
  //left
  [
    {
      position: [-4.735 * GOLDENRATIO + 1, 0, 8 * GOLDENRATIO],
      rotation: [0, - Math.PI / 2, 0],
      url: pexel(416430)
    },
    {
      position: [-3.5 * GOLDENRATIO + 1, 0, 4 * GOLDENRATIO],
      rotation: [0, Math.PI / 2, 0],
      // url: pexel(1606591),
      url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/A1.jpeg",
    },
    {
      position: [-3.5 * GOLDENRATIO + 1, 0, 0],
      rotation: [0, Math.PI / 2, 0],
      // url: pexel(1324349)
      url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/A2.jpeg",
    },
    {
      position: [-3.5 * GOLDENRATIO + 1, 0, -4 * GOLDENRATIO],
      rotation: [0, Math.PI / 2, 0],
      // url: pexel(1795707)
      url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/a3.jpeg",
    },
    {
      position: [-3.5 * GOLDENRATIO + 1, 0, -8 * GOLDENRATIO],
      rotation: [0, Math.PI / 2, 0],
      // url: pexel(1324354),
      url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/A4.jpeg",
    },
  ],
  // BACK left
  [

    {
      position: [-4, 0, -9 * GOLDENRATIO - 0.5],
      rotation: [0, 0, 0],
      url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/BB1.jpg",
      half: "half",
    },
    {
      position: [-0.8, 0, -9 * GOLDENRATIO - 0.5],
      rotation: [0, 0, 0],
      url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/BB2.jpeg",
      half: "half",
    },
    {
      position: [2.4, 0, -9 * GOLDENRATIO - 0.5],
      rotation: [0, 0, 0],
      url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/BB3.jpg",
      half: "half",
    },
    {
      position: [5.6, 0, -9 * GOLDENRATIO - 0.5],
      rotation: [0, 0, 0],
      url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/BB4.jpg",
      half: "half",
    },
    {
      position: [8.8, 0, -9 * GOLDENRATIO - 0.5],
      rotation: [0, 0, 0],
      url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/BB5.jpeg",
      half: "half",
    },
    {
      position: [12, 0, -9 * GOLDENRATIO - 0.5],
      rotation: [0, 0, 0],
      url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/BB6.jpeg",
      half: "half",
    },
    {
      position: [16.8, 0, -11 * GOLDENRATIO + 0.74],
      rotation: [0, Math.PI, 0],
      url: pexel(1324354),
    },
  ],
  // Right
  [
    {
      position: [5 * GOLDENRATIO - 0.42, 0, 9 * GOLDENRATIO],
      rotation: [0, Math.PI / 2, 0],
      url: pexel(6932226),
    },
    {
      position: [3.5 * GOLDENRATIO, 0, 5 * GOLDENRATIO],
      rotation: [0, -Math.PI / 2, 0],
      url: pexel(4392540),
      // url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/B1.jpeg",
    },
    {
      position: [3.5 * GOLDENRATIO, 0, GOLDENRATIO],
      rotation: [0, -Math.PI / 2, 0],
      url: pexel(4392537),
      // url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/B2.jpeg",
    },
    {
      position: [3.5 * GOLDENRATIO + 2, 0, -1.6 * GOLDENRATIO],
      rotation: [0, Math.PI / 2, 0],
      url: pexel(358574),
      half: "half",
    },
    // {
    //   position: [-3.5 * GOLDENRATIO + 1, 0, -4 * GOLDENRATIO],
    //   rotation: [0, Math.PI / 2, 0],
    //   url: pexel(1795707)

    // },
  ]
];


const backRight =   //BACK right
  [
    {
      position: [6 * GOLDENRATIO + 0.18, 0, -3.1 * GOLDENRATIO - 0.2],
      rotation: [0, Math.PI, 0],
      url: pexel(2860810),
    },
    {
      position: [16.3, 0, -2 * GOLDENRATIO + 0.02],
      rotation: [0, 0, 0],
      url: pexel(1324349),
    },
  ];

let loadImage = [

]


const Room1 = ({ userData }) => {
  const charMap = {};
  const params = useParams();
  const roomId = params.roomId;
  const [socket, setSocket] = useState(null);
  const [myStream, setMyStream] = useState(null);

  const [nicknames, setNicknames] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  const [isCharacter, setIsCharacter] = useState([]);
  const [isUser, setUser] = useState(null);

  const url = `/room/${roomId}`;

  const [zIdx, setZIdex] = useState(0);

  const [cameraPosition, setCameraPosition] = useState(0);
  const [yCameraPosition, setYCameraPosition] = useState(0);
  const [cameraAngle, setCameraAngle] = useState(0);

  const room = {
    RoomSrc: null,
    roomNum: 3,
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

  const cameraRotate = (e) => {
    switch (e.key) {
      case "e":
      case "E":
      case "ㄷ":
        setCameraAngle(prev => {
          prev = prev + 1;
          if (prev > 3) {
            prev = 0;
          }
          return prev;
        });
        break;

      case "q":
      case "Q":
      case "ㅂ":
        setCameraAngle(prev => {
          prev = prev - 1;
          if (prev < 0) {
            prev = 3;
          }
          return prev;
        });
        break;
    }
  }


  useEffect(() => {
    loadImage = []
    for (let i = 0; i < 4; i++) {
      if (i === cameraAngle) {
        continue;
      } else {
        loadImage.push(...images[i]);
      }
    }
  }, [cameraAngle]);
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
          src: isUser.character,
          x: 80,
          y: 80,
          nickname: isUser.nickname,
          roomId: "room1" + roomId,
        });
      });

      socket.on("get_user_info", function (data) {
        const user = joinUser(data.id, data.x, data.y, data.nickname, data.src);
        user.sprite.yaxios = 250;
        user.directionUpdate = {
          up: ["y", -6],
          down: ["y", 6],
          left: ["x", -6],
          right: ["x", 6],
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
  useEffect(() => {
    window.addEventListener("keydown", cameraRotate);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", cameraRotate);
    };
  }, []);


  return (
    <>
      <div className="roomContainer" style={{ backgroundColor: "gray", display: "flex", height: "100vh" }}>
        {socket && myStream ? (
          <>
            <RoomSideBar
              url={url}
              myStream={myStream}
              socket={socket}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              characters={isCharacter}
              roomNum="3"
            />

            <ThreeCanvas images={ceil} cameraAngle={cameraAngle} setCameraAngle={setCameraAngle} cameraPosition={cameraPosition} yCameraPosition={yCameraPosition} />
            <ThreeCanvas images={loadImage} cameraAngle={cameraAngle} setCameraAngle={setCameraAngle} cameraPosition={cameraPosition} yCameraPosition={yCameraPosition} />
            {/* {
              images.map((image, i) => {
                return <ThreeCanvas idx={i} images={image} cameraAngle={cameraAngle} setCameraAngle={setCameraAngle} cameraPosition={cameraPosition} yCameraPosition={yCameraPosition} />
              })
            } */}

            <Overworld1
              myStream={myStream}
              Room={room}
              url={url}
              charMap={charMap}
              socket={socket}
              setCameraPosition={setCameraPosition}
              setYCameraPosition={setYCameraPosition}
            />
            {/* <CharacterNickname nicknames={nicknames} /> */}

          </>
        ) : <LoadingComponent />}
      </div>

      {/* <StreamsContainer id="streams"></StreamsContainer> */}
      <MyVideoBox>
        <MyVideo id="myFace" autoPlay="autoplay"></MyVideo>
        <CamBtn id="camBtn">
          <VideoButton />
        </CamBtn>
        <MyVideoNickname>{isUser?.nickname}</MyVideoNickname>
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

export default connect(mapStateProps)(Room1);