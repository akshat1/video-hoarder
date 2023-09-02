import { Preset } from "../model/Preset";;
import { Typography } from "@mui/material";
import React from "react";

interface PresetInformationProps {
  preset: Preset | undefined;
}

export const PresetInformation: React.FC<PresetInformationProps> = (props) => {
  const { preset } = props;
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
