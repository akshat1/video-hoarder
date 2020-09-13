import { updatePassword } from "../redux/user-management";
import { getUpdateUserErrorMessage, getUserName, isPasswordExpired, isUpdateUserFailed,isUpdateUserSucceeded, isUpdatingUser } from "../selectors";
import PasswordChangeInput from "./PasswordChangeInput";
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import classnames from "classnames";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useEffect } from "react";
import { connect } from "react-redux";

const useStyles = makeStyles(theme => {
  console.log(theme);
  window.theme = theme;
  return {
    body: {
      display: "inline-grid",
      gridTemplateColumns: "auto auto",
      columnGap: `${theme.spacing(2)}px`,
      rowGap: `${theme.spacing(2)}px`,
    },

    passwordExpirationBanner: {
      background: theme.palette.error.light,
      color: theme.palette.error.contrastText,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      marginBottom: theme.spacing(2),
    },

    errorBanner: {
      background: theme.palette.error.light,
      color: theme.palette.error.contrastText,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      marginBottom: theme.spacing(2),
    },

    successBanner: {
      background: theme.palette.success.light,
      color: theme.palette.success.contrastText,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      marginBottom: theme.spacing(2),
    },
  };
});

const AccountSettings = (props) => {
  const classes = useStyles();
  const {
    className,
    passwordExpired,
    updatePassword,
    updateUserFailed,
    userName,
  } = props;
  const [isPasswordChangeInputVisible, setPasswordChangeInputVisible ] = useState(passwordExpired || updateUserFailed);
  const showPasswordChangeInput = () => setPasswordChangeInputVisible(true);
  const hidePasswordChangeInput = () => setPasswordChangeInputVisible(false);

  useEffect(() => setPasswordChangeInputVisible(passwordExpired || updateUserFailed), [passwordExpired, updateUserFailed]);

  return (
    <div className={classnames(classes.root, className)}>
      <If condition={passwordExpired}>
        <div className={classes.passwordExpirationBanner}>
          <Typography>Password expired. Please update your password.</Typography>
        </div>
      </If>
      <div className={classnames(classes.body, className)}>
        <div className={classes.label}>
          <Typography>Username</Typography>
        </div>
        <div className={classes.value}>
          <Typography>{userName}</Typography>
        </div>
        <div className={classes.label}>
          <Typography>Password</Typography>
        </div>
        <div className={classes.value}>
          <Choose>
            <When condition={isPasswordChangeInputVisible}>
              <PasswordChangeInput
                onCancel={hidePasswordChangeInput}
                onChange={updatePassword}
              />
            </When>
            <Otherwise>
              <Typography>********</Typography>
              <Button
                onClick={showPasswordChangeInput}
                variant="contained"
              >Change password
              </Button>
            </Otherwise>
          </Choose>
        </div>
      </div>
    </div>
  );
};

AccountSettings.propTypes = {
  className: PropTypes.string,
  passwordExpired: PropTypes.bool,
  updatePassword: PropTypes.func,
  updateUserErrorMessage: PropTypes.string,
  updateUserFailed: PropTypes.bool,
  updateUserSucceeded: PropTypes.bool,
  updatingUser: PropTypes.bool,
  userName: PropTypes.string,
};

const mapStateToProps = (state) => ({
  passwordExpired: isPasswordExpired(state),
  updateUserErrorMessage: getUpdateUserErrorMessage(state),
  updateUserFailed: isUpdateUserFailed(state),
  updateUserSucceeded: isUpdateUserSucceeded(state),
  updatingUser: isUpdatingUser(state),
  userName: getUserName(state),
});

const mapDispatchToProps = {
  updatePassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
