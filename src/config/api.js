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
    axios.put("/users/profile", { nickname, character }),
  getUserInfo: () => axios.get("/users/userinfo"),
};

export const room = {
  // lobby room
  getRoom: () => axios.get("/userRoom"),
  deleteRoom: (roomId) => axios.delete("/userRoom", { roomId }),
  createRoom: (mapId, title, description) =>
    axios.post("/room", { mapId, title, description }),

  // in room
  getVisitorBookComment: (roomId) => axios.get(`/board/${roomId}`),
  createVisitorBookComment: (roomId, contents) =>
    axios.post("/board", { roomId, contents }),
  editVisitorBookComment: (boardId, contents) =>
    axios.put("/board", { boardId, contents }),
  deleteVisitorBookComment: (boardId) =>
    axios.delete("/board", { boardId }),
};
