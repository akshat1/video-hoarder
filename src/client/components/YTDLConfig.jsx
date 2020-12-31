import { getUser,getYTDLBinaryPath, getYTDLBinaryVersion, getYTDLGlobalConfig,isFetchingYTDLInfo } from "../selectors";
import ConfigurationEditor from "./ConfigurationEditor";
import { makeStyles,useTheme } from "./mui";
import React from "react";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
  },
}));

const YTDLConfigSettings = (props) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <div className={classes.root}>
      <ConfigurationEditor
        configText={props.ytdlGlobalConfig}
        doSave={() => Promise.resolve()}
        onCancel={() => 0}
        open
      />
    </div>
  );
};

const mapStateToProps = state => ({
  ytdlGlobalConfig: getYTDLGlobalConfig(state),
});

export default connect(mapStateToProps)(YTDLConfigSettings);
