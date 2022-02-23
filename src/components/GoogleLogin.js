import React, { useState } from "react";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router";
import { sign } from "../config/api";
import { Cookies } from "react-cookie";
import styled from "styled-components";

const cookies = new Cookies();
const clientId =
  "958093468974-hqffmp56ta66fl1f7la11pb5t3tpc80o.apps.googleusercontent.com";

const GoogleLoginButtonBox = styled(GoogleLogin)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid rgb(151, 151, 151) !important;
  border-radius: 14px !important;
  box-shadow: none !important;
`;

const GoogleButton = ({ onSocial }) => {
  const navigate = useNavigate();
  const onSuccess = async (response) => {
    try {
      const {
        accessToken,
        profileObj: { email },
      } = response;

      console.log(accessToken, email);

      const result = await sign.getGoogleSign(accessToken, email);
      const { data, status } = result;
      if (status === 200) {
        cookies.set("access-token", data?.accessToken, { maxAge: 3600 });
        cookies.set("refresh-token", data?.accessToken, { maxAge: 259200 });
        navigate("/lobby", { state: data });
      } else {
        alert("로그인에 실패하였습니다.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onFailure = (error) => {
    console.log(error);
    alert("구글 로그인이 실패하였습니다. 다시 시도해주세요.");
  };

  return (
    <div>
      <GoogleLoginButtonBox
        className="google-login"
        clientId={clientId}
        responseType={"id_token"}
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
    </div>
  );
};

export default GoogleButton;
