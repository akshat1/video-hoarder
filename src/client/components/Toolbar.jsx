/**
 * Renders the application toolbar.
 */
import { doLogOut, goBack, goToAccountScreen, goToSettings } from "../redux/actions";
import { isLoggedIn, isOnHomePage } from "../selectors";
import Notifications from "./Notifications.jsx";
import {
  AppBar,
  Fade,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar as MuiToolbar,
  Typography,
} from "@material-ui/core";
import { AccountCircle, ArrowBack, ExitToApp, Menu as MenuIcon, Settings } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => {
  return {
    appBar: {
      margin: 0,
      padding: 0,
    },
    userMenu: {
      color: theme.palette.primary.contrastText,
    },
    appMenu: {
      minWidth: "15vw",
    },
    homeLink: {
      cursor: "pointer",
    },
    spacer: {
      flex: "1 1",
    },
  };
});

const getMenuStyle = anchorEl => ({
  marginTop: anchorEl ? `${anchorEl.getBoundingClientRect().height}px` : undefined,
});

export const Toolbar = (props) => {
  const [state, setState] = useState({
    appMenuAnchor: null,
    userMenuAnchor: null,
  });
  const {
    userMenuAnchor,
  } = state;
  const classes = useStyles();
  const {
    doLogOut,
    goBack,
    goToAccountScreen,
    goToSettings,
    loggedIn,
    showBackButton,
  } = props;

  const openUserMenu = event => setState({ userMenuAnchor: event.currentTarget});
  const closeUserMenu = () => setState({ userMenuAnchor: null });
  return (
    <AppBar
      className={classes.appBar}
      position="static"
    >
      <MuiToolbar>
        <If condition={showBackButton}>
          <IconButton
            aria-label="go back"
            color="inherit"
            edge="start"
            onClick={goBack}
          >
            <ArrowBack />
          </IconButton>
        </If>
        <div className={classes.spacer} />
        <If condition={loggedIn}>
          <Notifications />
          <IconButton
            aria-label="menu"
            className={classes.menuIcon}
            color="inherit"
            edge="start"
            onClick={openUserMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={userMenuAnchor}
            id="user-menu"
            keepMounted
            onClose={closeUserMenu}
            open={Boolean(userMenuAnchor)}
            style={getMenuStyle(userMenuAnchor)}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={goToSettings}>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <Typography variant="inherit">Settings</Typography>
            </MenuItem>
            <MenuItem onClick={goToAccountScreen}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <Typography variant="inherit">My Account</Typography>
            </MenuItem>
            <MenuItem onClick={doLogOut}>
              <ListItemIcon>
                <ExitToApp/>
              </ListItemIcon>
              <Typography variant="inherit">Sign Out</Typography>
            </MenuItem>
          </Menu>
        </If>
      </MuiToolbar>
    </AppBar>
  );
};

Toolbar.propTypes = {
  doLogOut: PropTypes.func,
  goToAccountScreen: PropTypes.func,
  goBack: PropTypes.func,
  goToSettings: PropTypes.func,
  loggedIn: PropTypes.bool,
  showBackButton: PropTypes.bool,
};

const dispatchToState = (state) => ({
  loggedIn: isLoggedIn(state),
  showBackButton: isLoggedIn(state) && !isOnHomePage(state),
});

const dispatchToProps = {
  doLogOut,
  goToAccountScreen,
  goBack,
  goToSettings,
};

export default connect(dispatchToState, dispatchToProps)(Toolbar);
