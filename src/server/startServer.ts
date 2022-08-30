import Debug from "debug";
import chalk from "chalk";
import app from "./index";
import CustomError from "../utils/CustomError/CustomError";

const debug = Debug("server:startServer");

const startServer = (port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.bgGreen.white(`Server listening on port ${port}`));
      resolve(true);
    });

    server.on("error", (error: CustomError) => {
      debug(chalk.bgRed.white("Error when starting the server"));
      if (error.code === "EADDRINUSE") {
        debug(chalk.bgRed.white(`Port ${port} is in use`));
      }
      reject(error);
    });
  });

export default startServer;
