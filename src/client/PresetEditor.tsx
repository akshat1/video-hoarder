import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Slide, TextField, Theme, Typography, Checkbox } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { infoTable } from "./cssUtils";
import { Preset, PresetInput } from "../model/Preset";
import { FormatSelector } from "./FormatSelector";
import { YTFormat } from "../model/YouTube";
import { DownloadRateInput } from "./DownloadRateInput";

type ActualTransitionProps = TransitionProps & { children: React.ReactElement; };  // Why do TransitionProps not include Children by default?
const Transition = React.forwardRef(function Transition(props: ActualTransitionProps, ref: React.Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface PresetEditorProps {
  open: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const useStyle = makeStyles((theme: Theme) => ({
  inputGrid: infoTable(theme, {
    justifyItems: "stretch",
    alignItems: "center",
  }),
  checkboxContainer: {
    justifySelf: "left",
  }
}));

const BlankPreset: PresetInput = {
  name: "",
  downloadLocation: "",
  formatSelector: YTFormat.BestBestMerged.formatId,
  rateLimit: "",
  isPrivate: false,
  saveMetadata: false,
  generateNFO: false,
};

interface PresetEditorState {
  preset: PresetInput;
  isChanged: boolean;
}

export const PresetEditor: React.FunctionComponent<PresetEditorProps> = (props) => {
  const {
    open,
    onSave,
    onCancel,
  } = props;

  const classes = useStyle();
  const [{
    preset,
    isChanged,
  }, setState] = useState({ 
    preset: BlankPreset,
    isChanged: false,
  });

  const {
    name,
    downloadLocation,
    formatSelector,
    rateLimit,
    isPrivate,
    saveMetadata,
    generateNFO,
  } = preset;

  const constructPreset = () => ({
    name,
    downloadLocation,
    formatSelector,
    rateLimit,
    isPrivate,
    saveMetadata,
    generateNFO,
  });

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setState({
      preset: {
        ...constructPreset(),
        name: event.target.value,
      },
      isChanged: true,
    });
  
  const onDownloadLocationChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setState({
      preset: {
        ...constructPreset(),
        downloadLocation: event.target.value,
      },
      isChanged: true,
    });
  
  const onFormatSelectorChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setState({
      preset: {
        ...constructPreset(),
        formatSelector: event.target.value,
      },
      isChanged: true,
    });
  
  const onRateLimitChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setState({
      preset: {
        ...constructPreset(),
        rateLimit: event.target.value,
      },
      isChanged: true,
    });
  
  const onIsPrivateChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setState({
      preset: {
        ...constructPreset(),
        isPrivate: !isPrivate,
      },
      isChanged: true,
    });
  
  const onSaveMetadataChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setState({
      preset: {
        ...constructPreset(),
        saveMetadata: !saveMetadata,
      },
      isChanged: true,
    });
  
  const onGenerateNFOChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setState({
      preset: {
        ...constructPreset(),
        generateNFO: !generateNFO,
      },
      isChanged: true,
    });

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      TransitionComponent={Transition}
    >
      <DialogTitle>Preset Editor</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div className={classes.inputGrid}>
            <Typography>Name</Typography>
            <TextField variant="standard" value={name} onChange={onNameChange}/>

            <Typography>Download location</Typography>
            <TextField variant="standard" value={downloadLocation} onChange={onDownloadLocationChange}/>

            <Typography>Format</Typography>
            <FormatSelector value={formatSelector} onChange={onFormatSelectorChange}/>

            <Typography>Rate limit</Typography>
            <DownloadRateInput value={rateLimit} onChange={onRateLimitChange}/>

            <Typography>Private?</Typography>
            <div className={classes.checkboxContainer}>
              <Checkbox checked={isPrivate} onChange={onIsPrivateChange}/>
            </div>

            <Typography>Save metadata</Typography>
            <div className={classes.checkboxContainer}>
              <Checkbox checked={saveMetadata} onChange={onSaveMetadataChange}/>
            </div>

            <Typography>Generate NFO</Typography>
            <div className={classes.checkboxContainer}>
              <Checkbox checked={generateNFO} onChange={onGenerateNFOChange}/>
            </div>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave} disabled={!isChanged}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};
