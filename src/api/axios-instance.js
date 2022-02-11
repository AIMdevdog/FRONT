import axios from "axios";
import CONST from "../config/const";
import { localGetItem } from "../utils/handleStorage";

const instance = axios.create({
  baseURL: CONST.HOST,
});

instance.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

instance.interceptors.request.use(
  async (response) => {
    // go then()
    // const token = await getItem('session');
    // const token = await localStorage.getItem('session');
    const token = await localGetItem("session");

    // if (_.isNil(token)) {
    //   // 로그인으로 보내던 하면된다
    //   return Promise.reject(new Error('no user accessToken'));
    // }

    response.headers.Authorization = "Bearer " + token;
    return response;
  },
  (error) => {
    // go catch()
    return Promise.reject(error);
  }
);

export default instance;
