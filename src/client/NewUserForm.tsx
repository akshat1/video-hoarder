import { infoTable } from "./cssUtils";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { FormEventHandler, FunctionComponent } from "react";

const useStyles = makeStyles((theme: Theme) => ({
  inputForm: {
    ...infoTable(theme),
    width: "500px",
  },
}));
interface NewUserFormProps {
  open?: boolean;
  onCancel?: () => void;
  onAddition?: () => void;
}

export const NewUserForm: FunctionComponent<NewUserFormProps> = (props) => {
  const {
    onCancel,
    onAddition,
    open,
  } = props;

  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleSubmit:FormEventHandler = (event) => {
    console.log("Handle Submit");
    event.preventDefault();
  }

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="newUserDialogTitle"
      fullScreen={fullScreen}
      maxWidth="lg"
    >
      <DialogTitle id="newUserDialogTitle">Add a new user</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className={classes.inputForm}>
          <Typography>User name</Typography>
          <TextField id="username" label="User name" variant="standard"/>
          <Typography>Password</Typography>
          <TextField type="password" id="password-one" label="Password" variant="standard"/>
          <Typography>Enter password again</Typography>
          <TextField type="password" id="password-two" label="Enter password again" variant="standard"/>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onAddition} color="primary">Add</Button>
      </DialogActions>
    </Dialog>
  );
}
