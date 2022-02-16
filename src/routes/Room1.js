import { Suspense, useEffect } from "react";
import Overworld from "../game/Overworld";
import { Person } from "../game/Person";
import { useParams } from "react-router-dom";
import Gallery1 from "../components/Gallery1";
import styled from "styled-components";

const pexel = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;
const images = [
  // Front
  {
    position: [0, 0, 1.5],
    rotation: [0, 0, 0],
    url: "https://www.comedywildlifephoto.com/images/wysiwyg/images/2020_winners/mark_fitzpatrick.jpg",
  },
  // Back
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(416430) },
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(310452) },
  // Left
  {
    position: [-1.75, 0, 0.25],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel(327482),
  },
  {
    position: [-2.15, 0, 1.5],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel(325185),
  },
  {
    position: [-2, 0, 2.75],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel(358574),
  },
  // Right
  {
    position: [1.75, 0, 0.25],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel(227675),
  },
  {
    position: [2.15, 0, 1.5],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel(911738),
  },
  {
    position: [2, 0, 2.75],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel(1738986),
  },
];

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

const Room = (props) => {
  console.log(window.location.href);
  const urlStr = window.location.href;
  const url = new URL(urlStr);
  const urlParams = url.searchParams;
  const src = urlParams.get("src");
  // console.log(src);
  const charSrc =
    src ||
    "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-MPN2TapcbBVMdbCP0jR6.png";
  useEffect(() => {
    Overworld({
      config: document.querySelector(".game-container"),
      Room: {
        RoomSrc: null,
        id: 123,
        roomNum: 1,
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
        xratio: 1,
        yaxios: 0,
        yratio: 1,
      },
      otherMaps: [
        {
          x: 96,
          y: 336,
          url: "http://localhost:3000/room",
        },
      ],
    });
    // overworld.init();
  }, []);

  return (
    <div>
      <ThreeCanvas>
        <Suspense fallback={null}>
          <Gallery1 images={images} />
        </Suspense>
      </ThreeCanvas>
      <div className="game-container">
        <canvas
          className="game-canvas"
          style={{ backgroundColor: "#131318" }}
        ></canvas>
      </div>

      <div
        id="streams"
        style={{
          position: "fixed",
          display: "flex",
          left: 0,
          bottom: 100,
          width: 200,
          height: 100,
          backgroundColor: "white",
        }}
      ></div>
      <div
        style={{
          position: "fixed",
          right: 0,
          bottom: 0,
          width: 200,
          height: 200,
          backgroundColor: "white",
        }}
      >
        <video
          id="myFace"
          autoplay="autoplay"
          style={{ width: 200, height: 200 }}
        ></video>
      </div>

      <div id="chatRoom">
        <ul id="chatBox">
          <form id="chatForm">
            <input type="text" placeholder="Write your chat" required />
            <button>Send</button>
          </form>
        </ul>
      </div>
    </div>
  );
};

export default Room;
