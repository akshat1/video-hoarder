import { canChangeSettings } from "../shared/perms";
import { infoTable, verticalFlexBox } from "./cssUtils";
import { Query } from "./gql";
import { CurrentUserResponse } from "./gql/user";
import { useTitle } from "./hooks";
import { PersonalSettings } from "./PersonalSettings";
import { UserSettings } from "./UserSettings";
import { YTDLSettings } from "./YTDL";
import { useQuery } from "@apollo/client";
import { TabContext,TabList, TabPanel } from "@mui/lab";
import { Box, Grid, Tab, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { ChangeEvent, FunctionComponent, useState } from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    ...verticalFlexBox(),
    width: "100%",
    flexGrow: 1,
  },
  tabs: {
    borderBottom: 1,
    borderColor: "divider",
  },
  passwordInputForm: {
    ...infoTable(theme),
  },
  tabPanel: {},
}));

enum TabId {
  Personal = "PersonalSettings",
  YTDL = "YTDL",
  User = "User",
}

export const Settings:FunctionComponent = () => {
  useTitle("Settings");
  const classes = useStyles();
  const [currentTab, setTab] = useState(TabId.Personal);
  const handleTabChange = (event: ChangeEvent, newValue: TabId) => {
    setTab(newValue);
  };

  const { data } = useQuery<CurrentUserResponse>(Query.CurrentUser);
  const user = data?.currentUser;
  const showYTDLSettings = canChangeSettings(user);
  const showUserSettings = canChangeSettings(user);

  return (
    <Box className={classes.root}>
      <TabContext value={currentTab}>
        <Box className={classes.tabs}>
          <TabList onChange={handleTabChange} aria-label="Setting sub-sections.">
            <Tab label="User settings" value={TabId.Personal} />
            {showYTDLSettings && <Tab label="YTDLP settings" value={TabId.YTDL} />}
            {showUserSettings && <Tab label="Users" value={TabId.User} />}
          </TabList>
        </Box>
        <TabPanel value={TabId.Personal} className={classes.tabPanel}>
          <Grid container spacing={2} className={classes.root}>
            <Grid item xs={12}>
              <Typography
                variant="h4"
              >
                Change password
              </Typography>
            </Grid>
            <PersonalSettings />
          </Grid>
        </TabPanel>
        {
          // Ah JSX. So "graceful" without "ugly conditionals".
          // Who doesn't want to partake the JSX-JS-JSX club sandwich. Mmmmmhmmm. SCRUMPTIOUS!!!
          showYTDLSettings && (
            <TabPanel value={TabId.YTDL} className={classes.tabPanel}>
              <YTDLSettings />
            </TabPanel>
          )
        }
        {
          showUserSettings && (
            <TabPanel value={TabId.User} className={classes.tabPanel}>
              <UserSettings />
            </TabPanel>
          )
        }
      </TabContext>
    </Box>
  );
};
