import { gql } from "@apollo/client";

export const GetPresets = gql`
  query GetPresetsQuery {
    presets {
      id
      name
      downloadLocation
      formatSelector
      rateLimit
      isPrivate
      saveMetadata
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
      saveMetadata
    }
  }
`;
