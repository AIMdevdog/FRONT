import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { sign } from "../config/api";
import assets from "../config/assets";
import { FaLongArrowAltRight } from "react-icons/fa";
import LoadingComponent from "../components/Loading";
import { isValidEmailFormat, isValidPassword } from "../utils/validation";
import bcrypt from "bcryptjs";

const SignInWrap = styled.div`
  /* width: 100%; */
  /* height: 100%; */
  height: 100vh;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  background-image: url(${assets.sign_page.background});
`;

const SignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 500px;
  border-radius: 32px;
  padding: 56px;
  box-shadow: rgb(0 0 0 / 55%) 0px 10px 25px;
`;

const SignInTitleSection = styled.div`
  display: flex;
  margin-top: 10px;
  margin-bottom: 40px;
`;

const SignInTitle = styled.span`
  color: rgb(40, 45, 78);
  font-family: "DM Sans", sans-serif;
  font-weight: 700;
  font-size: 26px;
  line-height: 34px;
  text-align: center;
  width: 100%;
`;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`;

const UserInfoLabel = styled.div`
  display: flex;
  margin-bottom: 10px;

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

const SignInInput = styled.div`
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
    color: rgb(17, 17, 17);
    width: 100%;
    height: 100%;
  }
`;

const SignButton = styled.div`
  display: flex;
  margin-top: 12px;
  justify-content: space-between;

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
    background-color: ${(props) =>
      props.isButtonDisabled ? "#999" : "rgb(6, 214, 160)"};
    border: 2px solid transparent;
    padding: 0px 16px;
    width: 100%;
    height: 48px;
    border-radius: 16px;
    font-size: 15px;
    color: white !important;
    margin-top: 3%;
  }
`;

const ExistSpan = styled.span`
  /* margin-top: 6px;
  margin-left: 21px; */
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 12px;
  color: red;
`;

const SignInButton = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 10px;

  button {
    background-color: transparent;
    border: none;
    color: rgb(40, 45, 78) !important;
  }
`;

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [nickname, setNickName] = useState("");
  const [isLoading, isSetLoading] = useState(false);

  // ***??? ??????????????? ????????? flag???
  const [isEmailError, setEmailError] = useState("");
  const [isPasswordError, setPasswordError] = useState("");
  const [nicknameFlag, setNicknameFlag] = useState(false);

  // signup disabled
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  // hash password
  const salt = bcrypt.genSaltSync(10);

  useEffect(() => {
    const isEmailValidation = () => {
      if (isValidEmailFormat(email)) {
        setEmailError("");
      } else {
        setEmailError("????????? ????????? ????????? ????????????.");
      }
    };

    const isPasswordConfirmValidation = () => {
      if (isValidPassword({ password, confPassword })) {
        setPasswordError("");
      } else {
        setPasswordError("??????????????? ????????????.");
      }
    };

    isEmailValidation();
    isPasswordConfirmValidation();
  }, [confPassword, email, password]);

  useEffect(() => {
    if (
      isEmailError ||
      isPasswordError ||
      !email ||
      !password ||
      !confPassword ||
      !nickname
    )
      return setButtonDisabled(true);
    if (
      !isEmailError ||
      !isPasswordError ||
      email ||
      password ||
      confPassword ||
      nickname
    )
      return setButtonDisabled(false);
  }, [confPassword, email, isEmailError, isPasswordError, password, nickname]);

  const onChange = (event) => {
    setEmailError("");
    setNicknameFlag(false);
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confPassword") {
      setConfPassword(value);
    } else if (name === "nickname") {
      setNickName(value);
    }
  };
  const signUpSubmit = async (event) => {
    event.preventDefault();
    isSetLoading(true);
    try {
      const hashedPassword = bcrypt.hashSync(password, salt);

      const {
        data: { code, msg },
      } = await sign.createUser(email, hashedPassword, nickname);
      if (msg === "??????????????? ?????????????????????.") {
        alert("??????????????? ??????????????????.");
        navigate("/");
      } else if (msg === "????????? ??????????????????.") {
        showExistEmailSpan();
      } else if (msg === "?????? ???????????? ??????????????????.") {
        showExistNicknameSpan();
      }
    } catch (e) {
      console.log(e);
    } finally {
      isSetLoading(false);
    }
  };
  const showExistEmailSpan = () => {
    setEmailError("?????? ????????? ??????????????????.");
  };
  const showExistNicknameSpan = () => {
    setNicknameFlag(true);
  };

  const onClickSignIn = () => {
    navigate("/");
  };

  return (
    <>
      {isLoading && <LoadingComponent />}
      <SignInWrap>
        <SignInContainer>
          <SignInTitleSection>
            <SignInTitle>Welcome to AiM!</SignInTitle>
          </SignInTitleSection>
          {/* <form  onSubmit={onsubmit}> */}
          <form>
            <UserInfoContainer style={{ paddingBottom: 20 }}>
              <UserInfoLabel>
                <label>
                  <span>?????????</span>
                </label>
              </UserInfoLabel>
              <SignInInput>
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={onChange}
                  placeholder="???????????? ??????????????????."
                />
              </SignInInput>
              {isEmailError ? <ExistSpan>{isEmailError}</ExistSpan> : null}
            </UserInfoContainer>
            <UserInfoContainer style={{ paddingBottom: 20 }}>
              <UserInfoLabel>
                <label>
                  <span>????????????</span>
                </label>
              </UserInfoLabel>
              <SignInInput>
                <input
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={onChange}
                  placeholder="??????????????? ??????????????????."
                />
              </SignInInput>
            </UserInfoContainer>
            <UserInfoContainer style={{ paddingBottom: 20 }}>
              <UserInfoLabel>
                <label>
                  <span>???????????? ??????</span>
                </label>
              </UserInfoLabel>
              <SignInInput>
                <input
                  name="confPassword"
                  type="password"
                  required
                  value={confPassword}
                  onChange={onChange}
                  placeholder="??????????????? ??????????????????."
                />
              </SignInInput>
              {isPasswordError ? (
                <ExistSpan>{isPasswordError}</ExistSpan>
              ) : null}
            </UserInfoContainer>
            <UserInfoContainer style={{ paddingBottom: 20 }}>
              <UserInfoLabel>
                <label>
                  <span>?????????</span>
                </label>
              </UserInfoLabel>
              <SignInInput>
                <input
                  name="nickname"
                  type="nickname"
                  required
                  value={nickname}
                  onChange={onChange}
                  placeholder="???????????? ??????????????????."
                />
              </SignInInput>
              {nicknameFlag ? (
                <ExistSpan> ?????? ???????????? ??????????????????.</ExistSpan>
              ) : null}
            </UserInfoContainer>
            <SignButton isButtonDisabled={isButtonDisabled}>
              <button disabled={isButtonDisabled} onClick={signUpSubmit}>
                ????????????
              </button>
            </SignButton>
            <SignInButton>
              <button onClick={onClickSignIn}> ????????? </button>
              <FaLongArrowAltRight color="rgb(40, 45, 78)" />
            </SignInButton>
          </form>
        </SignInContainer>
      </SignInWrap>
    </>
  );
};

export default SignUp;
