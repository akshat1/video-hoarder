import { User } from "../model/User";
import { getLogger } from "../shared/logger";
import { verticalFlexBox } from "./cssUtils";
import { Query } from "./gql";
import { CurrentUserResponse, UsersResponse } from "./gql/user";
import { useQuery } from "@apollo/client";
import { Add, Delete, Error, Person } from "@mui/icons-material";
import { Avatar, Box, Button, CircularProgress, Fab, FormControl, Icon, IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemText, MenuItem, Select, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { FunctionComponent, MouseEventHandler } from "react";

interface UserListProps {
  users: User[];
  onDelete?: MouseEventHandler;
  className?: string;
  currentUser: User;
}

const UserList:FunctionComponent<UserListProps> = ({ users, onDelete, className, currentUser }) => {
  const getDeleteButton = (user: User) => {
    if (currentUser.id !== user.id) {
      return (
        <IconButton edge="end" aria-label="Delete" onClick={onDelete}>
          <Delete />
        </IconButton>
      );
    }

    return null;
  }

  const listItems = users.map(user => (
    <ListItem secondaryAction={getDeleteButton(user)} className={className} key={user.id}>
      <ListItemAvatar>
        <Avatar><Person /></Avatar>
      </ListItemAvatar>
      <ListItemText primary={user.userName}/>
    </ListItem>
  ));

  return (
    <List dense>
      {listItems}
    </List>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    ...verticalFlexBox(),
  },
  userList: {},
  buttonContainer: {
    padding: theme.spacing(1),
    borderBottomColor: theme.palette.divider,
    borderBottom: "1px solid",
  },
}));

export const UserSettings:FunctionComponent = () => {
  const {
    data: usersResponse,
    error: usersError,
    loading: loadingUsers,
  } = useQuery<UsersResponse>(Query.Users);
  const {
    data: currentUserResponse,
    error: currentUserError,
    loading: loadingCurrentUser,
  } = useQuery<CurrentUserResponse>(Query.CurrentUser);
  
  const classes = useStyles();

  if (loadingUsers || loadingCurrentUser) {
    return (
      <div className={classes.root}>
        <CircularProgress />
      </div>
    );
  } else if (usersError || currentUserError) {
    const logger = getLogger("UserSettings");
    usersError && logger.error(usersError);
    currentUserError && logger.error(currentUserError);
    return (
      <div className={classes.root}>
        <Icon><Error /></Icon>
        {usersError && <Typography color="error">{usersError.message}</Typography>}
        {currentUserError && <Typography color="error">{currentUserError.message}</Typography>}
      </div>
    );
  } else if (usersResponse?.users) {
    return (
      <div className={classes.root}>
        <Box className={classes.buttonContainer}>
          <Button variant="outlined" startIcon={<Add />} color="primary" aria-label="Add a new user">
            Add New User
          </Button>
        </Box>
        <UserList
          users={usersResponse.users}
          className={classes.userList}
          currentUser={currentUserResponse.currentUser}
        />
      </div>
    );
  }
};
