import axios from "../api/axios-instance";

export const sign = {
  getSign: () => axios.get("/auth/google"),
};
