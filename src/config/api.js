import axios from "../api/axios-instance";

export const sign = {
  getItemList: () => axios.get("/sign"),
};
