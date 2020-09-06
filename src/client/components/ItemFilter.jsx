/**
 * Lets you filter downloads by status.
 */
import { changeStatusFilter } from "../redux/actions";
import { getStatusFilterValue } from "../selectors";
import { StatusFilterValue } from "../StatusFilterValue";
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
    changeStatusFilter,
    value,
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
          <Select
            id="statusFilter"
            label="Status"
            labelId="statusFilterLabel"
            onChange={onSelectChange}
            value={value}
          >
            <MenuItem value={StatusFilterValue.All}>All</MenuItem>
            <MenuItem value={StatusFilterValue.Succeeded}>Complete</MenuItem>
            <MenuItem value={StatusFilterValue.Failed}>Failed</MenuItem>
            <MenuItem value={StatusFilterValue.Running}>In Progress</MenuItem>
            <MenuItem value={StatusFilterValue.Pending}>Pending</MenuItem>
          </Select>
        </FormControl>
      </When>
      <Otherwise>
        <ToggleButtonGroup
          aria-label="Download filter"
          exclusive
          onChange={onTogglebuttonChange}
          value={value}
        >
          <ToggleButton
            aria-label="All downloads"
            value={StatusFilterValue.All}
          >
            <Typography>All</Typography>
          </ToggleButton>
          <ToggleButton
            aria-label="Successful downloads"
            value={StatusFilterValue.Succeeded}
          >
            <CheckCircleOutline
              className={classes.icon}
              color="inherit"
            />
            <Typography>Complete</Typography>
          </ToggleButton>
          <ToggleButton
            aria-label="Failed downloads"
            value={StatusFilterValue.Failed}
          >
            <ErrorOutline
              className={classes.icon}
              color="inherit"
            />
            <Typography>Failed</Typography>
          </ToggleButton>
          <ToggleButton
            aria-label="Currently in-progress downloads"
            value={StatusFilterValue.Running}
          >
            <CircularProgress
              className={classes.icon}
              color="inherit"
              size="1.28rem"
              value={50}
              variant="static"
            />
            <Typography>In Progress</Typography>
          </ToggleButton>
          <ToggleButton
            aria-label="Queued downloads"
            value={StatusFilterValue.Pending}
          >
            <HourglassEmptyRounded
              className={classes.icon}
              color="inherit"
              size="1.28rem"
            />
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
