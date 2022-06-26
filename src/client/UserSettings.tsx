/**
 * @TODO Handle delete user errors (through error notifications / bar or something).
 */
import { User } from "../model/User";
import { getLogger } from "../shared/logger";
import { verticalFlexBox } from "./cssUtils";
import { Mutation, Query } from "./gql";
import { CurrentUserResponse, UsersResponse } from "./gql/user";
import { NewUserForm } from "./NewUserForm";
import { useMutation, useQuery } from "@apollo/client";
import { Add, Delete, Error, Person } from "@mui/icons-material";
import { Avatar, Box, Button, CircularProgress, Icon, IconButton, List, ListItem, ListItemAvatar, ListItemText, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { FunctionComponent, useState } from "react";

interface UserListProps {
  busy: boolean,
  className?: string;
  currentUser: User;
  onDelete?: (userId: string) => void;
  users: User[];
}

const UserList:FunctionComponent<UserListProps> = (props) => {
  const {
    busy,
    className,
    currentUser,
    onDelete,
    users,
  } = props;
  const getDeleteButton = (user: User) => {
    if (currentUser.id !== user.id) {
      const icon = busy ? <CircularProgress /> : <Delete />;
      return (
        <IconButton edge="end" aria-label="Delete" onClick={() => onDelete(user.id)} disabled={busy}>
          {icon}
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
  userSettingsRoot: {
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
  const [doDeleteUser, deleteUserThunk] = useMutation(Mutation.DeleteUser, {
    refetchQueries: [{ query: Query.Users }, "Users"],
  });
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(false);
  const handleNewUserDialogClose = () => setNewUserDialogOpen(false);
  const handleUserAddition = () => setNewUserDialogOpen(false);
  const showNewUserDialog = () => setNewUserDialogOpen(true);
  const handleDeleteButtonClick= (userId: string) =>
    doDeleteUser({ variables: { userId } });
  
  const classes = useStyles();

  if (loadingUsers || loadingCurrentUser) 
    return (
      <div className={classes.userSettingsRoot}>
        <CircularProgress />
      </div>
    );
   else if (usersError || currentUserError) {
    const logger = getLogger("UserSettings");
    usersError && logger.error(usersError);
    currentUserError && logger.error(currentUserError);
    return (
      <div className={classes.userSettingsRoot}>
        <Icon><Error /></Icon>
        {usersError && <Typography color="error">{usersError.message}</Typography>}
        {currentUserError && <Typography color="error">{currentUserError.message}</Typography>}
      </div>
    );
  } else if (usersResponse?.users) 
    return (
      <div className={classes.userSettingsRoot}>
        <Box className={classes.buttonContainer}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            color="primary"
            aria-label="Add a new user"
            onClick={showNewUserDialog}
          >
            Add New User
          </Button>
        </Box>
        <NewUserForm
          onAddition={handleUserAddition}
          open={newUserDialogOpen}
          onCancel={handleNewUserDialogClose}
        />
        <UserList
          busy={deleteUserThunk.loading}
          users={usersResponse.users}
          className={classes.userList}
          currentUser={currentUserResponse.currentUser}
          onDelete={handleDeleteButtonClick}
        />
      </div>
    );
  
};
