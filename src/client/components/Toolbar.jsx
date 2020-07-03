/**
 * Renders the application toolbar.
 */
import { doLogOut, goToAccountScreen, goToHome, goToSettings } from "../redux/actions";
import { getUserName, isLoggedIn } from "../selectors";
import Notifications from "./Notifications.jsx";
import {
  AppBar,
  Box,
  Button,
  Fade,
  IconButton,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar as MuiToolbar,
  Typography,
} from "@material-ui/core";
import { AccountCircle, ExitToApp, Settings } from "@material-ui/icons";
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
    title: {
      flexGrow: 1,
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
    goToAccountScreen,
    goToHome,
    goToSettings,
    loggedIn,
    userName,
  } = props;

  const openUserMenu = event => setState({ userMenuAnchor: event.currentTarget});
  const closeUserMenu = () => setState({ userMenuAnchor: null });
  return (
    <AppBar position="static" className={classes.appBar}>
      <MuiToolbar>
        <If condition={loggedIn}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={goToSettings}>
            <Settings />
          </IconButton>
        </If>
        <div className={classes.title} >
          <Box display={{xs: "none", sm: "inline-block"}}>
            <Link variant="h6" onClick={goToHome} color="inherit" className={classes.homeLink}>
              Video Hoarder
            </Link>
          </Box>
        </div>
        <If condition={loggedIn}>
          <Notifications />
          <Button aria-controls="user-menu" aria-haspopup="true" onClick={openUserMenu} className={classes.userMenu}>
            <ListItemIcon>
              <AccountCircle className={classes.userMenu} />
            </ListItemIcon>
            <Typography variant="inherit">{userName}</Typography>
          </Button>
          <Menu
            id="user-menu"
            anchorEl={userMenuAnchor}
            keepMounted
            open={Boolean(userMenuAnchor)}
            onClose={closeUserMenu}
            TransitionComponent={Fade}
            style={getMenuStyle(userMenuAnchor)}
          >
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
  goToHome: PropTypes.func,
  goToSettings: PropTypes.func,
  loggedIn: PropTypes.bool,
  userName: PropTypes.string,
};

const dispatchToState = (state) => ({
  loggedIn: isLoggedIn(state),
  userName: getUserName(state),
});

const dispatchToProps = {
  doLogOut,
  goToAccountScreen,
  goToHome,
  goToSettings,
};

export default connect(dispatchToState, dispatchToProps)(Toolbar);
