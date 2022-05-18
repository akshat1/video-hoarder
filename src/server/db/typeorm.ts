import { Job } from "../../model/Job";
import { Session } from "../../model/Session";
import { User } from "../../model/User";
import { getLogger } from "../logger";
import { DataSource, DataSourceOptions } from "typeorm";

const rootLogger = getLogger("typeorm");
let dataSource: DataSource;

export const getDataSource = async (): Promise<DataSource> => {
  if (!dataSource) {
    const logger = getLogger("getDataSource", rootLogger);
    const dbOpts:DataSourceOptions = {
      type: "postgres",
      host: "db",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: process.env.NODE_ENV === "production" ? "db_prod" : "db_dev",
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
  await getDataSource();
};
