import { PresetInput } from "../model/Preset";
import { YTFormat } from "../model/YouTube";
import { getLogger } from "../shared/logger";
import { infoTable } from "./cssUtils";
import { DownloadRateInput } from "./DownloadRateInput";
import { FormatSelector } from "./FormatSelector";
import { Button, Checkbox,Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField, Theme, Typography } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { makeStyles } from "@mui/styles";
import _ from "lodash";
import React, { useEffect, useState } from "react";

const logger = getLogger("PresetEditor");

type ActualTransitionProps = TransitionProps & { children: React.ReactElement; };  // Why do TransitionProps not include Children by default?
const Transition = React.forwardRef(function Transition(props: ActualTransitionProps, ref: React.Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface PresetEditorProps {
  open: boolean;
  value: PresetInput | undefined;
  onSave: (Preset) => void;
  onCancel: () => void;
}

const useStyle = makeStyles((theme: Theme) => ({
  inputGrid: infoTable(theme, {
    justifyItems: "stretch",
    alignItems: "center",
  }),
  checkboxContainer: {
    justifySelf: "left",
  },
  locationInput: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
}));

const BlankPreset: PresetInput = {
  name: "",
  downloadLocation: "",
  // @TODO: Applicable format selectors should be returned by the Metadata response taking into account available formats.
  formatSelector: "",
  rateLimit: "",
  isPrivate: false,
  saveMetadata: false,
};

interface PresetEditorState {
  preset: PresetInput;
  isChanged: boolean;
}

export const PresetEditor: React.FunctionComponent<PresetEditorProps> = (props) => {
  const classes = useStyle();
  logger.debug("props", props);
  const {
    value = BlankPreset,
    open,
    onSave,
    onCancel,
  } = props;

  const [state, setState] = useState<PresetEditorState>({
    preset: _.cloneDeep(value),  // We don't want to mutate the original value
    isChanged: false,
  });
  useEffect(() => {
    setState({
      preset: _.cloneDeep(value),  // We don't want to mutate the original value
      isChanged: false,
    });
  }, [value]);

  const {
    preset,
    isChanged,
  } = state;

  logger.debug("preset in state", preset);
  const {
    name,
    downloadLocation,
    formatSelector = YTFormat.BestBestMerged.formatId,
    rateLimit,
    isPrivate,
    saveMetadata,
  } = preset;

  const constructPreset = () => ({
    name,
    downloadLocation,
    formatSelector,
    rateLimit,
    isPrivate,
    saveMetadata,
  });

  const doChange = (property: string, isCheckBox: boolean = false) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const newPreset = constructPreset();
      newPreset[property] = isCheckBox ? !preset[property] : event.target.value;
      const isChanged = !_.isEqual(newPreset, preset);
      setState({
        preset: newPreset,
        isChanged,
      });
    };
  }

  const onNameChange = doChange("name");
  const onDownloadLocationChange = doChange("downloadLocation");
  const onFormatSelectorChange = doChange("formatSelector");
  const onRateLimitChange = doChange("rateLimit");
  const onIsPrivateChange = doChange("isPrivate", true);
  const onSaveMetadataChange = doChange("saveMetadata", true);

  const doCancel = () => {
    setState({
      preset: value,
      isChanged: false,
    });
    onCancel();
  };

  const doSave = () => {
    const newPreset = constructPreset();
    onSave(newPreset);
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      TransitionComponent={Transition}
    >
      <DialogTitle>Preset Editor</DialogTitle>
      <DialogContent>
        <div className={classes.inputGrid}>
          <Typography>Name*</Typography>
          <TextField variant="standard" value={name} onChange={onNameChange} />

          <Typography>Download location</Typography>
          <div className={classes.locationInput}>
            <Typography>UserHome/</Typography>
            <TextField variant="standard" value={downloadLocation} onChange={onDownloadLocationChange} />
          </div>

          <Typography>Format</Typography>
          <FormatSelector value={formatSelector} onChange={onFormatSelectorChange} />

          <Typography>Rate limit</Typography>
          <DownloadRateInput value={rateLimit} onChange={onRateLimitChange}/>

          <Typography>Private?</Typography>
          <div className={classes.checkboxContainer}>
            <Checkbox checked={isPrivate} onChange={onIsPrivateChange} />
          </div>

          <Typography>Save metadata JSON</Typography>
          <div className={classes.checkboxContainer}>
            <Checkbox checked={saveMetadata} onChange={onSaveMetadataChange} />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={doCancel}>Cancel</Button>
        <Button onClick={doSave} disabled={!isChanged}>{`Save ? ${isChanged}`}</Button>
      </DialogActions>
    </Dialog>
  );
};
