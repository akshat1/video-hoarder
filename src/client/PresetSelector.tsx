import React from 'react';
import { Preset } from '../model/Preset';
import { FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { Add, Edit } from '@mui/icons-material';
import { Theme } from '@emotion/react';

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
          <Add />
        </IconButton>
        <IconButton>
          <Edit />
        </IconButton>
      </div>
    </div>
  );
};

export default PresetSelector;
