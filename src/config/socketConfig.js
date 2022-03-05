import io from "socket.io-client";
import CONST from "../config/const";

const socket = io(CONST.HOST);

export default socket;
