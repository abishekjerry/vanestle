import { combineReducers } from "redux";
import userDetailsReducer from "./reducer/UserDetail/userDetailReducer";

const rootReducer = combineReducers({
  userDetails: userDetailsReducer,
});

export default rootReducer;
