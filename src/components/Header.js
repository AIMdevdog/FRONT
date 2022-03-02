import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { user } from "../config/api";
import LoadingComponent from "./Loading";
import Slider from "react-slick";
import React from "react";

import { Cookies } from "react-cookie";

import CreateSpaceModal from "./CreateSpaceModal";
import { connect } from "react-redux";
import { actionCreators } from "../store";

const cookies = new Cookies();

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

const UserInfoModalContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 7;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
`;

const UserInfoModal = styled.div`
  display: flex;
  background-color: rgb(32, 37, 64);
  flex-direction: column;
  padding: 32px;
  border-radius: 32px;
  z-index: 7;
  position: relative;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const UserInfoTopSection = styled.div`
  border-radius: 32px 32px 0px 0px;
  -webkit-box-pack: center;
  justify-content: center;
  background-color: rgb(51, 58, 100);
  display: flex;
  height: 30vh;
  position: relative;
  min-height: 200px;
  max-height: 240px;
  margin: -32px -32px 0px;

  img {
    width: 118px;
    height: 236px;
    object-fit: cover;
    object-position: 0px 0px;
    image-rendering: pixelated;
    position: absolute;
    bottom: 0px;
    z-index: 1;
    transform: translate3d(0px, 0px, 0px);
  }
`;

const UserNickname = styled.div`
  display: flex;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  width: fit-content;
  border-radius: 8px;
  cursor: pointer;
  position: absolute;
  top: 20px;
  left: 20px;

  span {
    color: white;
    font-family: "DM Sans", sans-serif;
    font-weight: 700;
    font-size: 15px;
    line-height: 20px;
  }
`;

const UserInfoBottomSection = styled.div`
  display: flex;
  padding-top: 20px;
  width: 372px;
  flex-direction: column;
`;

const UserInfoBottomInputSection = styled.div`
  display: flex;
  padding: 12px;
  flex-direction: column;

  &:nth-child(1) {
    display: flex;
    /* margin-bottom: 10px; */

    span {
      color: rgb(255, 255, 255);
      font-family: "DM Sans", sans-serif;
      font-weight: 700;
      font-size: 18px;
      line-height: 26px;
    }
  }

  &:nth-child(2) {
    display: flex;
    /* margin-bottom: 10px; */

    span {
      color: rgb(202, 216, 255);
      font-family: "DM Sans", sans-serif;
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
    }
  }

  &:nth-child(3) {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;

    div {
      display: flex;
      flex-direction: column;
      width: 100%;

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
        }
      }
    }
  }
`;

const SetButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;

  div {
    display: flex;
    margin: 8px;
  }
`;

const BackButton = styled.button`
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
  background-color: rgb(84, 92, 143);
  border: 2px solid transparent;
  padding: 0px 16px;
  width: auto;
  height: 48px;
  border-radius: 16px;
  font-size: 15px;
  color: rgb(255, 255, 255) !important;
`;

const FinishButton = styled.button`
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
  height: 48px;
  border-radius: 16px;
  font-size: 15px;
  color: rgb(40, 45, 78) !important;
`;

const ArrowWrap = styled.div`
  .slick-prev {
    left: 3% !important;
    z-index: 1;
  }
  .slick-next {
    right: 3% !important;
    z-index: 1;
  }
  .slick-slide > div > div {
    display: flex !important;
    justify-content: center;
    width: 180px;
    height: 180px;
  }

  .slick-dots > ul > li {
    width: 30px;
    height: 30px;
  }
`;

const Header = ({ userData, loadUserData }) => {
  const navigate = useNavigate();
  const isLogin = cookies.get("refresh-token");

  const defaultImage =
    "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-MPN2TapcbBVMdbCP0jR6.png";

  const [isPath, setIsPath] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isSaveUserData, setIsSaveUserData] = useState(null);
  //userSettingContainer에 사용되는 변수들
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isNickname, setIsNickname] = useState("");
  const [isCurrentImg, setCurrent] = useState(0);
  const charImgs = [
    "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-MPN2TapcbBVMdbCP0jR6.png",
    "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-sb7g6nQb3ZYxzNHryIbM.png",
    "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-vjTD4tj1AdR3182C7mHH.png",
    "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-XJBZpqmKhGvW3haxYtJO-I7vkRzijl8vBGm5LRwQT-uBxqrmbWQ15ykHxtWAi5-VztAi3oJnxQHhHU1sWpH-WW1GTt4cFIfI7aG4zd1o.png",
    "https://dynamic-assets.gather.town/sprite/avatar-pYI5t3fZnQhRlQnCPEE1-C0ykfrlDx7AkQsLyLcNS-XJBZpqmKhGvW3haxYtJO-I7vkRzijl8vBGm5LRwQT-SC1roOyG6AGYCzcBSZam-VV89xZCDRo6OfVKMiHDL.png",
    "https://dynamic-assets.gather.town/sprite/avatar-pP91s8KE7enD7HAXD27i-dQCYs4n7O99ksXuBIe33-XJBZpqmKhGvW3haxYtJO-I7vkRzijl8vBGm5LRwQT-sVKwufLMwK1Arxlf97pz-lnwpCVixsUIqSixRPC8T.png",
    "https://dynamic-assets.gather.town/sprite/avatar-C0ykfrlDx7AkQsLyLcNS-O4fcHqx7z1JBI5wTYaS6-yFpcQh7UcvdChVN8WvIW-Hj5gUXZlV0buPDZNyVjq-ajuL49i7C1GPb3SSzdGE-JB1jFMCsTzYIs8ZXSewh.png",
    "https://dynamic-assets.gather.town/sprite/avatar-aeJhE2yHSYx7EfnQKpTW-ZMvgHzgMYMTUHLHlSmLS-8hCSfYIK6RvpToNgMJNB-xayLOInw3HISMHHNcXwg-yFpcQh7UcvdChVN8WvIW-SC1roOyG6AGYCzcBSZam-QD1dfiGx3GhblDjHCj3T-eeWeU121K33Guk3ms1Kn-5rg2xBZpHHxlFKNCLJvZ.png",
  ];
  const initIndex = charImgs.indexOf(isSaveUserData?.character);

  useEffect(() => {
    const {
      location: { pathname },
    } = window;

    const isLogged = () => {
      if (!isLogin) {
        // alert("로그인 세션이 만료되었습니다.");
        navigate("/");
      }
    };

    setIsPath(pathname);
    isLogged();
  }, [isPath]);

  useEffect(() => {
    loadUserData();

    userData.then((data) => {
      setIsSaveUserData(data)
    })
    // const getUser = async () => {
    //   try {
    //     const requestUserData = await user.getUserInfo();
    //     const {
    //       data: { result },
    //     } = requestUserData;
    //     if (result) {
    //       setIsSaveUserData(result);
    //     }
    //   } catch (e) {
    //     console.log(e);
    //   }
    // };

    // getUser();
  }, []);

  const onCreateSpace = () => {
    setIsCreateRoomOpen(!isCreateRoomOpen);
  };

  const isLogOut = () => {
    cookies.remove("refresh-token");
    cookies.remove("access-token");
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const openSettingContainer = () => {
    setIsNickname("");
    setCurrent(charImgs[initIndex]);
    setIsSettingOpen(!isSettingOpen);
  };

  const settings = {
    dots: true,
    // lazyLoad: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: initIndex,
    beforeChange: (current, next) => {
      setCurrent((before) => (before = charImgs[next]));
    },
    appendDots: (dots) => (
      <div>
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: (i) => {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            overflow: "hidden",
            position: "relative",
            backgroundColor: "rgb(34, 34, 34)",
            outline: charImgs[i] === isCurrentImg ? "2px solid white" : "none",
          }}
        >
          <img
            src={`${charImgs[i]}`}
            style={{
              right: "-1px",
              objectFit: "cover",
              objectPosition: "-1px 9px",
              width: "100%",
              height: "200%",
              imageRendering: "pixelated",
              transform: "scale(1.25)",
            }}
            alt="character list"
          />
        </div>
      );
    },
  };

  const onChangeNickname = (event) => {
    const {
      target: { value },
    } = event;

    setIsNickname(value);
  };

  const saveUserInfo = async () => {
    try {
      setIsLoading(true);
      if (!isNickname) return alert("nickname을 입력해주세요.");
      const requestResult = await user.saveUserInfo(isNickname, isCurrentImg);
      const {
        data: { msg },
      } = requestResult;
      if (msg) {
        const requestUserData = await user.getUserInfo();
        const {
          data: { result },
        } = requestUserData;
        if (result) {
          alert(msg);
          setIsSaveUserData(result);
          setIsSettingOpen(!isSettingOpen);
        }
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
          {/* <LogoSpan onClick={onClickLogo}> */}
          <LogoSpan>
            <span>AiM</span>
          </LogoSpan>
        </LeftSection>
        <RightSection>
          <RightSectionUserProfile>
            <UserProfile onClick={openSettingContainer}>
              <button>
                <UserProfileImage>
                  <div>
                    <div>
                      <img
                        src={
                          isSaveUserData?.character
                            ? isSaveUserData?.character
                            : defaultImage
                        }
                        alt="profileImage"
                      />
                    </div>
                  </div>
                </UserProfileImage>
                <UserProfileNickname>
                  {isSaveUserData ? (
                    <span>{isSaveUserData?.nickname}</span>
                  ) : (
                    <span>Anonymous</span>
                  )}
                </UserProfileNickname>
              </button>
            </UserProfile>
            <LogoutButton onClick={isLogOut}>로그아웃</LogoutButton>
            <CreateButton onClick={onCreateSpace}>전시공간 만들기</CreateButton>
          </RightSectionUserProfile>
        </RightSection>
      </HeaderContainer>
      <CreateSpaceModal
        isCreateRoomOpen={isCreateRoomOpen}
        onCreateSpace={onCreateSpace}
      />
      {isSettingOpen && (
        <UserInfoModalContainer>
          <UserInfoModal>
            <UserInfo>
              <UserInfoTopSection>
                <div
                  style={{
                    marginTop: "15px",
                    width: "400px",
                    height: "240px",
                  }}
                >
                  <ArrowWrap>
                    <Slider {...settings}>
                      {charImgs.map((charSrc, index) => {
                        return (
                          <div key={index}>
                            <img src={charSrc} alt="user-character" />
                          </div>
                        );
                      })}
                    </Slider>
                  </ArrowWrap>
                </div>
              </UserInfoTopSection>
              <UserNickname>
                {isSaveUserData?.nickname ? (
                  <span>{isSaveUserData?.nickname}</span>
                ) : (
                  <span>Anonymous</span>
                )}
              </UserNickname>
              <UserInfoBottomSection>
                <UserInfoBottomInputSection>
                  <div>
                    <span>캐릭터를 선택하고 이름을 지어보세요!</span>
                  </div>
                </UserInfoBottomInputSection>
                <UserInfoBottomInputSection>
                  <div>
                    <span>
                      걱정하지말고 닉네임을 입력하세요!
                      <br />
                      수정이 가능합니다!
                    </span>
                  </div>
                </UserInfoBottomInputSection>
                <UserInfoBottomInputSection>
                  <div>
                    <div>
                      <input
                        type="text"
                        maxLength="50"
                        name="nickname"
                        required
                        value={isNickname}
                        onChange={onChangeNickname}
                        placeholder="닉네임을 입력해주세요."
                      />
                    </div>
                  </div>
                </UserInfoBottomInputSection>
                <SetButtonContainer>
                  <div>
                    <BackButton onClick={openSettingContainer}>닫기</BackButton>
                  </div>
                  <div>
                    <FinishButton onClick={saveUserInfo}>완료</FinishButton>
                  </div>
                </SetButtonContainer>
              </UserInfoBottomSection>
            </UserInfo>
          </UserInfoModal>
        </UserInfoModalContainer>
      )}
      {/* {isCreateRoomOpen && (
        
      )} */}
    </>
  );
};

function mapStateToProps(state) {
  return {
    userData: state,
  };
}
function mapDispachProps(dispatch) {

  return {
    loadUserData: () => dispatch(actionCreators.loadUserData())
  }
}

export default connect(mapStateToProps, mapDispachProps)(Header);
