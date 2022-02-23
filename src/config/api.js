import axios from "../api/axios-instance";

export const token = {
  getRefreshToken: () => axios.get("users/refreshToken"),
};

export const sign = {
  getSign: (email, password) => axios.post("/users/login", { email, password }),
  getGoogleSign: (accessToken, email) =>
    axios.post("/users/auth/google", { accessToken, email }),
  createUser: (email, password, confPassword, nickname) =>
    axios.post("/users/signup", { email, password, confPassword, nickname }),
};

export const user = {
  saveUserInfo: (nickname, character) =>
    axios.post("/users/update/profile", { nickname, character }),
  getUserInfo: () => axios.get("/users/get/userinfo"),
};

export const room = {
  getRoom: () => axios.get("/room"),
  createRoom: (hostId, image, title, desc) =>
    axios.post("/room/create", { hostId, image, title, desc }),
};
