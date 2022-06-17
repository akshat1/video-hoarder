import { gql } from "@apollo/client";

export const YTDLInformation = gql`
  query YTDLInformationQuery {
    ytdlInformation {
      executable
      version
    }
  }
`;
