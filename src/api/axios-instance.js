import axios from "axios";
import CONST from "../config/const";

const instance = axios.create({
  baseURL: CONST.HOST,
});

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

export default instance;
