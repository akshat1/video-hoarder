import { Role } from "../model/Role";
import { User } from "../model/User";
import { getLogger } from "../shared/logger";
import { infoTable } from "./cssUtils";
import { Mutation, Query } from "./gql";
import { UsersResponse } from "./gql/user";
import { useMutation, useQuery } from "@apollo/client";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, MenuItem, Select, SelectChangeEvent, TextField, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { ChangeEventHandler, Dispatch, FunctionComponent, MouseEventHandler, SetStateAction, useEffect, useState } from "react";

/*
1. Username may only contain letters, numbers, dashes, and underscores.
2. Must be at least 6 and no more than 18 characters long.
3. Must not already be in use.
*/
const UserNamePattern = /^[a-zA-Z-_\d]{6,18}$/;
const isUserNameValid = (userName: string): boolean =>
  userName && UserNamePattern.test(userName);

/*
1. Password must be at least 8 and no more than 100 characters long.
2. Password must contain at least 1 each of upper case letters, lower case letters, numbers, and special characters.
*/
const isPasswordValid = (password: string): boolean => {
  // I'm sure there's a way to do this in a single regexp but this is what I know at the moment, and it works.
  if (password && password.length > 8 && password.length < 101) 
    if (/[a-z]+/.test(password))     // has at least 1 lower case letter
      if (/[A-Z]+/.test(password))   // has at least 1 upper case letter
        if (/\d+/.test(password))    // has at least 1 number
          if (/[!@#\$%\^&\*\(\)\-_=\+\[\{\]\}\|\\;:\'\,\./\?<>`~"]+/.test(password))  // has at least 1 special character
            return true;
          
        
      
    
  

  return false;
};

interface EvaluateFormValuesArgs {
  state: NewUserFormState;
  setState: Dispatch<SetStateAction<NewUserFormState>>;
  users: User[];
}

const evaluateFormValues = (args: EvaluateFormValuesArgs) => {
  const {
    state,
    setState,
    users,
  } = args;
  const {
    userName,
    passwordOne,
    passwordTwo,
  } = state;

  if (!isUserNameValid(userName)) {
    setState({
      ...state,
      submitDisabled: true,
      userNameError: "Invalid user name.",
    });

    return;
  }

  if (users.find(user => user.userName === userName)) {
    setState({
      ...state,
      submitDisabled: true,
      userNameError: "User already exists.",
    });

    return;
  }

  if (!isPasswordValid(passwordOne)) {
    setState({
      ...state,
      submitDisabled: true,
      userNameError: "",
      passwordOneError: "Password requirements not met.",
    });

    return;
  }

  if (passwordOne !== passwordTwo) {
    setState({
      ...state,
      submitDisabled: true,
      userNameError: "",
      passwordOneError: "",
      passwordTwoError: "Password fields must match.",
    });

    return;
  }

  setState({
    ...state,
    submitDisabled: false,
    userNameError: "",
    passwordOneError: "",
    passwordTwoError: "",
  });
};

const useStyles = makeStyles((theme: Theme) => ({
  inputForm: {
    ...infoTable(theme, { rowGap: 1 }),
    width: "500px",
  },
}));

interface NewUserFormProps {
  open?: boolean;
  onCancel?: () => void;
  onAddition?: () => void;
}

interface NewUserFormState {
  userName: string;
  passwordOne: string;
  passwordTwo: string;
  submitDisabled: boolean;
  userNameError: string;
  passwordOneError: string;
  passwordTwoError: string;
  role: Role;
}

const Instructions = (
  <>
    <ul>
      <li>Username must be at least 8 and no more than 18 characters long.</li>
      <li>Username may only container letters, numbers, dashes, and underscores.</li>
      <li>Both the password fields must match.</li>
      <li>Password must be at least 8 and no more than 100 characters long.</li>
      <li>Password must contain at least 1 each of upper case letters, lower case letters, numbers, and special characters.</li>
    </ul>
  </>
);

export const NewUserForm: FunctionComponent<NewUserFormProps> = (props) => {
  const {
    onCancel,
    onAddition,
    open,
  } = props;
  const logger = getLogger("NewUserForm");
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const {
    data: usersResponse,
    error: usersError,
    loading: loadingUsers,
  } = useQuery<UsersResponse>(Query.Users);
  const users = usersResponse?.users || [];
  const [state, setState] = useState<NewUserFormState>({
    role: Role.User,
    userName: "",
    passwordOne: "",
    passwordTwo: "",
    submitDisabled: true,
    userNameError: "",
    passwordOneError: "",
    passwordTwoError: "",
  });
  const [doAddUser, addUserThunk] = useMutation(Mutation.CreateUser, {
    refetchQueries: [{ query: Query.Users }, "Users"],
  });
  const disableEverything = addUserThunk && (addUserThunk.loading || Boolean(addUserThunk.error));
  const {
    passwordOne,
    passwordOneError,
    passwordTwo,
    passwordTwoError,
    role,
    submitDisabled,
    userName,
    userNameError,
  } = state;

  useEffect(() => {
    evaluateFormValues({
      setState,
      state,
      users,
    });
  }, [userName, passwordOne, passwordTwo, users]);

  const userNameInputAdornment = loadingUsers && (
    <InputAdornment position="end">
      <CircularProgress />
    </InputAdornment>
  );

  const makeChangeHandler = (propertyName: string):ChangeEventHandler<HTMLTextAreaElement> =>
    event =>
      setState({
        ...state,
        [propertyName]: event.target.value,
      });

  const handleUserNameChanged:ChangeEventHandler<HTMLTextAreaElement> = makeChangeHandler("userName");
  const handlePasswordOneChange:ChangeEventHandler<HTMLTextAreaElement> = makeChangeHandler("passwordOne");
  const handlePasswordTwoChange:ChangeEventHandler<HTMLTextAreaElement> = makeChangeHandler("passwordTwo");
  /// @ts-ignore
  const handleRoleChange:(event: SelectChangeEvent, child: React.ReactNode) => void = makeChangeHandler("role");

  const handleAddClick:MouseEventHandler = async () => {
    getLogger("handleAddClick", logger).debug("Handle Add Button Click");
    await doAddUser({
      variables: {
        data: {
          userName,
          password: passwordOne,
          role,
        },
      },
    });
    if(typeof onAddition === "function")
      onAddition();
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="newUserDialogTitle"
      fullScreen={fullScreen}
      maxWidth="lg"
    >
      <DialogTitle id="newUserDialogTitle">Add a new user</DialogTitle>
      <DialogContent>
        {Instructions}
        <form className={classes.inputForm}>
          <Typography>Role</Typography>
          <Select value={role} onChange={handleRoleChange} disabled={disableEverything}>
            <MenuItem value={Role.Admin}>Admin</MenuItem>
            <MenuItem value={Role.User}>User</MenuItem>
          </Select>
          <Typography>User name</Typography>
          <TextField
            autoComplete="username"
            error={Boolean(userNameError)}
            helperText={userNameError}
            id="username"
            onChange={handleUserNameChanged}
            disabled={loadingUsers || Boolean(usersError) || disableEverything}
            InputProps={{endAdornment: userNameInputAdornment}}
          />
          <Typography>Password</Typography>
          <TextField
            autoComplete="new-password"
            error={Boolean(passwordOneError)}
            helperText={passwordOneError}
            id="password-one"
            onChange={handlePasswordOneChange}
            type="password"
            disabled={disableEverything}
          />
          <Typography>Enter password again</Typography>
          <TextField
            autoComplete="new-password"
            error={Boolean(passwordTwoError)}
            helperText={passwordTwoError}
            id="password-two"
            onChange={handlePasswordTwoChange}
            type="password"
            disabled={disableEverything}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined">Cancel</Button>
        <Button
          variant="outlined"
          color="primary"
          disabled={submitDisabled || disableEverything}
          onClick={handleAddClick}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
