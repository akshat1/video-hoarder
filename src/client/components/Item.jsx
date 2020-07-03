/**
 * Renders a single download-task, and displays metadata and status of the same.
 * Also provides controls to abort the download.
 */
import { getDescription, getThumbnail, getTitle, ItemShape } from "../../model/Item.js";
import CancelButton from "./CancelButton.jsx";
import ItemMeta from "./ItemMeta.jsx";
import { Button, Collapse, Grid, Link, Typography, useMediaQuery } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles, useTheme } from "@material-ui/styles";
import ANSIToHTML from "ansi-to-html";
import classnames from "classnames";
import React from "react";

const convert = new ANSIToHTML({
  newline: true,
});

const useStyle = makeStyles(theme => {
  return {
    root: {},

    thumbnail: {
      width: "100%",
    },

    expandIcon: {
      transform: "rotate(0deg)",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },

    expandOpen: {
      transform: "rotate(180deg)",
    },

    title: {
      fontSize: "1.25em",
      [theme.breakpoints.up("md")]: {
        fontSize: "2em",
      },
    },
    url: {},
    cancelButton: {
      marginTop: theme.spacing(2),
      [theme.breakpoints.down("xs")]: {
        float: "right",
      },
    },
    description: {
      marginBottom: theme.spacing(2),
    },
  };
});

const Item = (props) => {
  const classes = useStyle();
  const { item } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { url } = item;
  const title = getTitle(item);
  const thumbnail = getThumbnail(item);
  const mediaTitle = `${title} thumbnail`;
  const expandIcon = (
    <ExpandMoreIcon
      className={classnames(classes.expandIcon, {
        [classes.expandOpen]: expanded,
      })}
    />
  );

  return (
    <Grid
      className={classes.root}
      container
      spacing={1}
    >
      <Grid
        item
        md={2}
        xs={4}
      >
        <img
          className={classes.thumbnail}
          src={thumbnail}
          title={mediaTitle}
        />
      </Grid>
      <Grid
        item
        md={10}
        xs={8}
      >
        <Typography
          className={classes.title}
          variant="h2"
        >{title}
        </Typography>
        <If condition={!isMobile}>
          <ItemMeta item={item} />
          <Typography className={classes.url}>
            <Link href={url}>{url}</Link>
          </Typography>
          <CancelButton
            className={classes.cancelButton}
            item={item}
          />
        </If>
      </Grid>
      <If condition={isMobile}>
        <Grid
          item
          xs={12}
        >
          <ItemMeta item={item} />
        </Grid>
        <Grid
          item
          xs={12}
        >
          <CancelButton
            className={classes.cancelButton}
            item={item}
          />
        </Grid>
      </If>
      <Grid
        item
        xs={12}
      >
        <Button
          aria-expanded={expanded}
          aria-label="show more"
          className={classes.expand}
          endIcon={expandIcon}
          onClick={handleExpandClick}
        >
          <Typography
            className={classes.descriptionLabel}
            component="span"
          >Description
          </Typography>
        </Button>
        <Collapse
          in={expanded}
          unmountOnExit
        >
          <If condition={isMobile}>
            <Typography className={classes.url}>
              <Link href={url}>{url}</Link>
            </Typography>
          </If>
          <If condition={getDescription(item)}>
            <Typography
              className={classes.description}
              dangerouslySetInnerHTML={{ __html: convert.toHtml(getDescription(item)) }}
            />
          </If>
        </Collapse>
      </Grid>
    </Grid>
  );
};

Item.propTypes = {
  item: ItemShape,
};

export default Item;
