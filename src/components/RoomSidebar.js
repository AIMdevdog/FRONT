import React, { useEffect, useState } from "react";
import { ProSidebar } from "react-pro-sidebar";
import { FaArrowLeft, FaArrowRight, FaShare } from "react-icons/fa";
import { IoChatbubblesSharp } from "react-icons/io5";
import { ImExit } from "react-icons/im";
import { IoSend } from "react-icons/io5";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "react-pro-sidebar/dist/css/styles.css";
import styled from "styled-components";
import ReactModal from "react-modal";
import { RiCheckboxCircleFill, RiCheckboxCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import moment from "moment";

const Layout = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 99;

  aside {
    position: relative;
  }

  .layout {
    display: flex;
    height: 100%;
  }

  .layout .content {
    background-color: rgb(32, 37, 64);
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .pro-sidebar {
    width: 300px;
  }

  .pro-sidebar > .pro-sidebar-inner {
    background-color: rgb(40, 45, 78);
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
  div.exitBtn {
    display: inline-block;
    cursor: pointer;
  }
`;

const IconActionContainer = styled.div`
  div {
    margin-top: 20px;
    cursor: pointer;
  }
`;

const InputContainer = styled.div`
  display: flex;
  border: 2px solid #909ce2;
  border-radius: 16px;
  height: 50px;
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
  height: 100%;

  .chatSendBox {
    width: 100%;
    padding: 0 20px;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
`;

const ChatSendButton = styled.button`
  position: absolute;
  right: 30px;
  bottom: 13px;
  background: transparent;
  border: none;
  color: white;
`;

const MessageContainer = styled.div`
  width: 100%;
  margin-top: 30px;

  ul {
    width: 100%;
    margin-bottom: 20px !important;
    li {
      padding-bottom: 10px;

      p {
        img {
          object-fit: cover;
          object-position: 0px -10px;
          width: 32px;
          height: 64px;
          image-rendering: pixelated;
          -webkit-transform: scale(1.25);
          -ms-transform: scale(1.25);
          transform: scale(1);
        }
      }

      div {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        p {
          display: flex;
          flex-direction: column;

          span {
            color: rgb(202, 216, 255);
            font-size: 12px;

            &:nth-child(2) {
              color: white;
              font-size: 14px;
              margin-top: 10px;
            }
          }
        }
        span {
          font-size: 12px;
        }
      }
    }
  }
`;

const MessageCharSelectBox = styled.div`
  width: 100%;
  border-top: 1px solid;
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    margin-right: 20px;
  }

  .button-wrap {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background-color: #323a64;
    padding: 20px 14px;
    border-radius: 24px;
    position: relative;

    button {
      border: none;
      background-color: transparent;
      color: ${(props) =>
        props.isChatTarget ? "rgb(6, 214, 160)" : "rgb(255, 126, 227)"};
      font-size: 16px;
    }
  }
`;

const OpenTargetList = styled.div`
  position: absolute;
  left: 0;
  top: -169px;
  padding: 16px 0;
  background: rgb(202, 216, 255);
  width: 100%;
  border-radius: 20px;
`;

const TargetItem = styled.p`
  width: 100%;
  padding: 20px 20px;
  color: black;
  font-size: 18px;
  background-color: ${(props) =>
    props.isChatTarget ? "rgb(144, 173, 255)" : "transparent"};
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

const UserListContainer = styled.div`
  padding: 10px;
  ul {
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      top: 0 !important;
      left: 0 !important;
      cursor: pointer;
      padding: 4px 20px;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
      }

      div {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        img {
          object-fit: cover;
          object-position: 0px -10px;
          width: 32px;
          height: 64px;
          image-rendering: pixelated;
          -webkit-transform: scale(1.25);
          -ms-transform: scale(1.25);
          transform: scale(1);
        }

        span {
          display: block;
          margin-left: 10px;
          color: white;
          font-size: 14px;
        }
      }

      input {
        border: none;
      }

      p {
        position: absolute;
        left: 20px;
        bottom: 20px;
        width: 10px;
        height: 10px;
        background-color: green;
        border-radius: 50%;
      }
    }
  }
`;

const SelcteShare = styled.button``;

const ShareButtonContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ShareButton = styled.button`
  margin-top: 10px;
  border: none;
  width: 80%;
  background-color: rgb(6, 214, 160);
  border-radius: 20px;
  padding: 14px;
  color: rgb(40, 45, 78);
  font-weight: bold;
`;

const RoomSideBar = ({
  myStream,
  collapsed,
  setCollapsed,
  openDraw,
  openDraw2,
  setOpenDraw,
  setOpenDraw2,
  socket,
  characters,
  charMap,
}) => {
  const navigate = useNavigate();
  const [exitModal, setExitModal] = useState(false);

  const [isChatCollapsed, setChatCollapsed] = useState(false);
  const [isShareCollapsed, setShareCollapsed] = useState(false);

  const [isChatArr, setIsChatArr] = useState([]);
  const [isChatReadArr, setIsChatReadArr] = useState([]);
  const [isChatValue, setIsChatValue] = useState("");

  const [drawNum, setDrawNum] = useState(0);
  const [checkedArr, setCheckedArr] = useState([]);
  const [isSharePrompt, setSharePrompt] = useState(false);
  const [isSharingUser, setSharingUsers] = useState([]);
  const [isSharingHost, setSharingHost] = useState(null);

  const [isChatTarget, setIsChatTarget] = useState(1);
  const [isChatCheckRead, setIsChatCheckRead] = useState(false);
  const [isOpenTargetList, setIsOpenTargetList] = useState(false);

  const TargetList = [
    {
      target: 0,
    },
    {
      target: 1,
    },
  ];

  const onExitModal = () => setExitModal(!exitModal);

  useEffect(()=>{
    if(openDraw){
      setDrawNum(1);
    }else if(openDraw2){
      setDrawNum(2);
    } else{
      setDrawNum(0);
    }
  }, [openDraw, openDraw2])

  const escExit = (e) => {
    if (e.key === "Escape") {
      setExitModal(!exitModal);
    }
  };
  const onExitRoom = () => {
    myStream.getTracks().forEach(track => track.stop());
    socket.close();
    navigate("/lobby");
  };

  useEffect(() => {
    const addEvent = () => {
      window.addEventListener("keydown", escExit);
    };
    addEvent();
    return () => {
      window.removeEventListener("keydown", escExit);
    };
  });

  const isChatIconAction = () => {
    setChatCollapsed((prev) => !prev);
    setShareCollapsed(false);

    setIsChatCheckRead(false);
    setCheckedArr([]);
  };

  const onChatChange = (e) => {
    const {
      target: { value },
    } = e;
    setIsChatValue(value);
  };

  const onChangeTargetValue = (target) => {
    setIsChatTarget(target?.target);
  };

  const onChangeChatTarget = () => {
    setIsOpenTargetList((prev) => !prev);
  };

  // chat socket
  const onHandleChatSubmit = (e) => {
    const { key } = e;
    const notMe = characters?.filter((char) => char?.id !== socket?.id);
    const isMe = characters?.filter((char) => char?.id === socket?.id);

    const notMeDestruct = notMe?.map((info) => {
      return {
        id: info?.id,
        nickname: info?.nickname,
      };
    });

    const isMeDestruct = isMe?.map((info) => {
      return {
        id: socket?.id,
        nickname: info?.nickname,
        character: info?.sprite?.image?.currentSrc,
        message: isChatValue,
        date: moment(),
      };
    });

    // const isChatTargetDestruct = characters?.map((char) => {
    //   return {
    // id: socket?.id,
    // nickname: char?.nickname,
    // character: char?.sprite?.image?.currentSrc,
    // message: isChatValue,
    // date: moment(),
    //   };
    // });

    let groupName = 1;
    if (key === "Enter") {
      setIsChatValue("");

      // socket.emit("chat", `${1}: ${isChatValue}`, groupName);
      socket.emit("chat", isMeDestruct[0], notMeDestruct);
      onChatWrite(isMeDestruct[0]);
    }
  };

  const onChatWrite = (isChatTargetDestruct) => {
    setIsChatArr((prev) => [...prev, isChatTargetDestruct]);
    if (!isChatCollapsed) {
      setIsChatCheckRead(true);
      setIsChatReadArr([...isChatReadArr, isChatTargetDestruct]);
    }
  };

  useEffect(() => {
    socket.on("chat", (isChatInfo) => {
      onChatWrite(isChatInfo);
    });

    return () => {
      socket.off("chat");
    };
  }, [socket]);
  // chat socket

  const isShareIconAction = () => {
    // if (openDraw) return alert("이미 공유 중 입니다.");
    setShareCollapsed((prev) => !prev);
    setChatCollapsed(false);
  };

  const isHandleChecked = (char) => {
    let updatedList = [...checkedArr];
    if (checkedArr.includes(char)) {
      updatedList.splice(checkedArr.indexOf(char), 1);
    } else {
      updatedList = [...checkedArr, char];
    }
    setCheckedArr(updatedList);
  };

  const isShareingArtWorks = (props) => {
    console.log(props.target.value);
    const myInfo = characters?.filter((char) => char?.id === socket?.id);
    const myInfoDestruct = myInfo?.map((info) => {
      return {
        id: info?.id,
        nickname: info?.nickname,
      };
    });

    const checkAddrDestruct = checkedArr?.map((check) => {
      return { id: check?.id, nickname: check?.nickname };
    });

    socket.emit("ArtsAddr", myInfoDestruct, checkAddrDestruct, props.target.value);
    isShareIconAction();
    setCheckedArr([]);
  };

  useEffect(() => {
    socket.on("ShareAddr", (sender, num) => {
      setSharingHost(sender[0]);
      onSharePrompt(num);
    });
  }, []);

  const onSharePrompt = (num) => {
    setSharePrompt(true);
    setDrawNum(num);
  };
  const onShareReject = () => {
    setSharePrompt(false);
    setDrawNum(0);
  };
  const onShareAccept = (props) => {
    console.log(typeof(props.target.value));
    const num = parseInt(props.target.value);
    socket.emit("openDraw", socket.id, num);
    if(num === 1){
      setOpenDraw(true);
    }else if(num === 2){
      setOpenDraw2(true);
    }
    setSharePrompt(false);
  };

  return (
    <Layout>
      <div className="layout">
        <aside>
          {isChatCollapsed && (
            <ProSidebar collapsed={collapsed}>
              <ChatContainer collapsed={collapsed}>
                <div className="chatSendBox">
                  <MessageContainer id="chatRoom">
                    <ul>
                      {isChatArr.map((chat, i) => {
                        const identification = chat?.id === socket?.id;
                        const diffMin = moment
                          .duration(moment().diff(chat?.date))
                          .asMinutes();
                        return (
                          <li
                            style={{
                              textAlign: identification ? "right" : "left",
                              position: "relative",
                            }}
                            key={i}
                          >
                            <p>
                              <img src={chat?.character} alt="charimage" />
                            </p>
                            {identification ? (
                              <div>
                                <span>{moment(chat?.date).fromNow()}</span>
                                <p>
                                  <span>{chat?.nickname}</span>
                                  <span>{chat?.message}</span>
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p>
                                  <span>{chat?.nickname}</span>
                                  <span>{chat?.message}</span>
                                </p>
                                <span>{moment(chat?.date).fromNow()}</span>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </MessageContainer>
                  <div style={{ width: "100%" }}>
                    <MessageCharSelectBox isChatTarget={isChatTarget}>
                      <p>
                        <span>To</span>
                      </p>
                      <div className="button-wrap" onClick={onChangeChatTarget}>
                        {isOpenTargetList && (
                          <OpenTargetList>
                            {TargetList?.map((target, i) => {
                              return (
                                <TargetItem
                                  isChatTarget={isChatTarget === i}
                                  key={i}
                                  onClick={() => onChangeTargetValue(target)}
                                >
                                  <span>
                                    {target?.target ? "Everyone" : "Nearby"}
                                  </span>
                                </TargetItem>
                              );
                            })}
                          </OpenTargetList>
                        )}
                        <button>{isChatTarget ? "Everyone" : "Nearby"}</button>
                        {isOpenTargetList ? (
                          <FaArrowDown color="white" />
                        ) : (
                          <FaArrowUp color="white" />
                        )}
                      </div>
                    </MessageCharSelectBox>
                    <InputContainer>
                      <input
                        onKeyPress={onHandleChatSubmit}
                        onChange={onChatChange}
                        name="chat"
                        type="text"
                        autoComplete="off"
                        autofill="off"
                        value={isChatValue}
                        placeholder="Write your chat"
                        required
                      />
                    </InputContainer>
                    <ChatSendButton>
                      <IoSend size="16" />
                    </ChatSendButton>
                  </div>
                </div>
              </ChatContainer>
            </ProSidebar>
          )}
          {isShareCollapsed && (
            <ProSidebar collapsed={collapsed}>
              <UserListContainer>
                <ul className="user-list">
                  {characters?.map((char, i) => {
                    return (
                      <>
                        {char?.id !== socket?.id && (
                          <li key={i} onClick={() => isHandleChecked(char)}>
                            <div>
                              <img
                                src={char?.sprite?.image?.currentSrc}
                                alt="currentSrc"
                              />
                              <span>{char?.nickname}</span>
                            </div>
                            <p></p>
                            {checkedArr.includes(char) ? (
                              <RiCheckboxCircleFill
                                color="rgb(6, 214, 160)"
                                size={24}
                              />
                            ) : (
                              <RiCheckboxCircleLine
                                color="rgb(144,156,226)"
                                size={24}
                              />
                            )}
                          </li>
                        )}
                      </>
                    );
                  })}
                </ul>
                {checkedArr?.length > 0 && (
                  <ShareButtonContainer>
                    <ShareButton onClick={isShareingArtWorks} value={drawNum} id="share">
                      공유하기
                    </ShareButton>
                  </ShareButtonContainer>
                )}
              </UserListContainer>
            </ProSidebar>
          )}
        </aside>
        <main className="content">
          <div className="btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? (
              <FaArrowRight size={24} color="white" />
            ) : (
              <FaArrowLeft size={24} color="white" />
            )}
          </div>

          <IconActionContainer>
            <div onClick={isChatIconAction}>
              {isChatCheckRead &&
                isChatReadArr?.length > 0 &&
                !isChatCollapsed && (
                  <p
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 10,
                      backgroundColor: "red",
                      position: "absolute",
                    }}
                  ></p>
                )}
              <IoChatbubblesSharp color="white" size={24} />
            </div>
            <div
              onClick={
                openDraw || openDraw2
                  ? isShareIconAction
                  : () => alert("그림을 보고 있지 않습니다.")
              }
            >
              <FaShare color={openDraw || openDraw2 ? "white" : "grey"} size={24} />
            </div>
            <div className="exitBtn" onClick={onExitModal}>
              <ImExit color="white" size={24} />
            </div>
          </IconActionContainer>
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
                <button
                  onClick={onExitModal}
                  style={{ backgroundColor: "rgb(169,169,169)" }}
                >
                  아니요
                </button>
              </SetButtonContainer>
            </ExitModalContainer>
          </ReactModal>
          <ReactModal
            style={customStyles}
            isOpen={isSharePrompt}
            onRequestClose={onShareReject}
          >
            <ExitModalContainer>
              <ExitText>
                <span>
                  {isSharingHost?.nickname}님이 작품을 공유하셨습니다.
                </span>
                <br />
                <span>수락하시겠습니까?</span>
              </ExitText>
              <SetButtonContainer>
                <button onClick={onShareAccept} value={drawNum}> 예 </button>
                <button
                  onClick={onShareReject}
                  style={{ backgroundColor: "rgb(169,169,169)" }}
                >
                  아니요
                </button>
              </SetButtonContainer>
            </ExitModalContainer>
          </ReactModal>
        </main>
      </div>
    </Layout>
  );
};

export default RoomSideBar;
