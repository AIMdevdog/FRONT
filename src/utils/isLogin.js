import { Cookies } from "react-cookie";

const cookies = new Cookies();

const isLogin = cookies.get("refresh-token");

export default isLogin;
