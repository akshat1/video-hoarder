/**
 * Renders a deletion confirmation dialog.
 */
import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Button, Dialog, DialogTitle } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    textAlign: "center",
    marginTop: theme.spacing(5),
  },
  yesButton: {
    marginRight: theme.spacing(5),
  },
  body: {
    padding: theme.spacing(3),
  },
}));

const DeleteConfirmationDialog = ({ onCancel, onConfirm, open, jobTitle }) => {
  const classes = useStyles();
  return (
    <Dialog onClose={onCancel} aria-labelledby="delete-confirmation-dialog-title" open={open}>
      <DialogTitle id="delete-confirmation-dialog-title">{`Cancel ${jobTitle}?`}</DialogTitle>
      <div className={classes.body}>
        <div>{`Are you sure you want to cancel "${jobTitle}"?`}</div>
        <div className={classes.buttonContainer}>
          <Button onClick={onConfirm} variant="contained" className={classes.yesButton} color="primary">Yes</Button>
          <Button onClick={onCancel} variant="contained" color="secondary">No</Button>
        </div>
      </div>
    </Dialog>
  );
};

DeleteConfirmationDialog.propTypes = {
  jobTitle: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  open: PropTypes.bool,
};

export default DeleteConfirmationDialog;
