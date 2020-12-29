import _ from "lodash";
import { ConfigurationPreset, ConfigurationPresetID } from "../../model/ConfigurationPreset";
import { MenuItem, Select, InputLabel, FormControl } from "./mui";
import React, { Fragment, FunctionComponent } from "react";

interface PresetSelectorProps {
  presets: ConfigurationPreset[]
  selectedPreset?: ConfigurationPresetID
  onChange: (ConfigurationPresetID) => void
}

const SelectOne = <MenuItem disabled value="">Select One</MenuItem>;

/**
 * Renders a select box containing a sorted list of provided ConfigurationPreset objects.
 */
const PresetSelector: FunctionComponent<PresetSelectorProps> = (props) => {
  const presetSelectorLabelID = `presetSelectorLabel-${Math.round(Math.random() * 1000)}`;
  return (
    <FormControl variant="outlined">
      <InputLabel id={presetSelectorLabelID}>Status</InputLabel>   
      <Select
        displayEmpty
        labelId={presetSelectorLabelID}
        onChange={event => props.onChange(event.target.value)}
        value={props.selectedPreset || ""}
      >
        {SelectOne}
        <For
          each="preset"
          of={_.sortBy(props.presets, 'name')}
        >
          <MenuItem value={preset.id}>{preset.name}</MenuItem>
        </For>
      </Select>
    </FormControl>
  );
};

export default PresetSelector;
