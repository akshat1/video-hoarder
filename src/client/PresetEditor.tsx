import { Dialog, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";

type ActualTransitionProps = TransitionProps & { children: React.ReactElement; };  // Why do TransitionProps not include Children by default?
const Transition = React.forwardRef(function Transition(props: ActualTransitionProps, ref: React.Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface PresetEditorProps {
  open: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const PresetEditor: React.FunctionComponent<PresetEditorProps> = (props) => {
  const {
    open,
    onSave,
    onCancel,
  } = props;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onCancel}
      TransitionComponent={Transition}
    >
      <h1>Preset Editor</h1>
      <button onClick={onSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </Dialog>
  );
};
