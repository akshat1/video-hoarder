import { getRouter as getJobsAPI } from "./job-management";
import { getRouter as getUserAPI } from "./user-management";
import { getRouter as getYTDLApi } from "./ytdl";
import express, { Router } from "express";

export const getRouter = (passport):Router => {
  const router = Router();

  router.use(getUserAPI(passport));
  router.use(getJobsAPI());
  router.use("/youtube-dl", getYTDLApi());
  return router;
};
