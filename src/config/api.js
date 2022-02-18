import axios from "../api/axios-instance";

export const sign = {
  getSign: (email, password) =>
    axios.get("/user/signin", {email, password}),
  getGoogleSign: (accessToken, email) =>
    axios.post("/users/auth/google", { accessToken, email }),
  createUser: (email, password, nickname) =>
    axios.post("/users/signup", {email, password, nickname})
};

export const user = {
  saveUserInfo: (accessToken, nickname, character) =>
    axios.post("/users/update/profile", { accessToken, nickname, character }),
  getUserInfo: (accessToken) =>
    axios.post("/users/get/userinfo", { accessToken }),
};

export const room = {
  getRoom: () => axios.get("/room"),
  createRoom: (hostId, image, title, desc) =>
    axios.post("/room/create", { hostId, image, title, desc }),
};

