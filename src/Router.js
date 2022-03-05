import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./routes/Signup";
import SignIn from "./routes/SignIn";
import Lobby from "./routes/Lobby";
import Room from "./routes/Room";
import Room1 from "./routes/Room1";
import React from "react";
import Room2 from "./routes/Room2";
import PictureFrame from "./components/pictureFrame";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/picture" element={<PictureFrame />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/room1/:roomId" element={<Room1 />} />
        <Route path="/room2/:roomId" element={<Room2 />} />
      </Routes>
    </BrowserRouter>
  );
};
