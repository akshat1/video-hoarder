import { getLogger } from "../../logger";
import { getUserName } from "../selectors";
import { getURL } from "../util";
import { actionCreatorFactory, AsyncActionCreator, Dispatch, GetState, reducerFactory } from "./boilerplate";
import { getInstance } from "./net";
import { fetchUser } from "./session-management";


const rootLogger = getLogger("actions/user-management");

export const UpdatingUser = "UpdatingUser";
export const setUpdatingUser = actionCreatorFactory<boolean>(UpdatingUser);

export const UpdateUserFailed = "UserUpdateFailed";
export const setUpdateUserFailed = actionCreatorFactory<boolean>(UpdateUserFailed);

export const UpdateUserSucceeded = "UpdateUSerSucceeded";
export const setUpdateUserSucceeded = actionCreatorFactory<boolean>(UpdateUserSucceeded);

export const UpdateUserErrorMessage = "UpdateUserErrorMessage";
export const setUpdateUserErrorMessage = actionCreatorFactory<string>(UpdateUserErrorMessage);

const signalUserUpdateFailed = (errorMessage: string): AsyncActionCreator =>
  (dispatch: Dispatch) => {
    dispatch(setUpdateUserFailed(true));
    dispatch(setUpdateUserErrorMessage(errorMessage));
  };

const signalUserUpdateSuccess = (): AsyncActionCreator =>
  (dispatch: Dispatch) => {
    dispatch(setUpdateUserFailed(false));
    dispatch(setUpdateUserErrorMessage(""));
    dispatch(setUpdateUserSucceeded(true));
    // Remove the success signal after a certain duration
    setTimeout(() => dispatch(setUpdateUserSucceeded(false)), 3000);
  };

export const updatePassword = (args: { currentPassword: string, newPassword: string }): AsyncActionCreator =>
  async (dispatch: Dispatch, getState: GetState): Promise<void> => {
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

export const updatingUser = reducerFactory<boolean>(UpdatingUser, false);
export const updateUserErrorMessage = reducerFactory<string>(UpdateUserErrorMessage, "");
export const updateUserFailed = reducerFactory<boolean>(UpdateUserFailed, false);
export const updateUserSucceeded = reducerFactory<boolean>(UpdateUserSucceeded, false);
