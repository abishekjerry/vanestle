import { userDetails, clearUserDetails } from "../../actionType/actionType";

export const saveUserDetails = (userData) => {
  return {
    type: userDetails,
    payload: userData,
  };
};
export const clearUserData = () => ({
  type: clearUserDetails,
});
