import { Job } from "../../model/Job";
import { Role } from "../../model/Role";
import { Session } from "../../model/Session";
import { User } from "../../model/User";
import { getLogger } from "../logger";
import { createUser, getUserByName } from "./userManagement";
import pgtools from "pgtools";
import { DataSource, DataSourceOptions } from "typeorm";

const rootLogger = getLogger("typeorm");
let dataSource: DataSource;
const {
  DB_NAME = process.env.NODE_ENV === "development" ? "vh_dev" : "video-hoarder",
  PG_HOST,
  PG_PASSWORD,
  PG_PORT,
  PG_USER,
} = process.env;

const ensureDBInit = async () => {
  const logger = getLogger("ensureDBInit", rootLogger);
  const opts = {
    user: PG_USER,
    host: PG_HOST,
    password: PG_PASSWORD,
    port: Number(PG_PORT),
  };
  logger.debug("opts:", opts);
  try {
    logger.debug("Create DB?");
    await pgtools.createdb(opts, DB_NAME);
    logger.debug("No Error");
  } catch (err) {
    if (err.name !=="duplicate_database") {
      logger.error("Error creating database.");
      logger.error(err);
      logger.debug("resolve anyway.");
    }
  }
  logger.debug("Done");
};

export const getDataSource = async (): Promise<DataSource> => {
  if (!dataSource) {
    const logger = getLogger("getDataSource", rootLogger);
    logger.debug("Call ensureDBInit");
    await ensureDBInit();
    logger.debug("Proceeding further");
    const dbOpts:DataSourceOptions = {
      type: "postgres",
      host: PG_HOST,
      port: Number(PG_PORT),
      username: PG_USER,
      password: PG_PASSWORD,
      database: DB_NAME,
      entities: [Job, User, Session],
      synchronize: true,
      logging: false,
    };
    dataSource = new DataSource(dbOpts);

    logger.debug("Initializing data source...");
    await dataSource.initialize();
    logger.debug("Done");
  }

  return dataSource;
}

export const initialize = async (): Promise<void> => {
  const logger = getLogger("initialize", rootLogger);
  await getDataSource();
  logger.debug("do we have an admin?");
  const adminUser = await getUserByName("admin");
  if (adminUser) {
    logger.debug("Yes");
  } else {
    logger.info("No. Create an admin user.");
    await createUser({
      passwordExpired: false,
      password: "admin",
      userName: "admin",
      role: Role.Admin,
    }, "System");
  }
};