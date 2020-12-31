import { ConfigurationPreset, ConfigurationPresetID, findPresetById } from "../../model/ConfigurationPreset";
import { fetchPresets } from "../redux/config-management";
import { getPresets } from "../selectors";
import { Button, Grid, Link,makeStyles, TextareaAutosize, Typography } from "./mui";
import NameInputDialog from "./NameInputDialog";
import PresetSelector from "./PresetSelector";
import _ from "lodash";
import React, { FunctionComponent, SyntheticEvent, useEffect,useState } from "react";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "60rem",
  },
  textAreaContainer: {
    display: "block",
  },
  textArea: {
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
    padding: theme.spacing(1),
  },
  bottomButtons: {
    textAlign: "right",
    "& > button + button": {
      marginLeft: theme.spacing(1),
    },
  },
  savePresetButton: {
    float: "left",
  },
}));

interface ConfigurationEditorProps {
  configText?: string
  helperText?: string
  onCancel: (event: SyntheticEvent) => void
  doSave: (newConfig: string) => void
  doSavePreset: (preset: ConfigurationPreset) => Promise<void>
  presets?: ConfigurationPreset[]
  selectedPresetID?: ConfigurationPresetID,
  fetchPresets: () => Promise<void>,
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

/**
 * Interface to edit tool configurations. For now, since we are only dealing with youtube-dl, this is set up with a
 * link to YTDL docs. Also lets you use a previously saved preset configuration, or save a new one.
 *
 * @todo Error handling
 */
export const ConfigurationEditor: FunctionComponent<ConfigurationEditorProps> = (props) => {
  const classes = useStyles();
  const {
    configText,
    doSave,
    doSavePreset,
    fetchPresets,
    helperText,
    onCancel,
    presets,
    selectedPresetID,
  } = props;

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets])

  // There is no global preset selection. "Selecting" a preset just means using the value contained within it. Therefore
  // we keep the "selected" preset as local state. Hitting save will cause the value of the selected preset to be saved
  // in whatever context this editor was invoked in.
  const [tmpSelectedPresetID, setSelectedPresetID] = useState(selectedPresetID);
  // Populate the textarea with the value of the selected preset (if any was supplied as a prop), or the raw config
  // value (if provided).
  const [tmpConfigText, setTempConfigText] = useState(findPresetById(presets, selectedPresetID)?.configurationValue || configText);
  // Disable save preset button when we have a falsy config text value.
  const [isSavePresetDisabled, setSavePresetDisabled] = useState(!tmpConfigText);
  const [isNameDialogOpen, setNameDialogOpen] = useState(false); // An an old schooler, I miss the simplicity of window.prompt terribly.
  const onChange = (event) => setTempConfigText(event.currentTarget.value);
  const onSaveButtonClicked = () => doSave(tmpConfigText);
  const onSavePresetButtonClicked = () => {
    if (tmpConfigText) {
      setSavePresetDisabled(true);
      setNameDialogOpen(true);
    }
  };

  const onNameDialogCancel = () => {
    setSavePresetDisabled(false);
    setNameDialogOpen(false);
  };

  const onNameDialogSave = async (newName) => {
    const selectedPreset = findPresetById(presets, tmpSelectedPresetID);
    await doSavePreset({
      tool: "youtube-dl",
      name: newName,
      configurationValue: tmpConfigText,
      id: (selectedPreset?.name === newName) ? selectedPresetID : "-1",
    });
    setSavePresetDisabled(false);
    setNameDialogOpen(false);
  };

  const updateTempConfigText = (text:string) => {
    setTempConfigText(text);
    setSavePresetDisabled(!text);
  };

  const onPresetChanged = (newPresetID) => {
    const newPreset = findPresetById(presets, newPresetID);
    if (newPreset) {
      updateTempConfigText(newPreset.configurationValue);
      setSelectedPresetID(newPresetID);
    }
  };

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={1}
      >
        <If condition={!!helperText}>
          <Grid
            item
            xs={12}
          >
            <Typography>{helperText}</Typography>
          </Grid>
        </If>
        <If condition={!_.isEmpty(presets)}>
          <Grid
            item
            xs={12}
          >
            <PresetSelector
              onChange={onPresetChanged}
              presets={presets}
              selectedPreset={tmpSelectedPresetID}
            />
          </Grid>
        </If>
        <Grid
          item
          xs={12}
        >
          <Typography>
            See {YTDLDocLink} for syntax.
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <div className={classes.textAreaContainer}>
            <TextareaAutosize
              aria-label="Textual configuration value"
              autoCorrect="off"
              className={classes.textArea}
              onChange={onChange}
              rowsMin={8}
              spellCheck={false}
              value={tmpConfigText}
            />
          </div>
        </Grid>
        <Grid
          className={classes.bottomButtons}
          item
          xs={12}
        >
          <Button
            aria-label="Save preset"
            className={classes.savePresetButton}
            disabled={isSavePresetDisabled}
            onClick={onSavePresetButtonClicked}
            variant="contained"
          >
            Save Preset
          </Button>
          <Button
            aria-label="Save configuration"
            color="primary"
            onClick={onSaveButtonClicked}
            variant="contained"
          >
            Save
          </Button>
          <Button
            aria-label="Cancel"
            onClick={onCancel}
            variant="contained"
          >
            Cancel
          </Button>
        </Grid>
        <NameInputDialog
          onCancel={onNameDialogCancel}
          onSave={onNameDialogSave}
          open={isNameDialogOpen}
          title="Save config preset as…"
        />
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => ({
  presets: getPresets(state),
});

const mapDispatchToProps = {
  fetchPresets,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigurationEditor);
