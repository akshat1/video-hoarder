import { getLogger } from "../../logger";
import { Notification } from "../../model/Notification";
import { getNotifications } from "../selectors";
import { actionCreatorFactory, AsyncActionCreator, Dispatch, GetState, reducerFactory } from "./boilerplate";

const rootLogger = getLogger("actions/ytdl");

const NotificationDuration = 3000; // ms
export const SetNotificationMessages = "SetNotificationMessages";

const setNotifications = actionCreatorFactory<Notification[]>(SetNotificationMessages);

/**
 * Hide the given notification
 */
export const hideNotification = (notification: Notification):AsyncActionCreator =>
  (dispatch: Dispatch, getState: GetState): void => {
    getLogger("hideNotification", rootLogger).debug("Hide", notification);
    const currentNotifications = getNotifications(getState());
    dispatch(setNotifications(currentNotifications.filter(item => item !== notification)));
  };

/**
 * Show the given notification, and hide it after duration ms.
 * @param message - the message to be displayed.
 * @param severity - severity (matching severity for mui snackbar).
 * @param [duration=NotificationDuration] - the number of miliseconds this message will be displayed.
 */
export const showNotification = (message: string, severity?: string, duration:number = NotificationDuration):AsyncActionCreator =>
  (dispatch: Dispatch, getState: GetState) => {
    const logger = getLogger("showNotification", rootLogger);
    logger.debug({ message, severity, duration });
    const currentMessages = getNotifications(getState());
    const notification = {
      message,
      severity,
    };
    logger.debug("Enqueue new notification");
    dispatch(setNotifications([
      ...currentMessages,
      notification,
    ]));
    logger.debug("Schedule notification removal after ", duration);
    setTimeout(() => {
      logger.debug("Time to hide", notification);
      dispatch(hideNotification(notification));
    }, duration);
    logger.debug("Bye");
  };

export const notificationMessages = reducerFactory(SetNotificationMessages, []);
