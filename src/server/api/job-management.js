import { getLogger } from "../../logger";
import { isAdmin } from "../../model/User";
import * as db from "../db/index";
import { ensureValidUser } from "../express-middleware/index";
import express from "express";

const rootLogger = getLogger("api/job-management");

const DefaultSort = [["updatedAt", -1]];

/**
 * @func
 * @param {Request} req 
 * @param {Response} res 
 */
export const getJobs = async (req, res, next) => {
  const logger = getLogger("getJobs", rootLogger);
  // @todo avoid dupes.
  try {
    logger.debug(req.body);
    const { body, user } = req;
    const {
      query = {},
      pagination = {},
      sort = DefaultSort,
    } = body;
    const { userName } = user;

    let cursor;
    if (isAdmin(user)) {
      cursor = await db.getJobs(query);
    } else {
      cursor = await db.getJobsForUser(userName, query);
    }

    if (sort) {
      await db.sort(cursor, sort);
    }

    if (pagination) {
      const {
        limit,
        skip,
      } = pagination;

      if (skip) {
        await db.skip(cursor, skip);
      }

      if (limit) {
        await db.limit(cursor, limit);
      }
    }

    const data = await db.toArray(cursor);
    // count() closes the cursor. Always make to call it _after_ toArray (which fails if the cursor is closed).
    const count = await db.count(cursor);
    const responseData = {
      count,
      data,
    };
    logger.debug("send 200", responseData);
    res.status(200).send(responseData);
  } catch(err) {
    res.status(500).send("SERVER ERROR");
    next(err);
  }
};

/**
 * @func
 * @param {Request} req
 * @param {Response} res
 */
export const addJob = async (req, res, next) => {
  const logger = getLogger("addJob", rootLogger);
  try {
    const { userName: addedBy } = req.user;
    const { url } = req.body;
    logger.debug("Adding new job", url, addedBy);
    const newJob = await db.addJob({ url, addedBy });
    logger.debug("send 200");
    res.status(200).send(newJob);
  } catch (err) {
    logger.error(err);
    res.status(500).send("SERVER ERROR");
    next(err);
  }
};

/**
 * @func
 * @param {Request} req 
 * @param {Response} res 
 * @param {func} next
 */
export const stopJob = async (req, res, next) => {
  const logger = getLogger("stopJob", rootLogger);
  try {
    const { userName: updatedBy } = req.user;
    const { itemId: id } = req.body;
    logger.debug("stopping job", id, updatedBy);
    await db.cancelJob({ id, updatedBy });
    logger.debug("send 200");
    res.status(200).send("OK");
  } catch (err) {
    logger.error(err);
    res.status(500).send("SERVER ERROR");
    next(err);
  }
};

/**
 * @func
 * @param {Request} req 
 * @param {Response} res 
 * @param {func} next
 */
export const deleteJob = async (req, res, next) => {
  const logger = getLogger("deleteJob", rootLogger);
  try {
    const { itemId: id } = req.body;
    logger.debug("Deleting job", id);
    await db.removeJob(id);
    logger.debug("send 200");
    res.status(200).send("OK");
  } catch (err) {
    logger.error(err);
    res.status(500).send("SERVER ERROR");
    next(err);
  }
};

/**
 * @func
 * @returns {Router}
 */
export const getRouter = () => {
  const jobs = new express.Router();
  jobs.use(ensureValidUser);
  jobs.post("/jobs", getJobs);
  jobs.post("/job/add", addJob);
  jobs.post("/job/stop", stopJob);
  jobs.post("/job/delete", deleteJob);
  return jobs;
};
