import React from 'react';
import { Preset } from '../model/Preset';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface PresetSelectorProps {
  presets: Preset[];
  value: string;
  onChange?: (event: SelectChangeEvent, child: React.ReactNode) => void;
}

const PresetSelector:React.FunctionComponent<PresetSelectorProps>  = (props) => {
  const {
    onChange,
    presets,
    value,
  } = props;

  const menuItems = presets.map((preset: Preset) => <MenuItem value={preset.id} key={preset.id}>{preset.name}</MenuItem>);

  return (
    <FormControl fullWidth>
      <InputLabel id="preset-selector-label">Preset</InputLabel>
      <Select
        id="preset-selector"
        label="Preset"
        labelId="preset-selector-label"
        onChange={onChange}
        value={value}
        variant="standard"
      >
        {menuItems}
      </Select>
    </FormControl>
  );
};

export default PresetSelector;
