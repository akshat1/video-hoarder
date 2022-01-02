import { infoTable } from "./cssUtils";
import { Button, Grid, TextField, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { ChangeEventHandler, FormEvent, FunctionComponent, useState } from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  passwordInputForm: {
    ...infoTable(theme, { rowGap: 1 }),
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}));

export const PasswordResetForm:FunctionComponent = () => {
  const classes = useStyles();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordDeux, setNewPasswordDeux] = useState("");

  const isDisabled = !(currentPassword && newPassword && (newPassword === newPasswordDeux));
  
  const newPasswordError = newPassword !== newPasswordDeux ? "Both the new password fields must match." : null;
  
  const onCurrentPasswordChanged:ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (evt) => setCurrentPassword(evt.target.value);
  const onNewPasswordChanged:ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (evt) => setNewPassword(evt.target.value);
  const onNewPasswordDeuxChanged:ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (evt) => setNewPasswordDeux(evt.target.value);
  const onFormSubmit = (evt: FormEvent) => {
    console.log("Form was submitted!");
    evt.stopPropagation();
    evt.preventDefault();
  }

  return (
    <Grid item xs={12}>
      <form className={classes.passwordInputForm} onSubmit={onFormSubmit}>
        <Typography>
          Current password
        </Typography>
        <TextField
          required
          id="current-password"
          label="Current password"
          value={currentPassword}
          onChange={onCurrentPasswordChanged}
        />
        <Typography>New password</Typography>
        <TextField
          required
          id="new-password"
          label="New password"
          onChange={onNewPasswordChanged}
        />
        <Typography>Re-enter new password</Typography>
        <TextField
          required
          id="new-password-deux"
          label="New password"
          onChange={onNewPasswordDeuxChanged}
          error={Boolean(newPasswordError)}
          helperText={newPasswordError}
        />
        <Button
          variant="contained"
          className={classes.submitButton}
          disabled={isDisabled}
        >
          Change password
        </Button>
      </form>
    </Grid>
  );
};
