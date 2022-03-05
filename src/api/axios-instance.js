import axios from "axios";
import CONST from "../config/const";
import { Cookies } from "react-cookie";
import { localGetItem } from "../utils/handleStorage";
import { token } from "../config/api";

const instance = axios.create({
  baseURL: CONST.HOST,
  withCredentials: true,
});

const cookies = new Cookies();

instance.defaults.headers.common["Content-Type"] =
  "application/x-www-form-urlencoded";
instance.defaults.headers.common["Access-Control-Allow-Origin"] =
  // "http://localhost:8000";
  [
    "https://d2ri7cyfi98bjj.cloudfront.net",
    "http://localhost:8000",
    "https://server.dev-team-aim.com",
    "https://test-server.dev-team-aim.com",
  ];
instance.defaults.headers.common["Access-Control-Allow-Headers"] = "*";
instance.defaults.headers.common["Access-Control-Allow-Credentials"] = true;

instance.interceptors.request.use(
  async (response) => {
    // response.headers.Authorization = "Bearer " + token;
    response.headers.Authorization = "Bearer " + cookies.get("access-token");
    response.headers["access-token"] = cookies.get("access-token");
    response.headers["refresh-token"] = cookies.get("refresh-token");
    return response;
  },
  (error) => {
    // go catch()
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    console.log("오류:", error.config);
    const errorAPI = error.config;
    if (error.response.status === 401 && errorAPI.retry === undefined) {
      errorAPI.retry = true;
      console.log("토큰이 이상한 오류일 경우");
      // cookies.remove("refresh-token");
      // cookies.remove("access-token");
      // alert("로그아웃 되었습니다.");
      // eslint-disable-next-line no-unused-expressions
      // window.location.href("/");
      //   await token.();
      const requestResult = await token.getRefreshToken();
      const {
        data: { msg, result },
      } = requestResult;
      if (msg) {
        console.log(msg);
        cookies.set("access-token", result?.access_token, { maxAge: 60 });
        alert("정보를 불러올 수 없습니다. 다시 시도해주세요.");
      }

      return await axios(errorAPI);
    }
    return Promise.reject(error.response);
  }
);

export default instance;
