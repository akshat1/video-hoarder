/**
 * Renders a cancel button which will cancel a download (the item prop) after showing a confirmation dialog.
 */
import React, { Fragment, useState } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { doCancelDownload } from '../redux/actions-and-reducers';
import { Button } from '@material-ui/core';
import DeleteConfirmationDialog from './DeleteConfirmationDialog.jsx';
import { CancelOutlined } from '@material-ui/icons';
import { hasConcluded } from "../../Status";

export const CancelButton = (props) => {
  const [ isDialogOpen, setDialogOpen ] = useState(false);
  const { item, doCancel } = props;
  const { status, title } = item;

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);
  const onConfirm = () => {
    doCancel(item);
    closeDialog();
  };

  return (
    <Fragment>
      <Button
        startIcon={<CancelOutlined />}
        variant="contained"
        color="secondary"
        disabled={hasConcluded(status)}
        onClick={openDialog}
      >
        Cancel
      </Button>
      <DeleteConfirmationDialog
        onCancel={closeDialog}
        onConfirm={onConfirm}
        jobTitle={title}
        open={isDialogOpen}
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
};

const dispatchToProps = { doCancelDownload };

export default connect(null, dispatchToProps)(CancelButton);
