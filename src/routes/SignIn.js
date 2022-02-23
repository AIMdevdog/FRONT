import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import GoogleButton from "../components/GoogleLogin";
import { sign } from "../config/api";
import assets from "../config/assets";
import { FaLongArrowAltRight } from "react-icons/fa";
import { localGetItem, localSetItem } from "../utils/handleStorage";
import LoadingComponent from "../components/Loading";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

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
  padding: 56px 56px 46px 56px;
  box-shadow: rgb(0 0 0 / 55%) 0px 10px 25px;
`;

const SignInTitleSection = styled.div`
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
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

const SignWithGoogleContainer = styled.button`
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
  border: 2px solid rgb(40, 45, 78);
  padding: 0px 16px;
  width: auto;
  height: 48px;
  border-radius: 16px;
  font-size: 15px;
  color: rgb(40, 45, 78) !important;
`;

const SignDivider = styled.div`
  display: flex;
  margin-top: 8px;
  margin-bottom: 8px;

  span {
    color: rgb(113, 113, 113);
    font-family: "DM Sans", sans-serif;
    font-weight: 500;
    font-size: 15px;
    line-height: 20px;
    text-align: center;
    width: 100%;
  }
`;

const EmailSignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SignInLabel = styled.div`
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
  margin-top: 24px;
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
    opacity: 1;
    overflow: hidden;
    background-color: rgb(6, 214, 160);
    border: 2px solid transparent;
    padding: 0px 16px;
    width: 100%;
    height: 48px;
    border-radius: 16px;
    font-size: 15px;
    /* color: rgb(40, 45, 78) !important; */
    color: white !important;
  }
`;

const SignUpButton = styled.div`
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

const GetErrorSpan = styled.span`
  margin-top: 4px;
  margin-left: 21px;
  font-size: 12px;
  color: red;
`;

const SignIn = () => {
  const navigate = useNavigate();
  const isLogin = cookies.get("refresh-token");
  const [isEmail, setEmail] = useState("");
  const [isPassowrd, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 이메일 비밀번호가 잘못된 경우 체크
  const [emailFlag, setEmailFlag] = useState(false);
  const [passwordFlag, setPasswordFlag] = useState(false);

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      if (emailFlag) {
        setEmailFlag(false);
      }
      setEmail(value);
    } else if (name === "password") {
      if (passwordFlag) {
        setPasswordFlag(false);
      }
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (!isEmail || !isPassowrd) return alert("똑바로 입력해라!");
      const requestResult = await sign.getSign(isEmail, isPassowrd);
      const {
        data: { msg, result },
      } = requestResult;
      if (!result) {
        if (msg === "회원정보가 없습니다.") {
          return setEmailFlag(true);
        } else {
          return setPasswordFlag(true);
        }
      }
      const { access_token, refresh_token } = result;
      cookies.set("access-token", access_token, { maxAge: 3600 });
      cookies.set("refresh-token", refresh_token, { maxAge: 259200 });
      navigate("/lobby");
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickSignUp = (event) => {
    navigate("/signup");
  };

  useEffect(() => {
    if (isLogin) {
      navigate("/lobby");
    }
  });

  return (
    <>
      {isLoading && <LoadingComponent />}
      <SignInWrap>
        <SignInContainer>
          <SignInTitleSection>
            <SignInTitle>Welcome to AiM!</SignInTitle>
          </SignInTitleSection>
          {/* <SignWithGoogleContainer onClick={onSubmit}>
          Sign in with Google
        </SignWithGoogleContainer> */}
          <GoogleButton />
          <SignDivider>
            <span>or</span>
          </SignDivider>
          {/* <form  onSubmit={onsubmit}> */}
          <form>
            <EmailSignInContainer>
              <SignInLabel>
                <label>
                  <span>이메일</span>
                </label>
              </SignInLabel>
              <SignInInput>
                <input
                  name="email"
                  type="email"
                  required
                  value={isEmail}
                  onChange={onChange}
                  placeholder="이메일을 입력하세요."
                />
              </SignInInput>
              {emailFlag ? (
                <GetErrorSpan> 가입되지 않은 이메일입니다.</GetErrorSpan>
              ) : null}
            </EmailSignInContainer>
            <EmailSignInContainer style={{ marginTop: 20 }}>
              <SignInLabel>
                <label>
                  <span>비밀번호</span>
                </label>
              </SignInLabel>
              <SignInInput>
                <input
                  name="password"
                  type="password"
                  minLength="6"
                  required
                  value={isPassowrd}
                  onChange={onChange}
                  placeholder="비밀번호를 입력하세요."
                />
              </SignInInput>
              {passwordFlag ? (
                <GetErrorSpan> 잘못된 비밀번호입니다.</GetErrorSpan>
              ) : null}
            </EmailSignInContainer>
            <SignButton>
              <button onClick={onSubmit}> 로그인 </button>
            </SignButton>
            <SignUpButton>
              <button onClick={onClickSignUp}> 회원가입 </button>
              <FaLongArrowAltRight color="rgb(40, 45, 78)" />
            </SignUpButton>
          </form>
        </SignInContainer>
      </SignInWrap>
    </>
  );
};

export default SignIn;
