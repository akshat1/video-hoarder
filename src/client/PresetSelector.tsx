import { Preset, PresetInput } from "../model/Preset";
import { getLogger } from "../shared/logger";
import { PresetEditor } from "./PresetEditor";
import { Add, Delete, Edit } from "@mui/icons-material";
import { FormControl, IconButton, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";

const rootLogger = getLogger("PresetSelector");
const useStyle = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "row",
  },
  selector: {
    flexGrow: 1,
  },
}));

interface PresetSelectorProps {
  presets: Preset[];
  value: Preset;
  onChange?: (Preset) => void;
}

export const PresetSelector: React.FunctionComponent<PresetSelectorProps> = (props) => {
  const {
    onChange,
    presets,
    value,
  } = props;

  const classes = useStyle();
  const [isPresetEditorOpen, setPresetEditorOpen] = useState(false);
  const [presetEditorValue, setPresetEditorValue] = useState<PresetInput | undefined>(undefined);

  const closePresetEditor = () => {
    setPresetEditorValue(undefined);
    setPresetEditorOpen(false);
  }

  const doNewPreset = () => {
    setPresetEditorValue(undefined);
    setPresetEditorOpen(true);
  }

  const doEditPreset = () => {
    setPresetEditorValue(value);
    setPresetEditorOpen(true);
  };

  const savePreset = () => {
    rootLogger.debug("savePreset");
    // @TODO DownloadOptions should provide a callback to save the preset.
  };

  const onPresetSelectionChange = (event: SelectChangeEvent) =>
    onChange(presets.find((preset: Preset) => preset.id === event.target.value));

  const menuItems = presets.map((preset: Preset) => <MenuItem value={preset.id} key={preset.id}>{preset.name}</MenuItem>);

  return (
    <div className={classes.root}>
      <div className={classes.selector}>
        <FormControl fullWidth>
          <Select
            id="preset-selector"
            onChange={onPresetSelectionChange}
            value={value.id}
            variant="standard"
          >
            {menuItems}
          </Select>
        </FormControl>
      </div>
      <div>
        <IconButton>
          <Delete />
        </IconButton>
        <IconButton onClick={doEditPreset} >
          <Edit/>
        </IconButton>
        <IconButton onClick={doNewPreset} >
          <Add/>
        </IconButton>
      </div>
      <PresetEditor
        value={presetEditorValue}
        open={isPresetEditorOpen}
        onCancel={closePresetEditor}
        onSave={savePreset}
      />
    </div>
  );
};
