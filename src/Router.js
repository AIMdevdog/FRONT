import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Signup from "./routes/Signup";
import SignIn from "./routes/SignIn";
import Lobby from "./routes/Lobby";
import Header from "./components/Header";
import Room from "./routes/Room";
import Room1 from "./routes/Room1";
import SimpleSlider from "./components/CharacterSlider";
import React from "react";

export const Router = () => {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/room" element={<Room />} />
        <Route path="/room1" element={<Room1 />} />
        <Route path="/slider" element={<SimpleSlider />} />
      </Routes>
    </BrowserRouter>
  );
};
