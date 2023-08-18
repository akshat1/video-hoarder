import React from "react";
import { GetPreset } from "./gql/preset";
import { Typography, } from "@mui/material";
import { useQuery } from "@apollo/client";
import { Preset } from "../model/Preset";

interface PresetInformationProps {
  presetId: string;
}

export const PresetInformation: React.FC<PresetInformationProps> = (props) => {
  const { presetId } = props;
  // Obtain the preset information from the server.
  const { loading, error, data } = useQuery<{ preset: Preset}>(GetPreset, {
    variables: { id: presetId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  
  const { preset } = data;
  if (!preset) return <p>No preset found.</p>;

  const {
    downloadLocation,
    formatSelector,
    rateLimit,
    isPrivate,
  } = preset;
  
  return (
    <>
      <Typography>Download location</Typography>
      <Typography>{downloadLocation || "/"}</Typography>
      <Typography>Format selector</Typography>
      <Typography>{formatSelector || "Best"}</Typography>
      <Typography>Rate limit</Typography>
      <Typography>{rateLimit || "None"}</Typography>
      <Typography>Private</Typography>
      <Typography>{isPrivate ? "Yes" : "No"}</Typography>
    </>
  );
};
