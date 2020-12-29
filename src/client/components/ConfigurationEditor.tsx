import { ConfigurationPreset } from "../../model/ConfigurationPreset";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,IconButton,Link,TextareaAutosize, Typography, useMediaQuery, useTheme } from "./mui";
import { Close as CloseIcon,makeStyles } from "./mui";
import _ from "lodash";
import React, { useState } from "react";
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

interface ConfigurationEditorProps {
  configText?: string
  helperText?: string
  onCancel: (event: SyntheticEvent) => void
  doSave: (newConfig: string) => void
  open: boolean
  title: string
  presets?: ConfigurationPreset[]
  selectedPreset?: string
}

const YTDLDocLink = (
  <Link
    href="https://github.com/ytdl-org/youtube-dl#configuration"
    rel="noreferrer"
    target="_blank"
  >
    youtube-dl documentation
  </Link>
);

const ConfigurationEditor: FunctionComponent<ConfigurationEditorProps> = (props) => {
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
    presets,
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
          <If condition={!!helperText}>
            <Typography>{helperText}</Typography>
          </If>
          <Typography>
            See {YTDLDocLink} for syntax.
          </Typography>
        </DialogContentText>
        <If condition={!_.isEmpty(presets)}>
          <Typography>
            Preset:
          </Typography>
        </If>
        <TextareaAutosize
          autoCorrect="off"
          className={classes.textArea}
          onChange={onChange}
          rowsMin={5}
          spellCheck={false}
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

ConfigurationEditor.defaultProps = {
  title: "Edit youtube-dl configuration",
};

export default ConfigurationEditor;
