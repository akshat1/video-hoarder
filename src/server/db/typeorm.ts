import { Job } from "../../model/Job";
import { Preset } from "../../model/Preset";
import { PresetMatchRule } from "../../model/PresetMatchRule";
import { Role } from "../../model/Role";
import { Session } from "../../model/Session";
import { User } from "../../model/User";
import { getLogger } from "../../shared/logger";
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
      entities: [Job, User, Session, Preset, PresetMatchRule],
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

export const ensureUsers = async (): Promise<void> => {
  const logger = getLogger("ensureUsers", rootLogger);
  logger.debug("do we have an admin?");
  const adminUser = await getUserByName("admin");
  if (adminUser) 
    logger.debug("Yes");
   else {
    logger.info("No. Create an admin user.");
    await createUser({
      passwordExpired: false,
      password: "admin",
      userName: "admin",
      role: Role.Admin,
    }, "System");
  }
};

const eapLogger = getLogger("ensureAPreset", rootLogger);
export const ensureAPreset = async (presetName: string, presetStub: Partial<Preset>): Promise<void> => {
  if (!(await Preset.find({ where: { name: presetName }}))) {
    eapLogger.debug("Create preset", presetName);
    await Preset.create(presetStub);
    eapLogger.debug("done");
  }
};

const expectedPresets: Partial<Preset>[] = [
  {
    name: "Best AV - Generic",
    formatSelector: "bestvideo+bestaudio/best",
  },
];
export const ensurePresets = async (): Promise<void> => {
  const logger = getLogger("ensurePresets", rootLogger);
  logger.debug("do we have a best/best?");
  for (const preset of expectedPresets)
    await ensureAPreset(preset.name, preset);
};

export const initialize = async (): Promise<void> => {
  // const logger = getLogger("initialize", rootLogger);
  await getDataSource();
  await ensureUsers();
  await ensurePresets();
};
