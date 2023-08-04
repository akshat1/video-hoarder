import React from 'react';
import { useQuery } from '@apollo/client';
import { GetPresets } from './gql/preset';
import { Preset } from '../model/Preset';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface PresetSelectorProps {
  value: string;
  onChange?: (event: SelectChangeEvent, child: React.ReactNode) => void;
}

const PresetSelector:React.FunctionComponent<PresetSelectorProps>  = ({ value, onChange }) => {
  const { loading, error, data } = useQuery(GetPresets);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  // At this point we know we have data
  const menuItems = data.presets.map((preset: Preset) => <MenuItem value={preset.id} key={preset.id}>{preset.name}</MenuItem>);

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
