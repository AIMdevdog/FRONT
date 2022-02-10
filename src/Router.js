import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Signup from "./routes/Signup";
import SignIn from "./routes/SignIn";
import Lobby from "./routes/Lobby";
import Header from "./components/Header";

export const Router = (props) => {
  const {
    location: { pathname },
  } = window;
  return (
    <BrowserRouter>
      <Header path={pathname} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/lobby" element={<Lobby />} />
      </Routes>
    </BrowserRouter>
  );
};
