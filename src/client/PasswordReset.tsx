import { infoTable } from "./cssUtils";
import { Mutation, Query } from "./gql";
import { useMutation } from "@apollo/client";
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
  serverError: {
    color: theme.palette.error.main,
  },
}));

export const PasswordResetForm:FunctionComponent = () => {
  const classes = useStyles();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordDeux, setNewPasswordDeux] = useState("");
  const [doChangePassword, changePasswordThunk] = useMutation(Mutation.ChangePassword);
  const [doLogout, logoutThunk] = useMutation(
    Mutation.Logout,
    {
      update: (cache) => cache.writeQuery({
        query: Query.CurrentUser,
        data: { currentUser: null },
      }),
    }
  );

  const isDisabled = logoutThunk.loading || changePasswordThunk.loading || !(currentPassword && newPassword && (newPassword === newPasswordDeux));  
  const newPasswordError = newPassword !== newPasswordDeux ? "Both the new password fields must match." : null;
  let changePasswordError = null;
  if (changePasswordThunk.error) {
    changePasswordError = <Typography className={classes.serverError}>{changePasswordThunk.error.message}</Typography>;
  }
  
  const onCurrentPasswordChanged:ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (evt) => setCurrentPassword(evt.target.value);
  const onNewPasswordChanged:ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (evt) => setNewPassword(evt.target.value);
  const onNewPasswordDeuxChanged:ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (evt) => setNewPasswordDeux(evt.target.value);
  const onFormSubmit = async (evt: FormEvent) => {
    evt.stopPropagation();
    evt.preventDefault();
    const success = await doChangePassword({
      variables: {
        data: {
          currentPassword,
          newPassword,
          newPasswordDeux,
        },
      },
    });
    if (success) {
      await doLogout();
    }
  };

  return (
    <Grid item xs={12}>
      {changePasswordError}
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
          type="submit"
        >
          Change password
        </Button>
      </form>
    </Grid>
  );
};
