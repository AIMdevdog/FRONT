import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";
// import RoomItemComponent from "../components/RoomItem";
import { user, room } from "../config/api";

// icons
import { GiBroom } from "react-icons/gi";
import { BsThreeDotsVertical } from "react-icons/bs";

import Header from "../components/Header";
import LoadingComponent from "../components/Loading";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { Cookies } from "react-cookie";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import { actionCreators } from "../store";

const cookies = new Cookies();

const LobbyContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: rgb(40, 45, 78);
  overflow-y: scroll;
`;

const LobbyHeader = styled.div`
  display: flex;
  background-color: rgb(40, 45, 78);
  padding-right: 40px;
  justify-content: flex-end;
  padding-top: 16px;
  padding-bottom: 16px;
`;

const TabButton = styled.button`
  margin: 0px 4px;
  -webkit-box-align: center;
  align-items: center;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  padding: 0px 12px;
  opacity: ${(props) => (props.room ? 0.6 : 1)};
  background-color: ${(props) =>
    !props.room ? "rgb(84, 92, 143)" : "transparent"};

  span {
    /* color: ${(props) =>
      !props.room ? "rgb(84, 92, 143)" : "transparent"}; */
    color: rgb(255, 255, 255);
    font-family: "DM Sans", sans-serif;
    font-weight: 700;
    font-size: 15px;
    line-height: 20px;
    padding-bottom: 8px;
  }
`;

const CreateSpace = styled.button`
  margin: 0px 4px;
  -webkit-box-align: center;
  align-items: center;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  padding: 0px 12px;
  opacity: ${(props) => (props.room ? 1 : 0.6)};
  background-color: ${(props) =>
    props.room ? "rgb(84, 92, 143)" : "transparent"};

  span {
    color: rgb(255, 255, 255);
    font-family: "DM Sans", sans-serif;
    font-weight: 700;
    font-size: 15px;
    line-height: 20px;
    padding-bottom: 8px;
  }
`;

const SearchInput = styled.div`
  display: flex;
  margin-left: 16px;

  div {
    display: flex;
    flex-direction: column;
    width: 240px;

    div {
      width: 100%;

      display: flex;
      flex-direction: row;
      -webkit-box-align: center;
      align-items: center;
      transition: border 200ms ease 0s;
      box-sizing: border-box;

      div {
        display: flex;
        border: 2px solid rgb(144, 156, 226);
        border-radius: 16px;
        height: 40px;
        padding: 0px 8px 0px 16px;

        input {
          border: none;
          box-shadow: none;
          background: transparent;
          -webkit-box-flex: 1;
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
        }
      }
    }
  }
`;

const RoomContainer = styled.div`
  display: flex;
  background-color: rgb(40, 45, 78);
  min-height: calc(100vh - 152px);
  flex-direction: column;
  overflow: auto;
  padding-left: 20px;
  padding-right: 20px;
`;

const RoomItems = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(312px, 1fr));
  gap: 32px;
  -webkit-box-align: start;
  align-items: start;
  margin: 20px;
`;

const RoomItem = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const RoomItemImageWrap = styled.div`
  div {
    border: 2px solid transparent;
    cursor: pointer;
    margin-top: 10px;
    border-radius: 16px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    box-shadow: rgb(0 0 0 / 10%) 0px 12px 12px;
    height: 80%;

    div {
      width: 100%;
      height: 100%;
      background-size: cover !important;
      background-repeat: no-repeat;
      background-position: center center;
      border-radius: 16px;
      aspect-ratio: 16 / 9;

      background-color: rgb(0, 0, 0);
      background: url(${(props) => props.background});
      display: flex;
      justify-content: center;
      align-items: center;

      p {
        display: none;
      }
      &:hover {
        outline: 4px solid rgb(84, 92, 143);
        /* opacity: 0.4; */

        p {
          display: flex;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6);
          justify-content: center;
          align-items: center;
          border-radius: 16px;

          img {
            display: block;
            width: 50px;
            -webkit-filter: grayscale(1) invert(1);
            filter: grayscale(1) invert(1);
            opacity: 0.8;
          }
        }
      }
    }
  }
`;

const RoomItemDescription = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 16px;

  div {
    display: flex;
    flex-direction: column;

    svg {
      cursor: pointer;
    }
  }
  span {
    font-family: "DM Sans", sans-serif;
    color: white;
    font-size: 14px;
    display: inline-block;
    /* line-height: 24px; */

    &:nth-child(2) {
      color: grey;
      padding-top: 10px;
    }
  }
`;

const EmptyRoom = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  div {
    margin-top: 10px;
    span {
      color: white;
      line-height: 30px;
      text-align: center;
      display: inline-block;
      width: 100%;
    }
  }
`;

const CreateRoomModalContainer = styled.div`
  display: flex;
  background-color: rgb(40, 45, 78);
  flex-direction: column;
  padding: 32px;
  border-radius: 32px;
  z-index: 7;
  position: relative;
`;

const ModalButton = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  button {
    width: 100%;
    border: none;
    background-color: transparent;
    color: white;
    font-weight: bold;
    margin-top: 20px;
    height: 40px;
    border-radius: 10px;

    &:nth-child(1) {
      background-color: rgb(6, 214, 160);
      color: rgb(40, 45, 78);
    }
  }
`;

const RoomText = styled.div`
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

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
    borderRadius: 32,
    border: "none",
    background: "transparent",
    boxShadow: "rgba(0, 0, 0, 0.08) 0px 1px 12px",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.6)",
  },
};

const Lobby = ({userData}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isGetRoom, setIsGetRoom] = useState([]);
  const [isChangeRoom, setIsChangeRoom] = useState(false);
  const [isMyRoom, setIsMyRoom] = useState([]);
  const [isSearchRoom, setSearchRoom] = useState([]);
  const [isSaveUserData, setIsSaveUserData] = useState(null);

  const [isRoomEdit, setIsRoomEdit] = useState(false);
  const [isRoomId, setIsRoomId] = useState(null);

  const EnterIcon =
    "https://icon-library.com/images/enter-icon/enter-icon-1.jpg";

  useEffect(() => {
    const getRoom = async () => {
      try {
        setIsLoading(true);
        const result = await room.getRoom();
        const { data } = result;
        setIsGetRoom(data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    userData.then((data)=>{
      setIsSaveUserData(data);
    })

    getRoom();
  }, []);

  const onSearchChange = (e) => {
    const {
      target: { value },
    } = e;
    setSearch(value);
  };

  useEffect(() => {
    const setSearchResult = () => {
      if (search) {
        const searchResult = isGetRoom.filter((room) =>
          room.title.includes(search)
        );
        setSearchRoom(searchResult);
      } else {
        setSearchRoom([]);
      }
    };

    setSearchResult();
  }, [search]);

  const isChangeRoomType = () => {
    setIsChangeRoom((prev) => !prev);
    setIsMyRoom(
      isGetRoom.filter((room) => room?.hostId === isSaveUserData?.id)
    );
  };

  const isRoomControl = (roomId) => {
    setIsRoomEdit(!isRoomEdit);
    setIsRoomId(roomId);
  };

  const isDeleteRoomConfirm = async () => {
    try {
      setIsLoading(true);
      const result = await room.deleteRoom(isRoomId);
      const {
        data: { code, msg },
      } = result;
      if (code) {
        alert(msg);
        window.location.reload();
      }
      isRoomControl();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const readyToGoIntoTheRoom = (item) => {
    navigate(`/room/${item.id}`);
    // window.location.href = `/room/${item.id}`;
  };
  return (
    <>
      {isLoading && <LoadingComponent />}
      <LobbyContainer>
        <Header/>
        <LobbyHeader>
          <TabButton room={isChangeRoom} onClick={isChangeRoomType}>
            <span>모든 전시공간</span>
          </TabButton>
          <CreateSpace room={isChangeRoom} onClick={isChangeRoomType}>
            <span>내 전시공간</span>
          </CreateSpace>
          <SearchInput>
            <div>
              <div>
                <div>
                  <input
                    onChange={onSearchChange}
                    type="text"
                    placeholder="Search"
                  />
                </div>
              </div>
            </div>
          </SearchInput>
        </LobbyHeader>
        <RoomContainer>
          {search ? (
            <>
              {isSearchRoom?.length === 0 ? (
                <EmptyRoom>
                  <GiBroom color="white" size="40" />
                  <div>
                    <span>검색하신 전시관이 없습니다.</span>
                    <br />
                    <span>정확한 전시관 이름을 입력해주세요.</span>
                  </div>
                </EmptyRoom>
              ) : (
                <>
                  <RoomItems>
                    {isSearchRoom?.map((item) => {
                      return (
                        <RoomItem key={item.id}>
                          <RoomItemImageWrap
                            background={item?.image}
                            onClick={() => readyToGoIntoTheRoom(item)}
                          >
                            <div>
                              <div>
                                <p>
                                  <img src={EnterIcon} alt="" />
                                </p>
                              </div>
                            </div>
                          </RoomItemImageWrap>
                          <RoomItemDescription>
                            <div>
                              <span>{item?.title}</span>
                              <span>{item?.description}</span>
                            </div>
                            <span>{moment(item?.createdAt).fromNow()}</span>
                          </RoomItemDescription>
                          <div className="hover-action"></div>
                        </RoomItem>
                      );
                    })}
                  </RoomItems>
                </>
              )}
            </>
          ) : (
            <>
              {isChangeRoom ? (
                <>
                  {isMyRoom?.length === 0 ? (
                    <EmptyRoom>
                      <GiBroom color="white" size="40" />
                      <div>
                        <span>전시관이 없습니다.</span>
                        <br />
                        <span>작가라면 전시공간을 만들어보세요!</span>
                      </div>
                    </EmptyRoom>
                  ) : (
                    <>
                      <RoomItems>
                        {isMyRoom?.map((item) => {
                          return (
                            <RoomItem key={item.id}>
                              <RoomItemImageWrap
                                background={item?.image}
                                onClick={() => readyToGoIntoTheRoom(item)}
                              >
                                <div>
                                  <div>
                                    <p>
                                      <img src={EnterIcon} alt="" />
                                    </p>
                                  </div>
                                </div>
                              </RoomItemImageWrap>
                              <RoomItemDescription>
                                <div>
                                  <span>{item?.title}</span>
                                  <span>{item?.description}</span>
                                </div>
                                <div style={{ alignItems: "flex-end" }}>
                                  <BsThreeDotsVertical
                                    onClick={() => isRoomControl(item?.id)}
                                    color="white"
                                  />
                                  <span>
                                    {moment(item?.createdAt).fromNow()}
                                  </span>
                                </div>
                              </RoomItemDescription>
                              <div className="hover-action"></div>
                            </RoomItem>
                          );
                        })}
                      </RoomItems>
                    </>
                  )}
                </>
              ) : (
                <>
                  {isGetRoom?.length === 0 ? (
                    <EmptyRoom>
                      <GiBroom color="white" size="40" />
                      <div>
                        <span>전시관이 없습니다.</span>
                        <br />
                        <span>작가라면 전시공간을 만들어보세요!</span>
                      </div>
                    </EmptyRoom>
                  ) : (
                    <>
                      <RoomItems>
                        {isGetRoom?.map((item) => {
                          return (
                            <RoomItem key={item.id}>
                              <RoomItemImageWrap
                                background={item?.image}
                                onClick={() => readyToGoIntoTheRoom(item)}
                              >
                                <div>
                                  <div>
                                    <p>
                                      <img src={EnterIcon} alt="" />
                                    </p>
                                  </div>
                                </div>
                              </RoomItemImageWrap>
                              <RoomItemDescription>
                                <div>
                                  <span>{item?.title}</span>
                                  <span>{item?.description}</span>
                                </div>
                                <span>{moment(item?.createdAt).fromNow()}</span>
                              </RoomItemDescription>
                            </RoomItem>
                          );
                        })}
                      </RoomItems>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </RoomContainer>
      </LobbyContainer>
      <ReactModal
        ariaHideApp={false}
        style={customStyles}
        isOpen={isRoomEdit}
        onRequestClose={isRoomControl}
      >
        <CreateRoomModalContainer>
          <RoomText>
            <span>방을 삭제하시겠습니까?</span>
          </RoomText>
          <ModalButton>
            <button onClick={isDeleteRoomConfirm}>삭제</button>
            <button onClick={isRoomControl}>취소</button>
          </ModalButton>
        </CreateRoomModalContainer>
      </ReactModal>
    </>
  );
};


function mapStateToProps(state) {
  return {
    userData: state,
  };
}

export default connect(mapStateToProps)(Lobby);
