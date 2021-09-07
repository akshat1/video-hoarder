import { getApolloServer } from "./graphql";
import express, { Request, Response } from "express";
import path from "path";

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

  // Create the express server
  const app = express();

  // Set-up apollo server
  const apolloServer = await getApolloServer();
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

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
