import { getRouter as getJobsAPI } from "./job-management";
import { getRouter as getUserAPI } from "./user-management";
import { getRouter as getYTDLApi } from "./ytdl";
import { getRouter as getConfigManagamentAPI } from "./config-management";
import { Router } from "express";
import { PassportStatic } from "passport";

export const getRouter = (passport: PassportStatic):Router => {
  const router = Router();

  router.use(getUserAPI(passport));
  router.use(getJobsAPI());
  router.use("/youtube-dl", getYTDLApi());
  router.use("/config-management", getConfigManagamentAPI());
  return router;
};
