/* eslint-disable import/no-default-export */
export default {
  type: "sqlite3",
  database: process.env.NODE_ENV === "production" ? "./db.prod.sqlite3" : "./db.dev.sqlite3",
  entities: ["./src/models/*.ts"],
  synchronize: true,
};
