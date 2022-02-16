import React, { useState } from "react";
import { ProSidebar, Menu } from "react-pro-sidebar";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import "react-pro-sidebar/dist/css/styles.css";
import styled from "styled-components";

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

  div.btn {
    display: inline-block;
    text-decoration: none;
    color: #000;
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

const MessageContaienr = styled.div`
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

const RoomSideBar = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout>
      <div className="layout">
        <aside>
          <ProSidebar collapsed={collapsed}>
            <ChatContainer collapsed={collapsed}>
              <MessageContaienr id="chatRoom">
                <ul id="chatBox"></ul>
              </MessageContaienr>
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
  );
};

export default RoomSideBar;
