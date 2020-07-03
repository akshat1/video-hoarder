/** Renders the Settings panel. */
import { isAdmin } from "../../model/User.js";
import { getUser } from "../selectors.js";
import TabPanel from "./TabPanel.jsx";
import UserManagementSettings from "./UserManagementSettings.jsx";
import YTDLSettings from "./YTDLSettings.jsx";
import { Tab,Tabs } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {},
}));

const TabId = {
  YTDL: "YTDL",
  UserManagement: "UserManagement",
};

const Settings = ({ isAdmin }) => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(TabId.YTDL);
  const switchTab = (evt, newTab) => setActiveTab(newTab);

  return (
    <div className={classes.root}>
      <Tabs
        aria-label="tab panel"
        onChange={switchTab}
        value={activeTab}
      >
        <Tab
          aria-controls="Tab for YouTube-DL settings"
          id="tab-youtube-dl"
          label="youtube-dl"
          value={TabId.YTDL}
        />
        <If condition={isAdmin}>
          <Tab
            aria-controls="Tab for user management settings."
            id="tab-user-management"
            label="User Management"
            value={TabId.UserManagement}
          />
        </If>
      </Tabs>
      <TabPanel
        activeTabId={activeTab}
        tabId={TabId.YTDL}
      >
        <YTDLSettings />
      </TabPanel>
      <TabPanel
        activeTabId={activeTab}
        tabId={TabId.UserManagement}
      >
        <UserManagementSettings />
      </TabPanel>
    </div>
  );
};

Settings.propTypes = {
  isAdmin: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAdmin: isAdmin(getUser(state)),
})

export default connect(mapStateToProps)(Settings);
