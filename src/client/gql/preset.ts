import { Preset } from "../../model/Preset";
import { gql } from '@apollo/client';

export const GetPresets = gql`
  query GetPretsQuery {
    presets {
      id
      name
    }
  }
`;
