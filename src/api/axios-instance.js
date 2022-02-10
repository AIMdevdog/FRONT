import axios from "axios";
import CONST from "../config/const";

const instance = axios.create({
  baseURL: CONST.HOST,
});

export default instance;
