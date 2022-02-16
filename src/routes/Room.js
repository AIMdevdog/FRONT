import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Overworld from "../game/Overworld";
import { Person } from "../game/Person";
import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { ProSidebar, Menu } from "react-pro-sidebar";
import Aside from "../components/Mainside";
import Header from "../components/Header";
import styled from "styled-components";
import RoomSideBar from "../components/RoomSidebar";

const Layout = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;

  .layout {
    display: flex;
    height: 100%;
  }

  .layout .content {
    background-color: rgb(40, 45, 78);
    padding: 20px;
    flex-grow: 1;
  }

  .pro-sidebar > .pro-sidebar-inner {
    background-color: rgb(51, 58, 100);
  }
  GrSend div.btn {
    display: inline-block;
    margin: 10px 0;
    padding: 8px 20px;
    background-color: #fff;
    text-decoration: none;
    color: #000;
    box-shadow: 1px 1px 4px #8990ad;
    width: 100px;
    text-align: center;
    border-radius: 4px;
    font-size: 0.9rem;
    cursor: pointer;
  }
`;

const InputContainer = styled.div`
  display: flex;
  /* border: 2px solid #909ce2; */
  border: 2px solid #909ce2;
  border-radius: 16px;
  height: 40px;
  padding: 0px 8px 0px 16px;

  input {
    border: none;
    box-shadow: none;
    background: transparent;
    -webkit-box-flex: 1;
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    font-weight: 500;
    font-size: 15px;
    font-family: inherit;
    line-height: 20px;
    color: rgb(255, 255, 255);
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    padding: 0 20px;
  }
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 20px;
  width: 100%;

  .chatSendBox {
    width: 100%;
    padding: 0 20px;

    button {
      position: absolute;
      right: 30px;
      top: 10px;
      background: transparent;
      border: none;
      color: white;
    }
  }
`;

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

const Room = () => {
  const location = useLocation();
  // const { state } = location;
  const urlStr = window.location.href;
  const url = new URL(urlStr);
  const urlParams = url.searchParams;
  const src = urlParams.get("src");
  const [isState, setIsState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  // useState(() => {
  //   setIsLoading(true);
  //   const RoomInint = () => {
  //     setIsState(location?.state);
  //   };

  //   RoomInint();
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
  // }, []);

  const charSrc =
    src ||
    location.state.isCurrentImg ||
    "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-sb7g6nQb3ZYxzNHryIbM.png";
  useEffect(() => {
    Overworld({
      config: document.querySelector(".game-container"),
      Room: {
        RoomSrc:
          "https://aim-image-storage.s3.ap-northeast-2.amazonaws.com/map2.png",
        id: 123,
        roomNum: 0,
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
        yaxios: 0,
        yratio: 1,
      },
      otherMaps: [
        {
          x: 16,
          y: 448,
          url: "http://localhost:3000/room1",
        },
      ],
    });
    // overworld.init();
  });

  return (
    <>
      <div style={{ display: "flex" }}>
        {/* <Aside/> */}

        {/* <Aside /> */}
        {/* <RoomSideBar /> */}
        <Layout>
          <div className="layout">
            <aside>
              <ProSidebar collapsed={collapsed}>
                {!collapsed && (
                  <ChatContainer>
                    <div id="chatRoom">
                      <ul id="chatBox"></ul>
                    </div>
                    <form id="chatForm">
                      <InputContainer>
                        <input
                          type="text"
                          placeholder="Write your chat"
                          required
                        />
                      </InputContainer>
                      <button>
                        <IoSend size="16" />
                      </button>
                    </form>
                  </ChatContainer>
                )}
              </ProSidebar>
            </aside>
            <main className="content">
              <div className="btn" onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? (
                  <FaArrowRight color="white" />
                ) : (
                  <FaArrowLeft color="white" />
                )}
              </div>
            </main>
          </div>
        </Layout>
        <div className="game-container" style={{ backgroundColor: "black" }}>
          <canvas className="game-canvas"></canvas>
        </div>
      </div>
      <StreamsContainer id="streams"></StreamsContainer>
      <MyVideoBox>
        <MyVideo id="myFace" autoPlay="autoplay"></MyVideo>
      </MyVideoBox>
    </>
  );
};

export default Room;
