/**
 * Renders the application toolbar.
 */
import { doLogOut } from "../redux/actions";
import { getUserName,isLoggedIn } from "../selectors";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar as MuiToolbar,
  Typography,
} from "@material-ui/core";
import { AccountCircle, ExitToApp, Menu as MenuIcon, Settings } from "@material-ui/icons";
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
    appMenuAnchor,
  } = state;
  const classes = useStyles();
  const {
    doLogOut,
    loggedIn,
    userName,
  } = props;

  const openUserMenu = event => setState({ userMenuAnchor: event.currentTarget});
  const closeUserMenu = () => setState({ userMenuAnchor: null });
  const openAppMenu = event => setState({ appMenuAnchor: event.currentTarget });
  const closeAppMenu =() => setState({ appMenuAnchor: null });
  return (
    <AppBar position="static" className={classes.appBar}>
      <MuiToolbar>
        <If condition={loggedIn}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={openAppMenu}>
            <MenuIcon />
          </IconButton>
          <Drawer
            anchorEl={appMenuAnchor}
            open={Boolean(appMenuAnchor)}
            onClose={closeAppMenu}
          >
            <List className={classes.appMenu}>
              <ListItem button key="settings">
                <ListItemIcon><Settings /></ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
            </List>
          </Drawer>
        </If>
        <div className={classes.title} >
          <Box display={{xs: "none", sm: "inline-block"}}>
            <Typography variant="h6">
              Video Hoarder
            </Typography>
          </Box>
        </div>
        <If condition={loggedIn}>
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
            <MenuItem onClick={doLogOut}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <Typography variant="inherit">My Account</Typography>
            </MenuItem>
            <MenuItem onClick={doLogOut}>
              <ListItemIcon>
                <ExitToApp/>
              </ListItemIcon>
              <Typography variant="inherit">Sign out</Typography>
            </MenuItem>
          </Menu>
        </If>
      </MuiToolbar>
    </AppBar>
  );
};

Toolbar.propTypes = {
  doLogOut: PropTypes.func,
  loggedIn: PropTypes.bool,
  userName: PropTypes.string,
};

const dispatchToState = (state) => ({
  loggedIn: isLoggedIn(state),
  userName: getUserName(state),
});

const dispatchToProps = { doLogOut };

export default connect(dispatchToState, dispatchToProps)(Toolbar);
