import * as db from './db/index.js';
import { emit } from './event-bus.js';
import { Event } from '../Event.js';
import { getLogger } from '../logger.js';
import express from 'express';
import connectEnsureLogin from 'connect-ensure-login';

const { ensureLoggedIn } = connectEnsureLogin;
const rootLogger = getLogger('api');
const { Router } = express;

/**
 * @func
 * @param {Request} req 
 * @param {Response} res 
 */
export const getJobs = async (req, res, next) => {
  const logger = getLogger('getJobs', rootLogger);
  // @todo avoid dupes.
  try {
    const {
      query = {},
      pagination = {},
      sort,
    } = req.body;
    const { userName } = req.user;
    const cursor = await db.getJobsForUser(userName, query);
    if (sort) {
      logger.debug(sort);
      await db.sort(cursor, sort);
    }

    if (pagination) {
      logger.debug(pagination);
      const {
        skip,
        limit,
      } = pagination;

      if (skip) {
        await db.skip(cursor, skip);
      }

      if (limit) {
        await db.limit(cursor, limit);
      }
    }

    const count = await db.count(cursor);
    const data = await db.toArray(cursor);
    const responseData = {
      count,
      data,
    };
    logger.debug('send 200', responseData);
    res.status(200).send(responseData);
  } catch(err) {
    res.status(500);
    next(err);
  }
};

/**
 * @func
 * @param {Request} req
 * @param {Response} res
 */
export const addJob = async (req, res, next) => {
  const logger = getLogger('addJob', rootLogger);
  try {
    const { userName: addedBy } = req.user;
    const { url } = req.body;
    logger.debug('Adding new job', url);
    const newJob = await db.addJob({ url, userName: addedBy });
    // We emit an event (which will eventually be emitted on the socket) so that ALL Clients know a new item has been added.
    emit(Event.ItemAdded, newJob);
    logger.debug('send 200');
    res.status(200).send('OK');
  } catch (err) {
    res.status(500);
    next(err);
  }
};

export const getRouter = () => {
  const router = new Router();
  router.get('/jobs', ensureLoggedIn(), getJobs);
  router.post('/job/add', ensureLoggedIn(), addJob);
};
