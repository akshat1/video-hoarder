/**
 * Renders a single download-task, and displays metadata and status of the same.
 * Also provides controls to abort the download.
 */
import { hasStarted, Status } from "../../Status.js";
import CancelButton from "./CancelButton.jsx";
import ItemStatus from "./ItemStatus.jsx";
import { Card, CardContent, CardHeader, CardMedia, Grid, Link,Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import React from "react";

const useStyle = makeStyles(theme => ({
  root: {},

  thumbnail: {
    height: "202px",
    margin: theme.spacing(2)
  },

  url: {},
  meta: {
    marginLeft: theme.spacing(1),
  },

  statusIcon: {
    verticalAlign: "middle",
  }
}));

const Item = (props) => {
  const classes = useStyle();
  const { item } = props;
  const {
    description,
    status,
    thumbnail,
    title,
    url,
    updatedAt,
  } = item;
  const dtUpdatedAt = new Date(updatedAt);
  const mediaTitle = `${title} thumbnail`;

  return (
    <Card raised className={classes.root}>
      <Grid container>
        <Grid item xs={12} sm={2}>
          <CardMedia
            image={thumbnail}
            title={mediaTitle}
            className={classes.thumbnail}
          />
        </Grid>
        <Grid item xs={12} sm={10}>
          <CardHeader
            title={title}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography className={classes.description}>{description}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography className={classes.url}>
                  <Link href={url}>{url}</Link>
                </Typography>
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
                <CancelButton item={item}/>
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

Item.propTypes = {
  item: PropTypes.shape({
    addedAt: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
};

export default Item;
