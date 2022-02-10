import { useState } from "react";
import styled from "styled-components";
import assets from "../config/assets";

const LobbyContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: rgb(40, 45, 78);
`;

const LobbyHeader = styled.div`
  display: flex;
  background-color: rgb(40, 45, 78);
  padding-right: 52px;
  justify-content: flex-end;
  padding-top: 16px;
  padding-bottom: 16px;
`;

const LastVisit = styled.button`
  margin: 0px 4px;
  -webkit-box-align: center;
  align-items: center;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  padding: 0px 12px;
  opacity: 1;
  background-color: rgb(84, 92, 143);

  span {
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
  opacity: 0.6;
  background-color: transparent;

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
      border: 2px solid rgb(144, 156, 226);
      border-radius: 16px;
      display: flex;
      flex-direction: row;
      -webkit-box-align: center;
      align-items: center;
      transition: border 200ms ease 0s;
      box-sizing: border-box;
      height: 40px;
      padding: 0px 8px 0px 16px;

      div {
        display: flex;
        margin-right: 8px;

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
  cursor: pointer;

  div {
    border: 3px solid transparent;
    cursor: pointer;
    margin-top: 10px;
    border-radius: 16px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;

    span {
      font-family: "DM Sans", sans-serif;
      color: white;
    }
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    aspect-ratio: 16 / 9;
    box-shadow: rgb(0 0 0 / 10%) 0px 12px 12px;
    background-color: rgb(0, 0, 0);
  }
`;

const Lobby = () => {
  const [search, setSearch] = useState("");

  const DummyData = [
    {
      image: assets.sign_page.background,
      title: "신민수 작가의 방입니다.",
      desc: "안녕하세용",
    },
    {
      image: assets.sign_page.background,
      title: "김승환 작가의 방입니다.",
      desc: "안녕하세용",
    },
    {
      image: assets.sign_page.background,
      title: "손예림 작가의 방입니다.",
      desc: "안녕하세용",
    },
    {
      image: assets.sign_page.background,
      title: "정원종 작가의 방입니다.",
      desc: "안녕하세용",
    },
  ];

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setSearch(value);
  };

  return (
    <LobbyContainer>
      <LobbyHeader>
        <LastVisit>
          <span>Last Visited</span>
        </LastVisit>
        <CreateSpace>
          <span>Created Space</span>
        </CreateSpace>
        <SearchInput>
          <div>
            <div>
              <input onChange={onChange} type="text" placeholder="Search" />
            </div>
          </div>
        </SearchInput>
      </LobbyHeader>
      <RoomContainer>
        <RoomItems>
          {DummyData?.map((item) => {
            return (
              <RoomItem background={item?.image}>
                <img src={item.image} alt="background image" />
                <div>
                  <span>{item?.title}</span>
                </div>
                <div style={{ marginTop: 4 }}>
                  <span>{item?.desc}</span>
                </div>
              </RoomItem>
            );
          })}
        </RoomItems>
      </RoomContainer>
    </LobbyContainer>
  );
};

export default Lobby;
