import { hideNotification } from "../redux/actions";
import { getCurrentNotification } from "../selectors";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import PropTypes from "prop-types";
import React from "react";
import {connect} from "react-redux";

const AnchorOrigin = {
  vertical: "top",
  horizontal: "center",
};

const Notifications = ({ hideNotification, notification }) => {
  const onClose = () => {
    console.log("Close", notification.message);
    hideNotification(notification);
  };
  return (
    <Snackbar
      anchorOrigin={AnchorOrigin}
      open={!!notification}
    >
      <If condition={notification}>
        <Alert
          elevation={6}
          onClose={onClose}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </If>
    </Snackbar>
  );
};

Notifications.displayName = "Notifications";

Notifications.propTypes = {
  notification: PropTypes.shape({
    message: PropTypes.string,
    severity: PropTypes.string,
  }),
  hideNotification: PropTypes.func,
};

const mapStateToProps = (state) => ({
  notification: getCurrentNotification(state),
});

const mapDispatchToProps = { hideNotification };

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
