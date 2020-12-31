import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "./mui";
import React, { ChangeEvent,useState } from "react";

interface NameInputDialogProps {
  /** If there was an error using this name (name already in use, for example), supply an error message. */
  errorMessage?: string
  /** Set true in order to display the dialog. */
  open: boolean
  /** Use this to close the dialog. */
  onCancel: () => void
  /** Async function. Use this to dispatch an action, and generate any applicable errors; or to close the dialog if the
   * save succeeded. Note that the promise should always resolve; errors should be supplied as the errorMessage prop.
   * that's because this component is pretty much a leaf node in teh component tree and does not know what to do in
   * case an error occurrs (in fact ideally, that logic should be in the action and not in a component at all; but we
   * do mix up that ideal separation of MVC sometimes in order to avoid too much global state). */
  onSave: (name: string) => Promise<void>
  title: string
  helperText?: string
  /** If supplied, this will be used to initially populate the text input. */
  value?: string,
}

const BusyIcon = (
<CircularProgress
  color="primary"
  size={"1rem"}
/>
)

const NameInputDialog:React.FunctionComponent<NameInputDialogProps> = (props) => {
  const {
    errorMessage,
    helperText,
    onCancel,
    onSave,
    open,
    title,
    value = "",
  } = props;

  const [isBusy, setBusy] = useState(false);
  const [tmpName, setTmpName] = useState(value);
  const [isOKDisabled, setOKDisabled] = useState(!value);
  const onNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = event.currentTarget.value;
    setTmpName(newName);
    setOKDisabled(!newName)
  };
  const onOKClicked = async () => {
    if (tmpName) {
      setBusy(true);
      await onSave(tmpName);
      setBusy(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <If condition={!!helperText}>
            {helperText}
          </If>
          <If condition={!!errorMessage}>
            <Typography color="error">
              {errorMessage}
            </Typography>
          </If>
        </DialogContentText>
        <TextField
          disabled={isBusy}
          onChange={onNameChanged}
          value={tmpName}
        />
        <DialogActions>
          <Button
            aria-label="Cancel"
            disabled={isBusy}
            onClick={onCancel}
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            aria-label="Ok"
            color="primary"
            disabled={isOKDisabled || isBusy}
            endIcon={isBusy && BusyIcon}
            onClick={onOKClicked}
            variant="contained"
          >
            Ok
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default NameInputDialog;
