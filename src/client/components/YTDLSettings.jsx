import { isAdmin } from "../../model/User";
import { doUpdateYTDLGlobalConfig,doYTDLUpgrade, fetchYTDLInfo } from "../redux/actions";
import { getUser,getYTDLBinaryPath, getYTDLBinaryVersion, getYTDLGlobalConfig,isFetchingYTDLInfo } from "../selectors";
import ConfigurationEditor from "./ConfigurationEditor.jsx";
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "inline-grid",
    gridTemplateColumns: "auto auto",
    columnGap: `${theme.spacing(2)}px`,
    rowGap: `${theme.spacing(2)}px`,
    paddingTop: theme.spacing(2),
  },
  label: {},
  value: {},
}));

const YTDLSettings = (props) => {
  const classes = useStyles();
  const {
    binaryPath,
    binaryVersion,
    isAdmin,
    doSaveYTDLGlobalConfig,
    doUpgrade,
    fetchInfo,
    isBusy,
    ytdlGlobalConfig,
  } = props;

  useEffect(() => {
    fetchInfo();
  }, []);

  const [ytdlConfigEditorOpen, setYtdlConfigEditorOpen] = useState(false);
  const openYTDLGlobalConfigEditor = () => setYtdlConfigEditorOpen(true);
  const closeYTDLGlobalConfigEditor = () => setYtdlConfigEditorOpen(false);
  const onGlobalConfigSave = (newConfiguration) => {
    closeYTDLGlobalConfigEditor();
    doSaveYTDLGlobalConfig(newConfiguration);
  };

  return (
    <div className={classes.root}>
      <div className={classes.label}>
        <Typography>Executable path</Typography>
      </div>
      <div className={classes.value}>
        <Typography>{binaryPath}</Typography>
      </div>
      <div className={classes.label}>
        <Typography>Executable version</Typography>
      </div>
      <div className={classes.value}>
        <Typography>{binaryVersion}</Typography>
      </div>
      <If condition={isAdmin}>
        <div className={classes.label}></div>
        <div className={classes.value}>
          <Button variant="contained" onClick={doUpgrade} disabled={isBusy}>Upgrade to latest version</Button>
        </div>
      </If>
      <If condition={isAdmin}>
        <div className={classes.label}></div>
        <div className={classes.value}>
          <Button variant="contained" onClick={openYTDLGlobalConfigEditor} disabled={isBusy}>Edit youtube-dl global config</Button>
          <If condition={ytdlConfigEditorOpen}>
            <ConfigurationEditor
              configText={ytdlGlobalConfig}
              onCancel={closeYTDLGlobalConfigEditor}
              doSave={onGlobalConfigSave}
              open
            />
          </If>
        </div>
      </If>
    </div>
  );
};


YTDLSettings.propTypes = {
  binaryPath: PropTypes.string,
  binaryVersion: PropTypes.string,
  isAdmin: PropTypes.bool,
  doSaveYTDLGlobalConfig: PropTypes.func,
  doUpgrade: PropTypes.func,
  fetchInfo: PropTypes.func,
  isBusy: PropTypes.bool,
  ytdlGlobalConfig: PropTypes.string,
};

const mapStateToProps = state => ({
  binaryPath: getYTDLBinaryPath(state),
  binaryVersion: getYTDLBinaryVersion(state),
  isAdmin: isAdmin(getUser(state)),
  isBusy: isFetchingYTDLInfo(state),
  ytdlGlobalConfig: getYTDLGlobalConfig(state),
});

const mapDispatchToProps = {
  doUpgrade: doYTDLUpgrade,
  fetchInfo: fetchYTDLInfo,
  doSaveYTDLGlobalConfig: doUpdateYTDLGlobalConfig,
};

export default connect(mapStateToProps, mapDispatchToProps)(YTDLSettings);
