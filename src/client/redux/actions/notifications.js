import { getLogger } from "../../../logger";
const { makeActionF } = require("../boilerplate");
const { getNotifications } = require("../../selectors");

const rootLogger = getLogger("actions/ytdl");

/**
 * @const {number}
 */
const NotificationDuration = 3000; // ms

/** @const {string} */
export const SetNotificationMessages = "SetNotificationMessages";

/**
 * @func
 */
const setNotifications = makeActionF(SetNotificationMessages);

/**
 * Hide the given notification
 *
 * @func
 * @param {Notification} notification
 */
export const hideNotification = (notification) =>
  (dispatch, getState) => {
    getLogger("hideNotification", rootLogger).debug("Hide", notification);
    const currentNotifications = getNotifications(getState());
    dispatch(setNotifications(currentNotifications.filter(item => item !== notification)));
  };

/**
 * Show the given notification, and hide it after duration ms.
 * @func
 * @param {string} message - the message to be displayed.
 * @param {string} severity - severity (matching severity for mui snackbar).
 * @param {number} [duration=NotificationDuration] - the number of miliseconds this message will be displayed.
 * @returns {ActionCreator}
 */
export const showNotification = (message, severity, duration = NotificationDuration) =>
  (dispatch, getState) => {
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
