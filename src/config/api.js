import axios from "../api/axios-instance";

export const sign = {
  getSign: () => axios.get("/auth/google"),
  setNickName: (nickname, sessionId) =>
    axios.post("/sendNickname", { nickname, sessionId }),
  sendSignData: (email, password) =>
    axios.get(`/login?email=${email}&password=${password}`),
};

export const room = {
  getRoom: () => axios.get("/lobby"),
};
