import axios from "axios";
import React, { useState } from "react";
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

const SignInButton = styled.div`
  display: flex;
  margin-top: 12px;

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

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onChange = (event) => {
    console.log(event.target.value);
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await sign.getSign();
      console.log(result);
    } catch (e) {
      console.log(e);
    }

    // await axios
    //   .post("http://localhost:3000/sign", {
    //     email: email,
    //     password: password,
    //     nickname: nickname,
    //     phone_num: phoneNum,
    //   })
    //   .then((res) => console.log(res));
  };
  return (
    <SignInWrap>
      <SignInContainer>
        <SignInTitleSection>
          <SignInTitle>Welcome to AiM!</SignInTitle>
        </SignInTitleSection>
        <SignWithGoogleContainer onClick={onSubmit}>
          Sign in with Google
        </SignWithGoogleContainer>
        <SignDivider>
          <span>or</span>
        </SignDivider>
        {/* <form  onSubmit={onsubmit}> */}
        <form>
          <EmailSignInContainer>
            <SignInLabel>
              <label>
                <span>Email</span>
              </label>
            </SignInLabel>
            <SignInInput>
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={onChange}
                placeholder="Enter your email address"
              />
            </SignInInput>
          </EmailSignInContainer>
          <EmailSignInContainer style={{ marginTop: 20 }}>
            <SignInLabel>
              <label>
                <span>Password</span>
              </label>
            </SignInLabel>
            <SignInInput>
              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={onChange}
                placeholder="Enter your password"
              />
            </SignInInput>
          </EmailSignInContainer>
          <SignInButton>
            <button>Sign in</button>
          </SignInButton>
        </form>
      </SignInContainer>
    </SignInWrap>
  );
};

export default SignIn;
