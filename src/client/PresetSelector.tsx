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
  value: string;
  onChange?: (event: SelectChangeEvent, child: React.ReactNode) => void;
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
    const logger = getLogger("doNewPreset", rootLogger);
    logger.debug("setPresetEditorValue(undefined);");
    setPresetEditorValue(undefined);
    logger.debug("setPresetEditorOpen(true);");
    setPresetEditorOpen(true);
  }

  const doEditPreset = () => {
    const logger = getLogger("doNewPreset", rootLogger);
    const selectedPreset = presets.find(preset => preset.id === value);
    logger.debug("setPresetEditorValue(", selectedPreset, ")");
    setPresetEditorValue(selectedPreset);
    logger.debug("setPresetEditorOpen(true);");
    setPresetEditorOpen(true);
  };

  const savePreset = () => {
    rootLogger.debug("savePreset");
    // @TODO DownloadOptions should provide a callback to save the preset.
  };

  const menuItems = presets.map((preset: Preset) => <MenuItem value={preset.id} key={preset.id}>{preset.name}</MenuItem>);

  return (
    <div className={classes.root}>
      <div className={classes.selector}>
        <FormControl fullWidth>
          <Select
            id="preset-selector"
            onChange={onChange}
            value={value}
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
