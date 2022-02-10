import axios from "axios";
import React, { useState } from "react";
import GetUserName from "../components/GetUserName";
import Googlebutton from "../components/Googlebutton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = (event) => {
    event.preventDefault();
    const data = GetUserName(email);
    console.log(data);
  };
  const handleSignBtnClick = (event) => {
    window.location.replace("/sign");
  };
  return (
    <div className="loginForm">
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <button>log in</button>
        <button onClick={handleSignBtnClick}>sign in</button>
        <Googlebutton />
      </form>
    </div>
  );
};

export default Login;
