import React, { useEffect, useState } from "react";
import styled from "styled-components";

const PictureContainer = styled.div`
  position: fixed;
  overflow-y: scroll;
  z-index: 60;
  width: 100vw;
  height: 100vh;
  margin: 0px;
  padding: 20px;

  background-color: rgb(0, 0, 0, 0.6);
  .layout {
    margin-left: 152px;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .layout2 {
    margin-left: 342px;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
`;
const Frame = styled.div`
  margin-right: 20px;
  padding: 20px;
  height: 100vh;
  background-color: rgb(255, 235, 205, 1);
  border-radius: 5px;
  img {
    position: relative;
    display: block;
    top: 50%;
    transform: translateY(-50%);
    max-width: 100%;
    max-height: 100%;
    margin: auto;
    outline: 5px solid black;
  }
`;
const PictureInfoContainer = styled.div`
  width: 300px;
  min-width: 300px;
  height: 100vh;
  background-color: #ffebcd;
  border-radius: 5px;
`;
const Cursor = styled.div`
  img {
    z-index: 99;
    width: 24px;
    height: 24px;
    outline: none;
    position: absolute;
    top: ${(props) => props.isCursorY} + "px";
    left: ${(props) => props.isCursorx} + "px";
  }
`;

const PictureFrame = ({ collapsed, socket }) => {
  const [isCursorX, setIsCursorX] = useState(0);
  const [isCursorY, setIsCursorY] = useState(0);

  function updateDisplay(event) {
    console.log(event);
    socket.emit("cursorPosition", event.pageX, event.pageY, socket.id);
  }

  useEffect(() => {
    socket.on("shareCursorPosition", (cursorX, cursorY, remoteSocketId) => {
      //artsAddr로 작품을 그려주면 된다.
      // const draw = document.querySelector(".draw");
      // if (!draw) {
      //   return;
      // } else if (draw?.firstChild) {
      //   draw.removeChild(draw?.firstChild);
      // }
      // const img = document.createElement("img");
      // img.src = "https://img.icons8.com/ios-glyphs/344/cursor--v1.png";
      // console.log(cursorX, cursorY, remoteSocketId);
      setIsCursorY(cursorY - 240);
      setIsCursorX(cursorX - 165);
      // img.style.top = cursorY - 240 + "px";
      // img.style.left = cursorX - 165 + "px";
      // draw.appendChild(img);
      // console.dir(img);
    });
  }, []);

  return (
    <PictureContainer
      onMouseEnter={updateDisplay}
      onMouseLeave={updateDisplay}
      onMouseMove={updateDisplay}
      className="share-arts-container"
    >
      <div className={collapsed ? "layout" : "layout2"}>
        <Frame>
          <img
            src="https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1672&q=80"
            alt="image1"
          />
          <Cursor isCursorY={isCursorY} isCursorX={isCursorX} className="draw">
            <img
              src="https://img.icons8.com/ios-glyphs/344/cursor--v1.png"
              alt="img"
            />
          </Cursor>
        </Frame>
        <PictureInfoContainer> hello </PictureInfoContainer>
      </div>
    </PictureContainer>
  );
};

export default PictureFrame;
