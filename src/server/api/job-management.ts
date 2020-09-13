import { getLogger } from "../../logger";
import { isAdmin, ServerUser } from "../../model/User";
import * as db from "../db/index";
import { ensureValidUser } from "../express-middleware/index";
import express, { NextFunction, Request, Response, Router } from "express";

const rootLogger = getLogger("api/job-management");

const DefaultSort = [["updatedAt", -1]];

export const getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const logger = getLogger("getJobs", rootLogger);
  // @todo avoid dupes.
  try {
    logger.debug(req.body);
    const { body } = req;
    // @ts-ignore
    const user: ServerUser = req.user;
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
    const count = await db.count(cursor, false);
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

export const addJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const logger = getLogger("addJob", rootLogger);
  try {
    // @ts-ignore
    const user:ServerUser = req.user;
    const { userName: createdBy } = user;
    const { url } = req.body;
    logger.debug("Adding new job", url, createdBy);
    const newJob = await db.addJob({ url, createdBy });
    logger.debug("send 200");
    res.status(200).send(newJob);
  } catch (err) {
    logger.error(err);
    res.status(500).send("SERVER ERROR");
    next(err);
  }
};

export const stopJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const logger = getLogger("stopJob", rootLogger);
  try {
    // @ts-ignore
    const user:ServerUser = req.user;
    const { userName: updatedBy } = user;
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

export const deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

export const getRouter = (): Router => {
  const jobs = express.Router();
  jobs.use(ensureValidUser);
  jobs.post("/jobs", getJobs);
  jobs.post("/job/add", addJob);
  jobs.post("/job/stop", stopJob);
  jobs.post("/job/delete", deleteJob);
  return jobs;
};
