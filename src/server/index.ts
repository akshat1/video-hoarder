import { Role } from "../model/Role";
import { createUser, getUserByName } from "./db/userManagement";
import { getApolloServer } from "./graphql";
import { hookupApp } from "./passport";
import cors from "cors";
import express, { Request, Response } from "express";
import session from "express-session";
import path from "path";
import { env } from "process";
import { createConnection } from "typeorm";
import { v4 as uuid } from "uuid";

const SessionSecret = "Not so secretely bad secret";
const Config = {
  webUIPath: process.env.NODE_ENV === "production" ? "./app/client" : "./src/client",
  port: process.env.SERVER_PORT || 8081,
};

/** Exit handler. */
const onExit = () => {
  // TODO Clean-up
  console.log("Server process exit.");
};

const main = async () => {
  console.log("Starting server process.");
  process.on("exit", onExit);

  // DB
  console.log("create connection");
  await createConnection();
  console.log("do we have an admin?");
  const adminUser = await getUserByName("admin");
  if (!adminUser) {
    console.log("create an admin?");
    await createUser({
      passwordExpired: false,
      password: "admin",
      userName: "admin",
      role: Role.Admin,
    }, "System");
  }

  // Create the express server
  const app = express();

  const enableStudio = !!env.ENABLE_STUDIO;
  console.log(`enableStudio: ${enableStudio}`);
  if (!enableStudio) {
    app.use(cors({
      origin: "http://localhost:8080",
      credentials: true,
    }));
  }
  app.use(session({
    genid: () => uuid(),
    secret: SessionSecret,
    resave: false,
    saveUninitialized: false,
  }));
  await hookupApp(app);

  // Set-up apollo server
  const apolloServer = await getApolloServer();
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: enableStudio,
  });

  // Web
  const webUIPath = path.resolve(process.cwd(), Config.webUIPath);
  const spaFallbackPath = path.join(webUIPath, "index.html");
  console.log(`CWD: ${process.cwd()}`);
  console.log(`Going to serve static files from ${webUIPath}`);
  console.log(`SPA fallback path: ${spaFallbackPath}`);
  app.use(express.static(webUIPath));
  // Web: SPA Fallback
  app.use((request:Request, response: Response) => {
    if (request.method === "GET") {
      response.sendFile(spaFallbackPath);
    } else {
      response.status(404).send({ message: "NOT FOUND" });
    }
  });

  // Start the server
  app.listen({ port: Config.port }, () => console.log("Listening now."));
  console.log(`🚀 Server ready at http://localhost:${Config.port}${apolloServer.graphqlPath}`);
};

main();
