import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { localGetItem } from "../utils/handleStorage";

const HeaderContainer = styled.div`
  background-color: rgb(51, 58, 100);
  justify-content: space-between;
  align-items: center;
  z-index: 5;
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

const Header = () => {
  const navigate = useNavigate();
  const [isPath, setIsPath] = useState("");
  const [name, setName] = useState("");

  const onClickLogo = () => {
    navigate("/signin");
  };
  const onCreateSpace = () => {
    alert(1);
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
        if (!session) return navigate("signin");
        console.log(session);
      } catch (e) {
        console.log(e);
      }
    };
    getUserInfo();
  }, []);

  return (
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
                      src="https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-MPN2TapcbBVMdbCP0jR6.png"
                      alt="profile image"
                    />
                  </div>
                </div>
              </UserProfileImage>
              <UserProfileNickname>
                {name ? <span>{name}</span> : <span>Anonymous</span>}
              </UserProfileNickname>
            </button>
          </UserProfile>
          <CreateButton onClick={onCreateSpace}>Create Space</CreateButton>
        </RightSectionUserProfile>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;
