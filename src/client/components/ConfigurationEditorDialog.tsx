import { ConfigurationPreset, ConfigurationPresetID } from "../../model/ConfigurationPreset";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle,IconButton, Typography, useMediaQuery, useTheme } from "./mui";
import { Close as CloseIcon,makeStyles } from "./mui";
import _ from "lodash";
import React from "react";
import { SyntheticEvent } from "react";
import { FunctionComponent } from "react";

const useStyles = makeStyles(theme => ({
  root: {},
  textArea: {
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

interface ConfigurationEditorDialog {
  configText?: string
  helperText?: string
  onCancel: (event: SyntheticEvent) => void
  doSave: (newConfig: string) => void
  open: boolean
  title: string
  presets?: ConfigurationPreset[]
  selectedPreset?: ConfigurationPresetID
}

const ConfigurationEditorDialog: FunctionComponent<ConfigurationEditorDialog> = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const fullWidth = !fullScreen;
  const maxWidth = fullWidth ? "md" : undefined;
  const classes = useStyles();
  const {
    onCancel,
    open,
    title,
  } = props;

  const onSaveButtonClicked = _.noop;

  return (
    <Dialog
      aria-labelledby="editor-dialog-title"
      className={classes.root}
      fullScreen={fullScreen}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      onClose={onCancel}
      open={open}
    >
      <DialogTitle id="editor-dialog-title">
        <Typography variant="h6">{title}</Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onCancel}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <h1>Foo</h1>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={onSaveButtonClicked}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfigurationEditorDialog.defaultProps = {
  title: "Edit youtube-dl configuration",
};

export default ConfigurationEditorDialog;
