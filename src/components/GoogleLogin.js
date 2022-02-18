import React, { useState } from "react";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router";
import { sign } from "../config/api";
import { localSetItem } from "../utils/handleStorage";

const clientId =
  "958093468974-hqffmp56ta66fl1f7la11pb5t3tpc80o.apps.googleusercontent.com";

const GoogleButton = ({ onSocial }) => {
  const navigate = useNavigate();
  const onSuccess = async (response) => {
    try {
      const {
        googleId,
        accessToken,
        profileObj: { email, name },
      } = response;

      console.log(accessToken, email)

      const result = await sign.getGoogleSign(accessToken, email);
      const { data, status } = result;
      if (status === 200) {
        await localSetItem("session", data?.accessToken, 20160);
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
      <GoogleLogin
        clientId={clientId}
        responseType={"id_token"}
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
    </div>
  );
};

export default GoogleButton;
