import "../loadEnvironment";
import Debug from "debug";
import mongoose from "mongoose";
import chalk from "chalk";

const debug = Debug("database:index");

const connectDB = (mongoUrl: string) =>
  new Promise((resolve, reject) => {
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        const newDocument = { ...ret };

        // eslint-disable-next-line no-underscore-dangle
        delete newDocument.__v;
        // eslint-disable-next-line no-underscore-dangle
        delete newDocument._id;
        delete newDocument.password;

        return newDocument;
      },
    });

    mongoose.connect(mongoUrl, (error) => {
      if (error) {
        debug(
          chalk.bgRed.white(
            "An error occurred connecting with database",
            error.message
          )
        );
        reject(error);
        return;
      }

      debug(chalk.bgBlue.white("Successfully connected with database"));
      resolve(true);
    });
  });

export default connectDB;
