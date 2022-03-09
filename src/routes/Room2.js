import { Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Person } from "../game/Person";
import React from "react";
import styled from "styled-components";
import VideoButton from "../components/VideoButton";
import { connect } from "react-redux";
import { joinUser, updateLocation } from "../utils/game/character";
import { io } from "socket.io-client";
import _const from "../config/const";
import Overworld1 from "../game/Overworld1";
import Gallery2 from "../components/Gallery2";
import { user } from "../config/api";
import ReactModal from "react-modal";

const images = [
  {
    position: [-23.4, 0, -2.3],
    rotation: [0, Math.PI / 180 * 30, 0],
    url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/panorama_far_left_3.png",
  },
  {
    position: [-14.5, 0, -6],
    rotation: [0, Math.PI / 180 * 15, 0],
    url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/panorama_left_3.png",
  },
  {
    position: [-5, 0, -7.3],
    rotation: [0, 0, 0],
    url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/panorama_left_center_3.png",
  },
  {
    position: [5, 0, -7.3],
    rotation: [0, 0, 0],
    url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/panorama_right_center_3.png",
  },
  {
    position: [14.5, 0, -6],
    rotation: [0, -Math.PI / 180 * 15, 0],
    url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/panorama_right_3.png",
  },
  {
    position: [23.4, 0, -2.3],
    rotation: [0, -Math.PI / 180 * 30, 0],
    url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/panorama_far_right_3.png",
  },
  // {
  //   position: [0.5, -8.3, 0.8],
  //   rotation: [-Math.PI / 2, 0, 0],
  //   url: "https://aim-front.s3.ap-northeast-2.amazonaws.com/panorama_bottom.png",
  //   ceil: "ceil",
  // },
  // {
  //   position: [25, 0, 9.5],
  //   rotation: [0, Math.PI / 2, 0],
  //   url: pexel(2860810),
  // },
  // {
  //   position: [-24, 0, 9.5],
  //   rotation: [0, -Math.PI / 2, 0],
  //   url: pexel(3156125),
  // }
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
background-color: black;
  display:block;
  canvas {
    width: 100vw;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
`;
const ExitButton = styled.button`
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 20px;
    box-sizing: border-box;
    outline: none;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    font-family: inherit;
    font-weight: 700;
    transition: background-color 200ms ease 0s, border-color 200ms ease 0s;
    opacity: 1;
    overflow: hidden;
    background-color: rgb(6, 214, 160);
    border: 2px solid transparent;
    padding: 0px 12px;
    width: auto;
    height: 35px;
    border-radius: 12px;
    font-size: 15px;
    color: rgb(40, 45, 78) !important;
    z-index: 100;
`;
const ExitModalContainer = styled.div`
  display: flex;
  background-color: rgb(40, 45, 78);
  flex-direction: column;
  padding: 32px;
  z-index: 7;
  position: relative;
`;
const ExitText = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;

  span {
    color: rgb(255, 255, 255);
    font-family: "DM Sans", sans-serif;
    font-weight: 700;
    font-size: 20px;
    display: block;
  }
`;
const SetButtonContainer = styled.div`
  display: flex;
  margin-top: 16px;
  justify-content: space-between;

  div {
    display: flex;
    margin: 8px;
  }
  button {
    display: flex;
    position: relative;
    box-sizing: border-box;
    outline: none;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    font-family: inherit;
    font-weight: 700;
    transition: background-color 200ms ease 0s, border-color 200ms ease 0s;
    cursor: pointer;
    opacity: 1;
    overflow: hidden;
    background-color: rgb(6, 214, 160);
    border: 2px solid transparent;
    padding: 0px 16px;
    width: 80px;
    height: 40px;
    border-radius: 16px;
    font-size: 15px;
    color: rgb(40, 45, 78);
  }
`;
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
    borderRadius: 16,
    border: "none",
    background: "transparent",
    boxShadow: "rgba(0, 0, 0, 0.08) 0px 1px 12px",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.6)",
  },
};



const cameraConstraints = {
  audio: true,
  video: true,
};

const Room2 = ({ userData }) => {
  const charMap = {};
  const params = useParams();
  const navigate = useNavigate();
  const roomId = params.roomId;
  const url = `/room/${roomId}`;

  const [socket, setSocket] = useState(null);
  const [myStream, setMyStream] = useState(null);

  const [nicknames, setNicknames] = useState([]);
  const [isCharacter, setIsCharacter] = useState([]);
  const [isUser, setUser] = useState(null);


  const [exitModal, setExitModal] = useState(false);
  const onExitModal = () => setExitModal(!exitModal);

  const [cameraPosition, setCameraPosition] = useState(0);
  const [yCameraPosition, setYCameraPosition] = useState(0);

  const onClick = (e) => {
    setExitModal(prev => !prev);
  }

  const onExitRoom = () => {
    myStream.getTracks().forEach(track => track.stop());
    socket.close();
    navigate(url, { state: { x: 983, y: 1072 } });
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
          src: isUser.character,
          x: 80,
          y: 80,
          nickname: isUser.nickname,
          roomId: "room2/" + roomId,
          roomNum: 2
        });
      });

      socket.on("get_user_info", function (data) {
        const user = joinUser(data.id, data.x, data.y, data.nickname, data.src);
        user.sprite.yaxios = 380;
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

  return (
    <>
      <div className="roomContainer" style={{ display: "flex", height: "100vh" }}>
        <>
          <ThreeCanvas className="gallery">
            <Suspense fallback={null}>
              <Gallery2 images={images} roomId={roomId} cameraPosition={cameraPosition} yCameraPosition={yCameraPosition} />
            </Suspense>
          </ThreeCanvas>
          {socket ? <Overworld1
            myStream={myStream}
            Room={room}
            url={url}
            charMap={charMap}
            socket={socket}
            setCameraPosition={setCameraPosition}
            setYCameraPosition={setYCameraPosition}
          /> : null}
          {/* <CharacterNickname nicknames={nicknames} /> */}
        </>
      </div>
      <ExitButton onClick={onClick}>
        나가기
      </ExitButton>
      <ReactModal
        style={customStyles}
        isOpen={exitModal}
        shouldCloseOnOverlayClick={false}
        onRequestClose={onExitModal}
      >
        <ExitModalContainer>
          <ExitText>
            <span> 방에서 나가시겠습니까? </span>
          </ExitText>
          <SetButtonContainer>
            <button onClick={onExitRoom}> 예 </button>
            <button
              onClick={onExitModal}
              style={{ backgroundColor: "rgb(169,169,169)" }}
            >
              아니요
            </button>
          </SetButtonContainer>
        </ExitModalContainer>
      </ReactModal>

      {/* <StreamsContainer id="streams"></StreamsContainer> */}
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