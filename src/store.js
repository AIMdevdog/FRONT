import { createStore } from "redux";
import { user } from "./config/api";

const reducer = async (state = [], action) => {
    switch(action.type){
        default:
            const requestResult = await user.getUserInfo();
            const {
                data: {mag, result}
            } = requestResult;
            return result;
    }
}
const store = createStore(reducer);

export default store;