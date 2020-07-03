/** A tabpanel. Slightly modified from the one given at https://material-ui.com/components/tabs/#SimpleTabs.js */

import PropTypes from "prop-types";
import React from "react";

const TabPanel = ({ children, tabId, activeTabId }) =>
  <If condition={activeTabId === tabId}>
    {children}
  </If>

TabPanel.propTypes = {
  activeTabId: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  tabId: PropTypes.string,
};

export default TabPanel;
