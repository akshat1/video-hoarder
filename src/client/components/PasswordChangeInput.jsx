import { Button,TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useState } from "react";

/**
 * This is really quick n dirty; going to write a better implementation eventually.
 *
 * @func
 * @param {string} password
 * @returns {boolean}
 */
const isValidPassword = password => {
  if (!password) {
    return true;  // there is no password yet.
  }

  if (password.length < 8) {
    return false;
  }

  // Must have at least one lower case letter
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Must have at least one upper case letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Must have at least one number
  if (!/\d/.test(password)) {
    return false;
  }

  // Must have at least one special character
  if (!/!|@|#|\$|%|\^|&|\*|\(|\)|-|_|\+|=|{|}|\[|\]|`|~|\\|,|<|.|>|\?|\/|;|:|'|"/.test(password)) {
    return false;
  }

  return true;
};

const useStyles = makeStyles((theme) => {
  const spacing = theme.spacing(2);
  return {
    root: {},
    row: {
      marginBottom: spacing,
    },
    submitButton: {
      marginRight: spacing,
    },
  };
});

const PasswordChangeInput = (props) => {
  const classes = useStyles();
  const {
    busy,
    className,
    onCancel,
    onChange,
  } = props;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPasswordA, setNewPasswordA] = useState("");
  const [newPasswordB, setNewPasswordB] = useState("");
  const setter = fn => e => fn(e.currentTarget.value);
  const passwordIsValid = isValidPassword(newPasswordA);
  const newPasswordsMatch = newPasswordA === newPasswordB;
  const passwordAHelperText = passwordIsValid ? "" : "Password must be at least 8 characters long, and contain at least one lower case letter, an upper case letter, a number, and a special character.";
  const passwordBHelperText = newPasswordsMatch ? "" : "New password confirmation entry does not match.";
  const submitDisabled = !busy && !(newPasswordA && passwordIsValid && newPasswordsMatch);
  const clearForm = () => {
    setCurrentPassword("");
    setNewPasswordA("");
    setNewPasswordB("");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    onChange({
      currentPassword,
      newPassword: newPasswordA,
    });
    clearForm();
  };

  return (
    <div className={classnames(classes.root, className)}>
      <form
        disabled={submitDisabled}
        onSubmit={onSubmit}
      >
        <div className={classes.row}>
          <TextField
            label="Enter current password"
            onChange={setter(setCurrentPassword)}
            required
            type="password"
            value={currentPassword}
            variant="outlined"
          />
        </div>
        <div className={classes.row}>
          <TextField
            disabled={busy}
            error={!isValidPassword(newPasswordA)}
            helperText={passwordAHelperText}
            label="Enter new password"
            onChange={setter(setNewPasswordA)}
            required
            type="password"
            value={newPasswordA}
            variant="outlined"
          />
        </div>
        <div className={classes.row}>
          <TextField
            disabled={busy}
            error={!newPasswordsMatch}
            helperText={passwordBHelperText}
            label="Confirm new password"
            onChange={setter(setNewPasswordB)}
            required
            type="password"
            value={newPasswordB}
            variant="outlined"
          />
        </div>
        <div className={classes.row}>
          <Button
            className={classes.submitButton}
            color="primary"
            disabled={submitDisabled}
            type="submit"
            variant="contained"
          >
            Submit
          </Button>
          <Button
            className={classes.cancelButton}
            disabled={busy}
            onClick={onCancel}
            variant="contained"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

PasswordChangeInput.propTypes = {
  busy: PropTypes.bool,
  className: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PasswordChangeInput;
