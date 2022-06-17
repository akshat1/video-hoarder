import { User } from "../model/User";
import { getLogger } from "../shared/logger";
import { Query } from "./gql";
import { UsersResponse } from "./gql/user";
import { useQuery } from "@apollo/client";
import { Delete, Error, Person } from "@mui/icons-material";
import { Avatar, CircularProgress, FormControl, Icon, IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemText, MenuItem, Select, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { FunctionComponent, MouseEventHandler } from "react";

interface UserListProps {
  users: User[];
  onDelete?: MouseEventHandler;
  className?: string;
}

const UserList:FunctionComponent<UserListProps> = ({ users, onDelete, className }) => {
  const getDeleteButton = () => (
    <IconButton edge="end" aria-label="Delete" onClick={onDelete}>
      <Delete />
    </IconButton>
  );

  const listItems = users.map(user => (
    <ListItem secondaryAction={getDeleteButton()} className={className} key={user.id}>
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

const useStyles = makeStyles(() => ({
  userList: {},
}));

export const UserSettings:FunctionComponent = () => {
  const { data, error } = useQuery<UsersResponse>(Query.Users);
  const classes = useStyles();

  let output = <CircularProgress />;
  if (data?.users) {
    output = <UserList users={data.users} className={classes.userList}/>;
  } else if (error) {
    getLogger("UserSettings").error(error);
    output = (
      <>
        <Icon><Error /></Icon>
        <Typography color="error">{error.message}</Typography>
      </>
    );
  }

  return output;
};
