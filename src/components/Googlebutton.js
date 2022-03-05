import React, { Component } from "react";
import { GoogleLogin } from "react-google-login";
import styled from "styled-components";

const clientId =
  "858907804285-d3s9e8of8i9nu4v8ampm3kr9ltko6uer.apps.googleusercontent.com";

class Googlebutton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      provider: "",
    };
  }
  // Google Login
  responseGoogle = (res) => {
    // console.log(this.provider);
    // console.log(res)
    // console.log(res.Ju.zv);
  };

  // Login Fail
  responseFail = (err) => {
    console.error(err);
  };

  render() {
    return (
      <Container>
        <GoogleLogin
          clientId={clientId}
          buttonText="구글로 로그인하기"
          onSuccess={this.responseGoogle}
          onFailure={this.responseFail}
        />
      </Container>
    );
  }
}

const Container = styled.div`
  width: 200px;
  height: 20px;
  display: flex;
  flex-flow: column wrap;
`;

export default Googlebutton;
