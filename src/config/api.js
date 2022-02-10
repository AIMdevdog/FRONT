import axios from "../api/axios-instance";

export const sign = {
  getSign: () => axios.get("/auth/google"),
  setNickName: (nickname, sessionId) =>
    axios.post("/sendNickname", { nickname, sessionId }),
};
