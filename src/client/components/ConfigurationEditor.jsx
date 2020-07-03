import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,IconButton,Link,TextareaAutosize, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import React, { useState } from "react";

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

const ConfigurationEditor = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const fullWidth = !fullScreen;
  const maxWidth = fullWidth ? "md" : undefined;
  const classes = useStyles();
  const {
    configText,
    doSave,
    helperText,
    onCancel,
    open,
    title,
  } = props;

  const [tmpConfigText, setTempConfigText] = useState(configText);
  const onChange = (event) => setTempConfigText(event.currentTarget.value);
  const onSaveButtonClicked = () => doSave(tmpConfigText);

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
        <DialogContentText>
          <If condition={helperText}>
            <Typography>{helperText}</Typography>
          </If>
          <Typography>See <Link
            href="https://github.com/ytdl-org/youtube-dl#configuration"
            rel="noreferrer"
            target="_blank"
                          >youtube-dl documentation
                          </Link> for syntax.
          </Typography>
        </DialogContentText>
        <TextareaAutosize
          className={classes.textArea}
          onChange={onChange}
          rowsMin={5}
          value={tmpConfigText}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={onCancel}
        >Cancel
        </Button>
        <Button
          color="primary"
          onClick={onSaveButtonClicked}
        >Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfigurationEditor.propTypes = {
  configText: PropTypes.string,
  helperText: PropTypes.string,
  onCancel: PropTypes.func,
  doSave: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
};

ConfigurationEditor.defaultProps = {
  title: "Edit youtube-dl configuration",
};

export default ConfigurationEditor;
