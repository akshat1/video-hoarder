import { Mutation,Query } from "./gql";
import { useMutation } from "@apollo/client";
import { ExitToApp, Home, Settings } from "@mui/icons-material";
import { IconButton, Toolbar as MUIToolbar } from "@mui/material";
import _ from "lodash";
import React, { FunctionComponent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const Toolbar:FunctionComponent = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const backButtonEnabled = pathname !== "/";
  const [doLogout, logoutThunk] = useMutation(
    Mutation.Logout,
    {
      update: (cache) => cache.writeQuery({
        query: Query.CurrentUser,
        data: { currentUser: null },
      }),
    }
  );

  const handleBackButton = () => navigate("/");
  const handleLogoutClick = _.debounce(() => doLogout(), 250);

  return (
    <MUIToolbar>
      <IconButton
        aria-label="Go back"
        color="inherit"
        edge="start"
        key="btn-back"
        size="large"
        onClick={handleBackButton}
        disabled={!backButtonEnabled}
      >
        <Home />
      </IconButton>
      <IconButton
        aria-label="Settings"
        color="inherit"
        edge="start"
        key="btn-settings"
        href="./settings"
        size="large">
        <Settings />
      </IconButton>
      <IconButton
        aria-label="Log Out"
        color="inherit"
        edge="start"
        key="btn-logout"
        disabled={logoutThunk.loading}
        onClick={handleLogoutClick}
        size="large">
        <ExitToApp />
      </IconButton>
    </MUIToolbar>
  );
};

/*
<IconButton
  aria-label="Add a new download"
  color="inherit"
  edge="start"
  key="btn-add-new-download"
  size="large">
  <Add />
</IconButton>
*/
