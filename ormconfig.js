/* eslint-disable import/no-default-export */
module.exports = {
  type: "better-sqlite3",
  database: process.env.NODE_ENV === "production" ? "./db.prod.sqlite3" : "./db.dev.sqlite3",
  entities: ["./src/model/*.ts"],
  synchronize: true,
  subscribers: [
    "./src/model-subscribers/*.ts",
  ],
};
