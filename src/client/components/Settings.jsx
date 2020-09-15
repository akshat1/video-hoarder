/** Renders the Settings panel. */
import { isAdmin } from "../../model/User";
import { getUser } from "../selectors";
import { makeStyles,Tab, Tabs } from "./mui";
import TabPanel from "./TabPanel";
import UserManagementSettings from "./UserManagementSettings";
import YTDLConfigSettings from "./YTDLConfig";
import YTDLSettings from "./YTDLSettings";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {},
}));

const TabId = {
  UserManagement: "UserManagement",
  YTDLConfiguration: "YTDLConfiguration",
  YTDLExecutable: "YTDLExecutable",
};

const Settings = ({ isAdmin }) => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(TabId.YTDLExecutable);
  const switchTab = (evt, newTab) => setActiveTab(newTab);

  return (
    <div className={classes.root}>
      <Tabs
        aria-label="tab panel"
        onChange={switchTab}
        value={activeTab}
      >
        <Tab
          aria-controls="Tab for managing the YouTube-DL executable"
          id={TabId.YTDLExecutable}
          label="youtube-dl executable"
          value={TabId.YTDLExecutable}
        />
        <Tab
          aria-controls="Tab for YouTube-DL configuration"
          id={TabId.YTDLConfiguration}
          label="youtube-dl configuration"
          value={TabId.YTDLConfiguration}
        />
        <If condition={isAdmin}>
          <Tab
            aria-controls="Tab for user management settings."
            id={TabId.UserManagement}
            label="User Management"
            value={TabId.UserManagement}
          />
        </If>
      </Tabs>
      <TabPanel
        activeTabId={activeTab}
        tabId={TabId.YTDLExecutable}
      >
        <YTDLSettings />
      </TabPanel>
      <TabPanel
        activeTabId={activeTab}
        tabId={TabId.YTDLConfiguration}
      >
        <YTDLConfigSettings />
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
