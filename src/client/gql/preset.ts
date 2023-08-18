import { Preset } from "../../model/Preset";
import { gql } from '@apollo/client';

export const GetPresets = gql`
  query GetPresetsQuery {
    presets {
      id
      name
    }
  }
`;

export const GetPreset = gql`
  query GetPresetQuery($id: String!) {
    preset(id: $id) {
      id
      name
      downloadLocation
      formatSelector
      rateLimit
      isPrivate
    }
  }
`;
