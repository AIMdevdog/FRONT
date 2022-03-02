import { createStore } from "redux";
import { user } from "./config/api";

const loadUserData = () => {
  return {
    type: "load"
  }
};

const reducer = async (state = [], action) => {
  switch (action.type) {
    case "load":
      console.log("reducer.load");
      const requestResult = await user.getUserInfo();
      const {
        data: { result },
      } = requestResult;
      return result;

    default:
      return state;
  }
};

const store = createStore(reducer);

export const actionCreators = {
  loadUserData,
}



export default store;
