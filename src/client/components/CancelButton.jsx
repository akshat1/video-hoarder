/**
 * Renders a cancel button which will cancel a download (the item prop) after showing a confirmation dialog.
 */
import { getTitle } from "../../model/Item";
import { hasConcluded } from "../../Status";
import { cancelJob, deleteJob } from "../redux/actions";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog.jsx";
import { Button } from "@material-ui/core";
import { CancelOutlined, DeleteOutline } from "@material-ui/icons";
import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { connect } from "react-redux";

export const CancelButton = (props) => {
  const [ isDialogOpen, setDialogOpen ] = useState(false);
  const { item, doCancel, doDelete, className } = props;
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
        startIcon={icon}
        variant="contained"
        color="secondary"
        onClick={openDialog}
        className={className}
      >
        {label}
      </Button>
      <DeleteConfirmationDialog
        onCancel={closeDialog}
        onConfirm={onConfirm}
        jobTitle={getTitle(item)}
        open={isDialogOpen}
        status={status}
      />
    </Fragment>
  );
};

CancelButton.propTypes = {
  /** @property {Item} */
  item: PropTypes.shape({
    addedAt: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  doCancel: PropTypes.func.isRequired,
  doDelete: PropTypes.func.isRequired,
  className: PropTypes.string,
};

const dispatchToProps = {
  doCancel: cancelJob,
  doDelete: deleteJob,
};

export default connect(null, dispatchToProps)(CancelButton);
