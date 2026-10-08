// src/reducer/userDetailsReducer.js
import { userDetails,clearUserDetails } from "../../actionType/actionType";

const initialState = {
  user: {},
};

export default function userDetailsReducer(state = initialState, action) {
  switch (action.type) {
    case userDetails:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case clearUserDetails:
      return initialState;
    default:
      return state;
  }
}
