import { Role } from "../model/Role";
import { User } from "../model/User";
import { createUser, getUserByName } from "./db/userManagement";
import { resolvers } from "./graphql/resolvers";
import { deserializeUser, serializeUser, verifyUser } from "./passport";
import { getPubSub } from "./pubsub";
import { pickUpPendingJobs } from "./YTQueue";
import { ApolloServer } from "apollo-server-express";
import SQLiteStoreFactory from "connect-sqlite3";
import cors from "cors";
import express, { Request, RequestHandler, Response } from "express";
import session from "express-session";
import { execute, subscribe } from "graphql";
import { GraphQLLocalStrategy } from "graphql-passport";
import { buildContext, createOnConnect } from "graphql-passport";
import { createServer } from "http";
import passport from "passport";
import path from "path";
import { env } from "process";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { buildSchema } from "type-graphql";
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
  const server = createServer(app);

  // We need our own CORS config when we are serving the FE. But we want Apollo to handle CORS when we are talking to the studio.
  const enableStudio = !!env.ENABLE_STUDIO;
  console.log(`enableStudio: ${enableStudio}`);
  if (!enableStudio) {
    app.use(cors({
      origin: "http://localhost:8080",
      credentials: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }));
  }

  // Session management
  const SQLiteStore = SQLiteStoreFactory(session);
  const store = new SQLiteStore({
    db: process.env.NODE_ENV === "production" ? "./db.prod.sqlite3" : "./db.dev.sqlite3",
  });
  const sessionMiddleware: RequestHandler = session({
    genid: () => uuid(),
    secret: SessionSecret,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: false,
    }, // 1 week
  });

  // Passport
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
  passport.use(new GraphQLLocalStrategy(verifyUser));
  const passportMiddleware = passport.initialize();
  const passportSessionMiddleware = passport.session();
  app.use(sessionMiddleware);
  app.use(passportMiddleware);
  app.use(passportSessionMiddleware);

  // Set-up apollo server
  const schema = await buildSchema({
    resolvers,
    pubSub: getPubSub(),
  });
  // eslint-disable-next-line prefer-const
  let subscriptionServer;
  
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => buildContext({ req, res, User }),
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
          subscriptionServer.close();
          },
        };
      },
    }],
  });

  subscriptionServer = SubscriptionServer.create({
    schema,
    execute,
    subscribe,
    onConnect: createOnConnect([
      sessionMiddleware,
      passportMiddleware,
      passportSessionMiddleware,
    ]),
  }, {
    server,
    path: apolloServer.graphqlPath,
  });
  
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
  // app.listen({ port: Config.port }, () => console.log("Listening now."));
  server.listen(Config.port, () => console.log("Listening now."));
  console.log(`🚀 Server ready at http://localhost:${Config.port}${apolloServer.graphqlPath}`);

  // Add any pending jobs to the queue.
  await pickUpPendingJobs();
};

main();
