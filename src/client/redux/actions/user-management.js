import { getLogger } from "../../../logger";
import { getUserName } from "../../selectors";
import { getURL } from "../../util";
import { makeActionF } from "../boilerplate";
import { getInstance } from "../net";
import { fetchUser } from "./session-management";


const rootLogger = getLogger("actions/user-management");

export const UpdatingUser = "UpdatingUser";
/**
 * @func
 * @param {boolean} updatingUser
 * @returns {Action}
*/
export const setUpdatingUser = makeActionF(UpdatingUser);

export const UpdateUserFailed = "UserUpdateFailed";
/**
 * @func
 * @param {boolean} updateUserFailed
 * @returns {Action}
*/
export const setUpdateUserFailed = makeActionF(UpdateUserFailed);

export const UpdateUserSucceeded = "UpdateUSerSucceeded";
export const setUpdateUserSucceeded = makeActionF(UpdateUserSucceeded);

export const UpdateUserErrorMessage = "UpdateUserErrorMessage";
/**
 * @func
 * @param {string} updateUserErrorMessage
 * @returns {Action}
*/
export const setUpdateUserErrorMessage = makeActionF(UpdateUserErrorMessage);

const signalUserUpdateFailed = (errorMessage) =>
  (dispatch) => {
    dispatch(setUpdateUserFailed(true));
    dispatch(setUpdateUserErrorMessage(errorMessage));
  };

const signalUserUpdateSuccess = () =>
  (dispatch) => {
    dispatch(setUpdateUserFailed(false));
    dispatch(setUpdateUserErrorMessage(""));
    dispatch(setUpdateUserSucceeded(true));
    // Remove the success signal after a certain duration
    setTimeout(() => dispatch(setUpdateUserSucceeded(false)), 3000);
  };

/**
 * @func
 * @param {Object} args
 * @param {string} args.currentPassword
 * @param {Object} args.newPassword
 * @returns {Promise}
 */
export const updatePassword = (args) =>
  async (dispatch, getState) => {
    const {
      currentPassword,
      newPassword,
    } = args;
    const userName = getUserName(getState());

    dispatch(setUpdatingUser(true));
    try {
      const response = await getInstance().post(getURL("./api/user/change-password"), {
        userName,
        currentPassword,
        newPassword,
      });
      if (response.status === 200) {
        await dispatch(fetchUser());
        dispatch(signalUserUpdateSuccess());
        return;
      } else if (response.status === 401) {
        return dispatch(signalUserUpdateFailed("Invalid current password."));
      }

      dispatch(signalUserUpdateFailed("Unknown error"));
    } catch (err) {
      getLogger("updatePassword", rootLogger).error(err);
      dispatch(signalUserUpdateFailed("Unknown error"));
    }

    dispatch(setUpdatingUser(false));
  };
