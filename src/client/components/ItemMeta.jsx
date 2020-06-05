import { ItemShape } from "../../model/Item.js";
import { hasStarted, Status } from "../../Status.js";
import ItemStatus from "./ItemStatus.jsx";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { Fragment } from "react";

const useStyle = makeStyles(theme => ({
  meta: {
    marginLeft: theme.spacing(1),
  },

  statusIcon: {
    verticalAlign: "middle",
  },
}));

const ItemMeta = (props) => {
  const classes = useStyle();
  const { item } = props;
  const {
    status,
    updatedAt,
  } = item;
  const dtUpdatedAt = new Date(updatedAt);

  return (
    <Fragment>
      <ItemStatus status={status} className={classes.statusIcon}/>
        <Choose>
          <When condition={hasStarted(status)}>
            <Typography display="inline" className={classes.meta}>
              <Choose>
                <When condition={status === Status.Failed}>Failed</When>
                <When condition={status === Status.Paused}>Paused</When>
                <When condition={status === Status.Running}>Updated</When>
                <When condition={status === Status.Succeeded}>Completed</When>
              </Choose>
              {` at ${dtUpdatedAt.toLocaleTimeString()} on ${dtUpdatedAt.toLocaleDateString()}`}
            </Typography>
          </When>
          <Otherwise>
            <Typography display="inline" className={classes.meta}>
              {`Queued at ${dtUpdatedAt.toLocaleTimeString()} on ${dtUpdatedAt.toLocaleDateString()}`}
            </Typography>
          </Otherwise>
        </Choose>
    </Fragment>
  );
};

ItemMeta.propTypes = {
  item: ItemShape,
};

export default ItemMeta;