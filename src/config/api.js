import axios from "../api/axios-instance";

export const token = {
  getRefreshToken: () => axios.get("users/refreshToken"),
};

export const sign = {
  getSign: (email, password) => axios.post("/users/login", { email, password }),
  getGoogleSign: (accessToken, email) =>
    axios.post("/users/auth/google", { accessToken, email }),
  createUser: (email, password, nickname) =>
    axios.post("/users/signup", { email, password, nickname }),
};

export const user = {
  saveUserInfo: (nickname, character) =>
    axios.post("/users/update/profile", { nickname, character }),
  getUserInfo: () => axios.get("/users/get/userinfo"),
};

export const room = {
  getRoom: () => axios.get("/userRoom"),
  createRoom: (mapId, title, description) =>
    axios.post("/room/create", { mapId, title, description }),
  deleteRoom: (roomId) => axios.post("/userRoom/delete", { roomId }),
};
