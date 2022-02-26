import React, { useEffect, useState } from "react";
import { ProSidebar, Menu, SidebarFooter } from "react-pro-sidebar";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ImExit } from "react-icons/im"
import { IoSend } from "react-icons/io5";
import "react-pro-sidebar/dist/css/styles.css";
import styled from "styled-components";
import ReactModal from "react-modal";

const Layout = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 80;

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

  div.btn {
    display: inline-block;
    text-decoration: none;
    color: #000;
    text-align: center;
    border-radius: 4px;
    font-size: 0.9rem;
    cursor: pointer;
  }
  div.exitBtn{
    display: inline-block;
    margin-top: auto;
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
  opacity: ${(props) => (props.collapsed ? 0 : 1)};

  .chatSendBox {
    width: 100%;
    padding: 0 20px;
    position: relative;

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

const MessageContainer = styled.div`
  width: 100%;
  padding: 0 20px;
  ul {
    width: 100%;
    margin-bottom: 20px !important;
    li {
      padding-bottom: 10px;
    }

    li.myChat {
      text-align: right;
    }
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
  align-items: center;
  margin-bottom: 16px;

  span {
    color: rgb(255, 255, 255);
    font-family: "DM Sans", sans-serif;
    font-weight: 700;
    font-size: 20px;
    line-height: 26px;
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
  button{ 
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

const ExitButton = styled.button`

`;

const RoomSideBar = ({url, collapsed, setCollapsed, openDraw}) => {
  
  const [exitModal, setExitModal] = useState(false);

  const onExitModal = () => setExitModal(!exitModal);
  const escExit = (e) => {
    if (e.key === "Escape") {
      setExitModal(!exitModal);
    }
  }
  const onExitRoom = () => {
    window.location.href = url
  }

  useEffect(() => {
    const addEvent = () => {
      window.addEventListener("keydown", escExit);
    };
    addEvent();
    return () => {
      window.removeEventListener("keydown", escExit);
    }
  })

  return (
    <Layout>
      <div className="layout">
        <aside>
          <ProSidebar collapsed={collapsed}>
            <ChatContainer collapsed={collapsed}>
              <MessageContainer id="chatRoom">
                <ul id="chatBox"></ul>
              </MessageContainer>
              <form id="chatForm" className="chatSendBox">
                <InputContainer>
                  <input type="text" placeholder="Write your chat" required />
                </InputContainer>
                <button>
                  <IoSend size="16" />
                </button>
              </form>
            </ChatContainer>
          </ProSidebar>
        </aside>
        <main className="content" style={{ display: "flex", flexDirection: "column" }}>
          <div className="btn" onClick={() => {
            if(!openDraw){
              setCollapsed(!collapsed)
            }
            }}>
            {collapsed ? (
              <FaArrowRight size={24} color="white" />
            ) : (
              <FaArrowLeft size={24} color="white" />
            )}
          </div>
          <div className="exitBtn" onClick={onExitModal}>
            <ImExit color="white" size={32} />
          </div>
          <ReactModal
            style={customStyles}
            isOpen={exitModal}
            onRequestClose={onExitModal}
          >
            <ExitModalContainer>
              <ExitText>
                <span> 방에서 나가시겠습니까? </span>
              </ExitText>
              <SetButtonContainer>
                <button onClick={onExitRoom}> 예 </button>
                <button onClick={onExitModal} style={{backgroundColor:"rgb(169,169,169)",}}> 아니요 </button>
              </SetButtonContainer>
            </ExitModalContainer>
          </ReactModal>
        </main>
      </div>
    </Layout>
  );
};

export default RoomSideBar;
