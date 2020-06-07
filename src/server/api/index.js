import { getRouter as getJobsAPI } from "./job-management.js";
import { getRouter as getUserAPI } from "./user-management.js";
import express from "express";

const { Router } = express;

export const getRouter = (passport) => {
  const router = new Router();

  router.use(getUserAPI(passport));
  router.use(getJobsAPI());
  return router;
};
