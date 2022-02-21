import { Suspense, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { connect } from "react-redux";
import Overworld from "../game/Overworld";
import { Person } from "../game/Person";
import Gallery1 from "../components/Gallery1";
import styled from "styled-components";
import LoadingComponent from "../components/Loading";
import RoomSideBar from "../components/RoomSidebar";
import { user } from "../config/api";

const pexel = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;
const images = [
  // Front
  {
    position: [0, 0, 2.75],
    rotation: [0, 0, 0],
    url: "https://www.comedywildlifephoto.com/images/wysiwyg/images/2020_winners/mark_fitzpatrick.jpg",
  },
  // Back
  {
    position: [3, 0, 2.75],
    rotation: [0, 0, 0],
    url: pexel(416430)
  },
  {
    position: [6, 0, 2.75],
    rotation: [0, 0, 0],
    url: pexel(310452)
  },
  // Left
  {
    position: [-3, 0, 2.75],
    rotation: [0, 0, 0],
    url: pexel(327482),
  },
  {
    position: [-6, 0, 2.75],
    rotation: [0, 0, 0],
    url: pexel(325185),
  },
  // {
  //   position: [-2, 0, 2.75],
  //   rotation: [0, Math.PI / 2.5, 0],
  //   url: pexel(358574),
  // },
  // // Right
  // {
  //   position: [1.75, 0, 0.25],
  //   rotation: [0, -Math.PI / 2.5, 0],
  //   url: pexel(227675),
  // },
  // {
  //   position: [2.15, 0, 1.5],
  //   rotation: [0, -Math.PI / 2.5, 0],
  //   url: pexel(911738),
  // },
  // {
  //   position: [2, 0, 2.75],
  //   rotation: [0, -Math.PI / 2.5, 0],
  //   url: pexel(1738986),
  // },
];


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

const CamBtn = styled.div`
  display: none;
`;

const ThreeCanvas = styled.div`
  canvas {
    width: 100vw;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  //  .game-container{
  //    position: fixed;
  //    width: 500px;
  //    height: 200px;
  //    right:0;
  //    left: 50%;
  //    transform: translateX(-50%);
  //  }
`;

const Room1 = ({ userData }) => {
  const params = useParams();
  const roomId = params.roomId;
  const [isLoading, setIsLoading] = useState(false);
  const [cameraPosition, setCameraPosition] = useState(0);
  const [yCameraPosition, setYCameraPosition] = useState(0);
  // const downHandler = (e) => {
  //   switch(e.key){
  //     case "ArrowRight":
  //       setCameraPosition(cameraPosition => cameraPosition - 0.05);
  //       break;
  //     case "ArrowLeft":
  //       setCameraPosition(cameraPosition => cameraPosition + 0.05);    
  //       break;
  //   }

  // }
  // const upHandler = () => {

  // }
  // useEffect(() => {
  //   window.addEventListener("keydown", downHandler);
  //   window.addEventListener("keyup", upHandler);
  //   // Remove event listeners on cleanup
  //   return () => {
  //     window.removeEventListener("keydown", downHandler);
  //     window.removeEventListener("keyup", upHandler);
  //   };
  // }, []);
  useEffect(() => {
    userData.then((data) => {
      Overworld({
        config: document.querySelector(".game-container"),
        nickname: data.nickname,
        setCameraPosition: setCameraPosition,
        setYCameraPosition: setYCameraPosition,
        Room: {
          RoomSrc: null,
          id: 123,
          roomNum: 1,
          roomId: roomId,
          gameObjects: {
            player: new Person({
              id: null,
              isPlayerControlled: true,
              x: 480,
              y: 200,
              src: data.character,
            }),
          },
        },
        adjust: {
          xaxios: 0,
          xratio: 1,
          yaxios: 0,
          yratio: 1,
        },
        otherMaps: [
          {
            x: 80,
            y: 96,
            url: `http://localhost:3000/room/${roomId}`,
          },
        ],
      });
    });
    // overworld.init();
  }, []);

  useEffect(() => {
    const loadingFn = () => {
      setIsLoading(true);
    };

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    loadingFn();
  }, []);

  return (
    <div style={{ height: "90vh", backgroundColor: "black" }}>
      {isLoading && <LoadingComponent background={true} />}
      <ThreeCanvas>
        <Suspense fallback={null}>
          <Gallery1 images={images} cameraPosition={cameraPosition} yCameraPosition={yCameraPosition}/>
        </Suspense>
      </ThreeCanvas>
      <div style={{ display: "flex" }}>
        <RoomSideBar />
        <div className="game-container" style={{ backgroundColor: "#19191F" }}>
          <canvas className="game-canvas"></canvas>
        </div>
      </div>
      <StreamsContainer id="streams"></StreamsContainer>
      <MyVideoBox>
        <MyVideo id="myFace" autoPlay="autoplay"></MyVideo>
        <CamBtn id="camBtn">
          <button id="playerCamera">camera on</button>
          <button id="playerMute">mute</button>
        </CamBtn>
      </MyVideoBox>
    </div>
  );
};

function mapStateProps(state) {
  return {
    userData: state,
  }
}

export default connect(mapStateProps)(Room1);
