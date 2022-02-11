import React from "react";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router";

const clientId =
  "958093468974-hqffmp56ta66fl1f7la11pb5t3tpc80o.apps.googleusercontent.com";

const GoogleButton = ({ onSocial }) => {
  const navigate = useNavigate();
  const onSuccess = async (response) => {
    console.log(response);

    const {
      googleId,
      profileObj: { email, name },
    } = response;

    navigate("/lobby");

    // await onSocial({
    //   socialId: googleId,
    //   socialType: "google",
    //   email,
    //   nickname: name,
    // });
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
