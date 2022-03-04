import { throttle } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import DrawCursor from "./Cursor";

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
  padding: 20px;

`;
const InfoInnerContainer = styled.div`
padding-top: 20px;
 width:100%;
 height: 100%;
 background-color: white;
 div{
  margin: 20px;
}
`;

// const Comp = styled.div.attrs({
//   style: ({ background }) => ({
//     background
//   }),
// })``


const PictureFrame = ({ socket }) => {
  const ref = useRef();

  // const [isCursor, setIsCursor] = useState(0);
  // const [isCursorX, setIsCursorX] = useState(0);
  // const [isCursorY, setIsCursorY] = useState(0);
  // const [nickname, setNickname] = useState("");
  function updateDisplay(event) {
    const xRatio = (event.pageX - ref.current.offsetLeft) / ref.current.clientWidth;
    const yRatio = event.pageY / ref.current.clientHeight;
    socket.emit("cursorPosition", xRatio, yRatio, socket.id);
  }
  const throttleUpdateDisplay = throttle(updateDisplay, 24);
  const [drawUser, setdrawUser] = useState([]);
  socket.on("shareCursorPosition", (xRatio, yRatio, nickname) => {
    setdrawUser(prev => {
      for (let i = 0; i < prev.length; i++) {
          if (nickname === prev[i].nickname) {
              return prev;
          }
      }
      return [...prev,{
        nickname: nickname,
        isCursorX: 500,
        isCursorY: 500,
      }]
    })
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
          {drawUser.map((data, i) =>
            <DrawCursor
              socket={socket}
              key={data.nickname + i}
              nickname={data.nickname}
            />
          )}
          <img
            className="picture"
            src="https://weekly.cnbnews.com/data/photos/20160831/art_1470374545.jpg"
            alt="image1"
          />
        </Frame>
        <PictureInfoContainer>
          <InfoInnerContainer>
            <div>
              작품명: Fisher girl
            </div>
            <div>
              작가: 엄유정
            </div>
            <div>
              작품 설명: 그림을 그리는 사람. 2009년 홍익대학교에서 회화를 전공했다. 2013년 아이슬란드 북부의 아티스트 레지던시 프로그램에 참여했고, 이듬해 그곳에서의 작업들로 서울에서 개인전 「Take it easy, you can find it」을 열었다. 2016년에는 일본 도쿄에서 짧은 전시를 마치고 오는 등 다수의 개인전과 기획전을 열었다. 2013년 모로코의 이야기를 담은 『드로잉 모로코』 를 출간, 영화 「슬로우 비디오」의 그림 작가로 참여하기도 하며 전시, 영화, 출판 등 다양한 분야에서 그림으로 활동하고 있다.
              언제나 낯선 풍경을 바라보는 것을 즐기고 이를 드로잉, 페인팅, 애니메이션으로 만들어나가고 있다. 조약돌을 모으듯 앞으로도 매일의 삶과 풍경을 그림으로 담아내고 싶다.
            </div>
          </InfoInnerContainer>
        </PictureInfoContainer>
      </div>
    </PictureContainer>
  );
};

export default PictureFrame;
