import { useEffect, useState } from "react";
import styled from "styled-components";
import RoomItemComponent from "../components/RoomItem";
import { room } from "../config/api";
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

const Lobby = () => {
  const [search, setSearch] = useState("");
  const [roomItems, setRoom] = useState([]);
  //   useEffect(() => {
  //     const getRoom = async () => {
  //       try {
  //         const result = await room.getRoom();
  //         setRoom(result.data.data);
  //         console.log(result);
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     };

  //     getRoom();

  //     console.log(room);
  //   }, []);

  const DummyData = [
    {
      id: 1,
      image: assets.sign_page.background,
      title: "신민수 작가의 방입니다.",
      desc: "안녕하세용",
    },
    {
      id: 2,
      image: assets.sign_page.background,
      title: "김승환 작가의 방입니다.",
      desc: "안녕하세용",
    },
    {
      id: 3,
      image: assets.sign_page.background,
      title: "손예림 작가의 방입니다.",
      desc: "안녕하세용",
    },
    {
      id: 4,
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
        <RoomItemComponent data={DummyData} />
      </RoomContainer>
    </LobbyContainer>
  );
};

export default Lobby;
