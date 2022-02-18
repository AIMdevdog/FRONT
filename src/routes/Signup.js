import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { sign } from "../config/api";
import assets from "../config/assets";

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
  width: 100%;
`;

const UserInfoLabel = styled.div`
  display: flex;
  margin-bottom: 4px;

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
    background-color: rgb(6, 214, 160);
    border: 2px solid transparent;
    padding: 0px 16px;
    width: 100%;
    height: 48px;
    border-radius: 16px;
    font-size: 15px;
    color: rgb(40, 45, 78) !important;
    margin-top: 3%;
  }
`;

const ExistSpan = styled.span`
  margin-top: 4px;
  margin-left: 21px;
  font-size: 12px;
  color: red;
`;

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickName] = useState("");

  // ***이 존재합니다 표시용 flag들
  const [emailFlag, setEmailFlag] = useState(false);
  const [nicknameFlag, setNicknameFlag] = useState(false);

  const onChange = (event) => {
    setEmailFlag(false);
    setNicknameFlag(false);
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "nickname") {
      setNickName(value);
    }
  };
  const signUpSubmit = async (event) => {
    event.preventDefault();
    console.log(event.target);
    try {
      const {
        data: { code, msg }
      }
        = await sign.createUser(email, password, nickname);
      if (code === 400) {
        if (msg === "이메일 존재") {
          showExistEmailSpan();
          console.log(msg);
        } else {
          showExistNicknameSpan();
          console.log(msg);
        }
      } else if (code === 200) {
        alert("회원가입이 성공했습니다.")
        navigate('/')
      }
    } catch (e) {
      console.log(e);
    }
  }
  const showExistEmailSpan = () => {
    setEmailFlag(true);
  }
  const showExistNicknameSpan = () => {
    setNicknameFlag(true);
  }

  return (
    <SignInWrap>
      <SignInContainer>
        <SignInTitleSection>
          <SignInTitle>Welcome to AiM!</SignInTitle>
        </SignInTitleSection>
        {/* <form  onSubmit={onsubmit}> */}
        <form>
          <UserInfoContainer>
            <UserInfoLabel>
              <label>
                <span>이메일</span>
              </label>
            </UserInfoLabel>
            <SignInInput>
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={onChange}
                placeholder="이메일을 입력해주세요."
              />
            </SignInInput>
            {emailFlag ? <ExistSpan> 이미 가입된 이메일입니다.</ExistSpan> : null}
          </UserInfoContainer>
          <UserInfoContainer style={{ marginTop: 20 }}>
            <UserInfoLabel>
              <label>
                <span>비밀번호</span>
              </label>
            </UserInfoLabel>
            <SignInInput>
              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={onChange}
                placeholder="비밀번호를 입력해주세요."
              />
            </SignInInput>
          </UserInfoContainer>
          <UserInfoContainer style={{ marginTop: 20 }}>
            <UserInfoLabel>
              <label>
                <span>닉네임</span>
              </label>
            </UserInfoLabel>
            <SignInInput>
              <input
                name="nickname"
                type="nickname"
                required
                value={nickname}
                onChange={onChange}
                placeholder="닉네임을 입력해주세요."
              />
            </SignInInput>
            {nicknameFlag ? <ExistSpan> 이미 존재하는 닉네임입니다.</ExistSpan> : null}
          </UserInfoContainer>
          <SignButton>
            <button onClick={signUpSubmit}> 가입하기 </button>
          </SignButton>
        </form>
      </SignInContainer>
    </SignInWrap>
  );
};

export default SignUp;
