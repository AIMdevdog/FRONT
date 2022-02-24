import React, { useState } from "react";
import ReactModal from "react-modal";
import styled from "styled-components";
import { room } from "../config/api";
import LoadingComponent from "./Loading";
import RoomImageSlider from "./RoomImageSlider";

const CreateRoomModalContainer = styled.div`
  display: flex;
  background-color: rgb(40, 45, 78);
  flex-direction: column;
  padding: 32px;
  border-radius: 32px;
  z-index: 7;
  position: relative;
`;
const RoomText = styled.div`
  display: flex;
  width: 350px;
  justify-content: center;
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
const RoomImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const RoomInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`;
const RoomInfoLabel = styled.div`
  display: flex;
  margin-bottom: 4px;

  label {
    color: white;
    margin-bottom: 6px;
  }

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
    color: rgb(17, 17, 17);
    width: 100%;
    height: 100%;
  }
`;
const RoomInfoInput = styled.div`
  width: 100%;
  border: 2px solid rgb(144, 156, 226);
  border-radius: 16px;
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  transition: border 200ms ease 0s;
  box-sizing: border-box;
  height: 48px;
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
    color: white;
    width: 100%;
    height: 100%;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 36px;
  width: 100%;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;
const SelectButton = styled.div`
  display: flex;
  width: 200px;

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
    width: 100%;
    height: 48px;
    border-radius: 16px;
    font-size: 15px;
    color: rgb(40, 45, 78) !important;
  }
`;

const CreateSpaceModal = (props) => {
  const { isCreateRoomOpen, onCreateSpace } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isRoomTitle, setIsRoomTitle] = useState("");
  const [isRoomDesc, setIsRoomDesc] = useState("");

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

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "isRoomTitle") {
      setIsRoomTitle(value);
    } else if (name === "isRoomDesc") {
      setIsRoomDesc(value);
    }
  };

  const onSelectSpace = async () => {
    try {
      setIsLoading(true);
      if (!isRoomTitle || !isRoomDesc)
        return alert("방 제목과 설명을 정확히 입력해주세요.");
      //   setIsCreateRoomOpen(false);
      const result = await room.createRoom(21, isRoomTitle, isRoomDesc);
      const { status } = result;
      if (status === 200) {
        alert("방 생성이 완료되었습니다.");
        onCreateSpace();
        window.location.reload();
      } else {
        alert("방 생성에 실패하였습니다. 다시 시도해주세요.");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingComponent />}
      <ReactModal
        ariaHideApp={false}
        style={customStyles}
        isOpen={isCreateRoomOpen}
        onRequestClose={onCreateSpace}
      >
        <CreateRoomModalContainer>
          <RoomText>
            <span>어떤 공간에서 전시를 하시겠어요?</span>
          </RoomText>
          <RoomImageContainer>
            <RoomImageSlider />
          </RoomImageContainer>
          <RoomInfoContainer>
            <RoomInfoLabel>
              <label>
                <span>전시 제목</span>
              </label>
            </RoomInfoLabel>
            <RoomInfoInput>
              <input
                name="isRoomTitle"
                type="text"
                required
                value={isRoomTitle}
                onChange={onChange}
                placeholder="전시 제목을 입력해주세요."
              />
            </RoomInfoInput>
          </RoomInfoContainer>
          <RoomInfoContainer>
            <RoomInfoLabel>
              <label>
                <span>전시 설명</span>
              </label>
            </RoomInfoLabel>
            <RoomInfoInput>
              <input
                name="isRoomDesc"
                type="text"
                required
                value={isRoomDesc}
                onChange={onChange}
                placeholder="전시 공간을 설명해주세요."
              />
            </RoomInfoInput>
          </RoomInfoContainer>
          <ButtonContainer>
            <SelectButton>
              <button onClick={onSelectSpace}>전시공간 만들기</button>
            </SelectButton>
          </ButtonContainer>
        </CreateRoomModalContainer>
      </ReactModal>
    </>
  );
};

export default CreateSpaceModal;
