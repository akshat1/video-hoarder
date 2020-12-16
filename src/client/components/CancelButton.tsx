/**
 * Renders a cancel button which will cancel a download (the item prop) after showing a confirmation dialog.
 */
import { getTitle,Item } from "../../model/Item";
import { hasConcluded } from "../../model/Status";
import { cancelJob, deleteJob } from "../redux/job-management";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { Button } from "./mui";
import { CancelOutlined, DeleteOutline } from "./mui";
import React, { Fragment, FunctionComponent, useState } from "react";
import { connect } from "react-redux";

interface CancelButtonProps {
  className: string;
  doCancel: (Item) => void;
  doDelete: (Item) => void;
  item: Item;
}

export const CancelButton: FunctionComponent<CancelButtonProps> = (props) => {
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

const dispatchToProps = {
  doCancel: cancelJob,
  doDelete: deleteJob,
};

export default connect(null, dispatchToProps)(CancelButton);
