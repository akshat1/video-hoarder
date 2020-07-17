import path from "path";


export const serveWebManifest = async (req, res, next) => {
  try {
    return res.sendFile(
      path.resolve(process.cwd(), "./dist/app.webmanifest"),
      err => err && res.status(500).send(err),
    );
  } catch (error) {
    next(error);
  }
};
