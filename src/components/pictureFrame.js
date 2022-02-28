import { throttle } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const PictureContainer = styled.div`
  display:flex;
  position: absolute;
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


const Cursor = styled.img.attrs(props => ({
  style:{
    opacity: props.isCursor,
    left: props.isCursorX + "px",
    top: props.isCursorY + "px",
  },
}))
`
  z-index: 99;
  width: 24px;
  height: 24px;
  outline: none;
  position: fixed;
`;

const PictureFrame = ({ collapsed, socket }) => {
  const ref = useRef();
  const [isCursor, setIsCursor] = useState(0);
  const [isCursorX, setIsCursorX] = useState(0);
  const [isCursorY, setIsCursorY] = useState(0);

  function updateDisplay(event) {
    // console.dir(ref)
    console.log(ref.current.clientWidth, ref.current.clientHeight, ref.current.offsetLeft);
    const xRatio = (event.pageX - ref.current.offsetLeft) / ref.current.clientWidth;
    const yRatio = (event.pageY) / ref.current.clientHeight;
    // // console.log(xRatio, yRatio);
    socket.emit("cursorPosition", xRatio, yRatio, socket.id);
  }
  const throttleUpdateDisplay = throttle(updateDisplay, 50);

  socket.on("shareCursorPosition", (xRatio, yRatio, remoteSocketId) => {
    setIsCursor(1);
    const ref = document.querySelector(".frame");
    setIsCursorX(ref.offsetLeft + xRatio * ref.clientWidth);
    setIsCursorY(yRatio * ref.clientHeight);    
    // console.dir(ref.current.clientWidth, ref.current.clientHeight);
    // setIsCursorX(ref.current.offsetLeft + xRatio * ref.current.clientWidth);
    // setIsCursorY(yRatio * ref.current.clientHeight);
  });
  return (
    <PictureContainer
      onMouseEnter={throttleUpdateDisplay}
      onMouseLeave={throttleUpdateDisplay}
      onMouseMove={throttleUpdateDisplay}
      className="share-arts-container"
    >
      <div
        className="layout"
      >
        <Frame
          className="frame"
          ref={ref}
        >
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
      {/* <Cursor isCursorX={isCursorX} isCursorY={isCursorY} className="draw">
      </Cursor> */}
    </PictureContainer>
  );
};

export default PictureFrame;
