import axios from "../api/axios-instance";

export const sign = {
  getSign: (accessToken, email) =>
    axios.post("/users/auth/google", { accessToken, email }),
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
