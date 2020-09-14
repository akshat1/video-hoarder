/**
 * Renders a deletion confirmation dialog.
 */
import { isPending } from "../../model/Status";
import { Button, Dialog, DialogTitle,Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import React from "react";

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

const DeleteConfirmationDialog = ({ jobTitle, onCancel, onConfirm, open, status }) => {
  const classes = useStyles();
  const jobName = jobTitle ? `"${jobTitle}"` : "this download";
  const cancelOrDelete = isPending(status) ? "Cancel" : "Delete";
  return (
    <Dialog
      aria-labelledby="delete-confirmation-dialog-title"
      onClose={onCancel}
      open={open}
    >
      <DialogTitle id="delete-confirmation-dialog-title">{`${cancelOrDelete} ${jobName}?`}</DialogTitle>
      <div className={classes.body}>
        <Typography>{`Are you sure you want to ${cancelOrDelete.toLowerCase()} ${jobName}?`}</Typography>
        <If condition={!isPending(status)}>
          <Typography>Remember, this will only remove this record from video-hoarder. It will not delete any downloaded files from disk.</Typography> 
        </If>
        <div className={classes.buttonContainer}>
          <Button
            className={classes.yesButton}
            color="primary"
            onClick={onConfirm}
            variant="contained"
          >Yes
          </Button>
          <Button
            color="secondary"
            onClick={onCancel}
            variant="contained"
          >No
          </Button>
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
  status: PropTypes.string,
};

export default DeleteConfirmationDialog;
