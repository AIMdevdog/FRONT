import { throttle } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const PictureContainer = styled.div`
  display: flex;
  position: absolute;
  z-index: 60;
  width: 100vw;
  height: 100vh;
  margin: 0px;
  padding: 20px;
  background-color: rgb(0, 0, 0, 0.6);
  .layout {
    height: 100%;
    margin-left: 64px;
    min-width: 1440px;
    max-width: 100vw;
    width: 100vw;
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
  overflow-y: scroll;

  .picture {
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

// const Comp = styled.div.attrs({
//   style: ({ background }) => ({
//     background
//   }),
// })``

const Cursor = styled.img.attrs((props) => ({
  style: {
    opacity: props.isCursor,
    left: props.isCursorX + "px",
    top: props.isCursorY + "px",
  },
}))`
  z-index: 99;
  width: 24px;
  height: 24px;
  outline: none;
  position: fixed;
`;

const CursorNickname = styled.div.attrs((props) => ({
  style: {
    opacity: props.isCursor,
    left: props.isCursorX + 16 + "px",
    top: props.isCursorY + 20 + "px",
  },
}))`
  font-size: 12px;
  z-index: 99;
  position: fixed;
  bottom: 140px;
  height: 16px;
  background-color: rgb(0, 0, 0, 0.6);
  padding: 3px;
  border-radius: 5px;
  color: white;
`;


const PictureFrame = ({ collapsed, socket, charMap }) => {
  const ref = useRef();
  const [isCursor, setIsCursor] = useState(0);
  const [isCursorX, setIsCursorX] = useState(0);
  const [isCursorY, setIsCursorY] = useState(0);
  const [nickname, setNickname] = useState("");

  function updateDisplay(event) {
    const xRatio = (event.pageX - ref.current.offsetLeft) / ref.current.clientWidth;
    const yRatio = event.pageY / ref.current.clientHeight;
    socket.emit("cursorPosition", xRatio, yRatio, socket.id);
  }
  const throttleUpdateDisplay = throttle(updateDisplay, 24);

  socket.on("shareCursorPosition", (xRatio, yRatio, nickname) => {
    setIsCursor(1);
    const ref = document.querySelector(".frame");
    setNickname(nickname);
    setIsCursorX(ref.offsetLeft + xRatio * ref.clientWidth);
    setIsCursorY(yRatio * ref.clientHeight);
  });
  return (
    <PictureContainer
      onMouseEnter={throttleUpdateDisplay}
      onMouseLeave={throttleUpdateDisplay}
      onMouseMove={throttleUpdateDisplay}
      className="share-arts-container"
    >
      <div className="layout">
        <Frame className="frame" ref={ref}>
          <CursorNickname
            isCursor={isCursor}
            isCursorX={isCursorX}
            isCursorY={isCursorY}
          >{nickname}</CursorNickname>
          <img
            className="picture"
            src="https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1672&q=80"
            alt="image1"
          />
          <img
            className="picture"
            src="https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1672&q=80"
            alt="image1"
          />
          <Cursor
            isCursor={isCursor}
            isCursorX={isCursorX}
            isCursorY={isCursorY}
            className="cursor"
            src="https://img.icons8.com/ios-glyphs/344/cursor--v1.png"
            alt="img"
          />
        </Frame>
        <PictureInfoContainer> hello </PictureInfoContainer>
      </div>
    </PictureContainer>
  );
};

export default PictureFrame;
