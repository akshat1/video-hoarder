/**
 * Lets you filter downloads by status.
 */
import { changeStatusFilter } from "../redux/actions";
import { getStatusFilterValue } from "../selectors.js";
import { StatusFilterValue } from "../StatusFilterValue.js";
import { CircularProgress, FormControl,InputLabel, MenuItem, Select, Typography, useMediaQuery } from "@material-ui/core";
import { CheckCircleOutline, ErrorOutline, HourglassEmptyRounded } from "@material-ui/icons";
import { ToggleButton,ToggleButtonGroup } from "@material-ui/lab";
import { makeStyles, useTheme } from "@material-ui/styles";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => {
  return {
    icon: {
      marginRight: theme.spacing(1),
    },
  };
});

const Itemfilter = (props) => {
  const classes = useStyles();
  const {
    value,
    changeStatusFilter,
  } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const onSelectChange = (event) => changeStatusFilter(event.target.value);
  const onTogglebuttonChange = (event, value) => changeStatusFilter(value);

  return (
    <Choose>
      <When condition={isMobile}>
        <FormControl variant="outlined">
          <InputLabel id="statusFilterLabel">Status</InputLabel>
          <Select labelId="statusFilterLabel" id="statusFilter" value={value} onChange={onSelectChange} label="Status">
            <MenuItem value={StatusFilterValue.All}>All</MenuItem>
            <MenuItem value={StatusFilterValue.Succeeded}>Complete</MenuItem>
            <MenuItem value={StatusFilterValue.Failed}>Failed</MenuItem>
            <MenuItem value={StatusFilterValue.Running}>In Progress</MenuItem>
            <MenuItem value={StatusFilterValue.Pending}>Pending</MenuItem>
          </Select>
        </FormControl>
      </When>
      <Otherwise>
        <ToggleButtonGroup value={value} onChange={onTogglebuttonChange} aria-label="Download filter" exclusive>
          <ToggleButton value={StatusFilterValue.All} aria-label="All downloads">
            <Typography>All</Typography>
          </ToggleButton>
          <ToggleButton value={StatusFilterValue.Succeeded} aria-label="Successful downloads">
            <CheckCircleOutline color="inherit" className={classes.icon} />
            <Typography>Complete</Typography>
          </ToggleButton>
          <ToggleButton value={StatusFilterValue.Failed} aria-label="Failed downloads">
            <ErrorOutline color="inherit" className={classes.icon} />
            <Typography>Failed</Typography>
          </ToggleButton>
          <ToggleButton value={StatusFilterValue.Running} aria-label="Currently in-progress downloads">
            <CircularProgress color="inherit" size="1.28rem" variant="static" value={50} className={classes.icon} />
            <Typography>In Progress</Typography>
          </ToggleButton>
          <ToggleButton value={StatusFilterValue.Pending} aria-label="Queued downloads">
            <HourglassEmptyRounded color="inherit" size="1.28rem" className={classes.icon} />
            <Typography>Queued</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Otherwise>
    </Choose>
  );
};

Itemfilter.propTypes = {
  changeStatusFilter: PropTypes.func,
  value: PropTypes.string,
};

const stateToProps = state => ({ value: getStatusFilterValue(state) });
const dispatchToProps = {
  changeStatusFilter,
};

export default connect(stateToProps, dispatchToProps)(Itemfilter);
