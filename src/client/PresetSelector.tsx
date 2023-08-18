import React, { useState } from 'react';
import { Preset } from '../model/Preset';
import { FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { Add, Delete, Edit } from '@mui/icons-material';
import { Theme } from '@emotion/react';
import { PresetEditor } from './PresetEditor';

const useStyle = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  selector: {
    flexGrow: 1,
  }
}));

interface PresetSelectorProps {
  presets: Preset[];
  value: string;
  onChange?: (event: SelectChangeEvent, child: React.ReactNode) => void;
}

const PresetSelector: React.FunctionComponent<PresetSelectorProps> = (props) => {
  const {
    onChange,
    presets,
    value,
  } = props;

  const classes = useStyle();
  const [isPresetEditorOpen, setPresetEditorOpen] = useState(false);
  const openPresetEditor = () => setPresetEditorOpen(true);
  const onPresetEditorClose = () => setPresetEditorOpen(false);
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
        <IconButton>
          <Edit />
        </IconButton>
        <IconButton>
          <Add onClick={openPresetEditor} />
        </IconButton>
      </div>
      <PresetEditor
        open={isPresetEditorOpen}
        onCancel={onPresetEditorClose}
        onSave={onPresetEditorClose}
      />
    </div>
  );
};

export default PresetSelector;
