/**
 * Renders an icon appropriate to the given item status.
 */
import { Status } from "../../Status";
import { CircularProgress, colors } from "@material-ui/core";
import { CheckCircleOutline, ErrorOutline, WarningOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import React from "react";

const useStyle = makeStyles((theme) => {
  return {
    [Status.Failed]: {
      color: theme.palette.success.main,
    },
    [Status.Pending]: {
      color: colors.amber[500],
    },
    [Status.Running]: {
      color: theme.palette.success.main,
    },
    [Status.Succeeded]: {
      color: theme.palette.success.main,
    },
    "unknown": { color: theme.palette.info.main },
  };
});

const ItemStatus = ({ status, className }) => {
  const classes = useStyle();

  return (
    <span className={`${className} ${classes[status] || classes.unknown}`}>
      <Choose>
        <When condition={status === Status.Failed}>
          <ErrorOutline color="inherit"/>
        </When>
        <When condition={status === Status.Pending}>
          <CircularProgress color="inherit" size="1.28rem" />
        </When>
        <When condition={status === Status.Running}>
          <CircularProgress color="inherit" size="1.28rem"/>
        </When>
        <When condition={status === Status.Succeeded}>
          <CheckCircleOutline color="inherit"/>
        </When>
        <Otherwise>
          <WarningOutlined color="inherit"/>
        </Otherwise>
      </Choose>
    </span>
  );
};

ItemStatus.propTypes = {
  className: PropTypes.string,
  status: PropTypes.oneOf(Object.values(Status)),
};

export default ItemStatus;

// color={colors.amber[500]}
// color={colors.blue[500]}
