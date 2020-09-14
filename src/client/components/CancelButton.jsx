/**
 * Renders a cancel button which will cancel a download (the item prop) after showing a confirmation dialog.
 */
import { getTitle,Item } from "../../model/Item";
import { hasConcluded } from "../../model/Status";
import { cancelJob, deleteJob } from "../redux/job-management";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { Button } from "@material-ui/core";
import { CancelOutlined, DeleteOutline } from "@material-ui/icons";
import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { connect } from "react-redux";

export const CancelButton = (props) => {
  const [ isDialogOpen, setDialogOpen ] = useState(false);
  const { className, doCancel, doDelete, item } = props;
  const { status } = item;

  const canDelete = hasConcluded(status);
  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);
  const onConfirm = () => {
    if (canDelete) {
      doDelete(item);
    } else {
      doCancel(item);
    }
    closeDialog();
  };

  // eslint-disable-next-line jsx-control-statements/jsx-use-if-tag
  const icon = canDelete ? <DeleteOutline /> : <CancelOutlined />;
  const label = canDelete ? "Delete" : "Cancel";

  return (
    <Fragment>
      <Button
        className={className}
        color="secondary"
        onClick={openDialog}
        startIcon={icon}
        variant="contained"
      >
        {label}
      </Button>
      <DeleteConfirmationDialog
        jobTitle={getTitle(item)}
        onCancel={closeDialog}
        onConfirm={onConfirm}
        open={isDialogOpen}
        status={status}
      />
    </Fragment>
  );
};

CancelButton.propTypes = {
  className: PropTypes.string,
  doCancel: PropTypes.function,
  doDelete: PropTypes.function,
  item: PropTypes.shape(Item),
}

const dispatchToProps = {
  doCancel: cancelJob,
  doDelete: deleteJob,
};

export default connect(null, dispatchToProps)(CancelButton);
