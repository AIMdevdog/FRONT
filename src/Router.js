import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Signup from "./routes/Signup";
import SignIn from "./routes/SignIn";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
};
