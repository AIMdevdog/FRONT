import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { room } from "../config/api";
import { localGetItem, removeItem } from "../utils/handleStorage";
import LoadingComponent from "./Loading";
import React from "react";

const HeaderContainer = styled.div`
  background-color: rgb(51, 58, 100);
  justify-content: space-between;
  align-items: center;
  z-index: 0;
  padding: 16px 40px;
  display: ${(props) => (props.path === "/signin" ? "none" : "flex")};
`;
const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  margin-left: 16px;
  align-items: center;
`;

const RightSectionUserProfile = styled.div`
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  position: relative;
  user-select: none;
  display: flex;
`;

const UserProfile = styled.div`
  display: flex;
  margin-left: 4px;
  margin-right: 4px;

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
    background-color: transparent;
    border: 2px solid transparent;
    padding: 0px 16px;
    width: auto;
    height: 40px;
    border-radius: 16px;
    font-size: 15px;
    color: rgb(255, 255, 255) !important;
  }
`;

const UserProfileImage = styled.div`
  display: flex;
  margin-right: 12px;

  div {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    position: relative;
    user-select: none;
    flex-shrink: 0;
    div {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      background-color: rgb(34, 34, 34);

      img {
        object-fit: cover;
        object-position: 0px -18px;
        width: 100%;
        height: 200%;
        image-rendering: pixelated;
        transform: scale(1.25);
      }
    }
  }
`;

const UserProfileNickname = styled.div`
  display: flex;
  margin-right: 4px;
  max-width: 112px;

  span {
    color: rgb(255, 255, 255);
    font-family: "DM Sans", sans-serif;
    font-weight: 700;
    font-size: 15px;
    line-height: 20px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const LogoSpan = styled.div`
  cursor: pointer;
  span {
    color: rgb(255, 255, 255);
    font-family: "DM Sans", sans-serif;
    font-weight: 700;
    font-size: 15px;
    line-height: 20px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const CreateButton = styled.button`
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
  width: auto;
  height: 40px;
  border-radius: 16px;
  font-size: 15px;
  color: rgb(40, 45, 78) !important;
`;

const LogoutButton = styled.button`
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
  background-color: transparent;
  border: 2px solid transparent;
  padding: 0px 16px;
  width: auto;
  height: 40px;
  border-radius: 16px;
  font-size: 15px;
  color: white;
  margin-right: 20px;
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

const RoomImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  div {
    outline: rgba(255, 255, 255, 0.1) solid 0.6px;
    cursor: pointer;
    border-radius: 18px;
    background: rgb(84, 92, 143);
    margin: 6px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 285px;
    position: relative;
    transition: top 0.2s ease 0s;
    top: 0px;

    img {
    }
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
  border: 2px solid rgb(151, 151, 151);
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

const Header = (props) => {
  const { user } = props;
  const navigate = useNavigate();
  const session = localGetItem("session");
  const defaultImage =
    "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-MPN2TapcbBVMdbCP0jR6.png";
  const [isRoomTitle, setIsRoomTitle] = useState("");
  const [isRoomDesc, setIsRoomDesc] = useState("");
  const [isPath, setIsPath] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);

  const roomImage =
    "https://aim-image-storage.s3.ap-northeast-2.amazonaws.com/map2.png";

  const onClickLogo = () => {
    if (session) {
      navigate("/lobby");
    } else {
      navigate("/signin");
    }
  };
  const onCreateSpace = () => {
    setIsCreateRoomOpen(!isCreateRoomOpen);
  };
  const isLogOut = () => {
    const result = removeItem("session");
    console.log(result);
    navigate("/signin");
  };

  useEffect(() => {
    const {
      location: { pathname },
    } = window;

    setIsPath(pathname);
  }, [isPath]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const session = localGetItem("session");
        if (!session) return navigate("/signin");
      } catch (e) {
        console.log(e);
      }
    };
    getUserInfo();
  }, []);

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
      setIsCreateRoomOpen(false);
      const result = await room.createRoom(
        user?.id,
        roomImage,
        isRoomTitle,
        isRoomDesc
      );
      const { status } = result;
      if (status === 200) {
        alert("방 생성이 완료되었습니다.");
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
      <HeaderContainer path={isPath}>
        <LeftSection>
          <LogoSpan onClick={onClickLogo}>
            <span>AiM</span>
          </LogoSpan>
        </LeftSection>
        <RightSection>
          <RightSectionUserProfile>
            <UserProfile>
              <button>
                <UserProfileImage>
                  <div>
                    <div>
                      <img
                        src={user?.character ? user?.character : defaultImage}
                        alt="profile image"
                      />
                    </div>
                  </div>
                </UserProfileImage>
                <UserProfileNickname>
                  {user ? (
                    <span>{user?.nickname}</span>
                  ) : (
                    <span>Anonymous</span>
                  )}
                </UserProfileNickname>
              </button>
            </UserProfile>
            <LogoutButton onClick={isLogOut}>Logout</LogoutButton>
            <CreateButton onClick={onCreateSpace}>Create Space</CreateButton>
          </RightSectionUserProfile>
        </RightSection>
      </HeaderContainer>
      <ReactModal
        style={customStyles}
        isOpen={isCreateRoomOpen}
        onRequestClose={onCreateSpace}
      >
        <CreateRoomModalContainer>
          <RoomText>
            <span>What are you looking to do on Gather?</span>
          </RoomText>
          <RoomImageContainer>
            <div>
              <img src={roomImage} alt="room image" />
            </div>
          </RoomImageContainer>
          <RoomInfoContainer>
            <RoomInfoLabel>
              <label>
                <span>Title</span>
              </label>
            </RoomInfoLabel>
            <RoomInfoInput>
              <input
                name="isRoomTitle"
                type="text"
                required
                value={isRoomTitle}
                onChange={onChange}
                placeholder="Enter your Room Title"
              />
            </RoomInfoInput>
          </RoomInfoContainer>
          <RoomInfoContainer>
            <RoomInfoLabel>
              <label>
                <span>Description</span>
              </label>
            </RoomInfoLabel>
            <RoomInfoInput>
              <input
                name="isRoomDesc"
                type="text"
                required
                value={isRoomDesc}
                onChange={onChange}
                placeholder="Enter your Room Title"
              />
            </RoomInfoInput>
          </RoomInfoContainer>
          <ButtonContainer>
            <SelectButton>
              <button onClick={onSelectSpace}>Select Space</button>
            </SelectButton>
          </ButtonContainer>
        </CreateRoomModalContainer>
      </ReactModal>
      {/* {isCreateRoomOpen && (
        
      )} */}
    </>
  );
};

export default Header;
