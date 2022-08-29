import "../loadEnvironment";
import Debug from "debug";
import chalk from "chalk";
import { NextFunction, Request, Response } from "express";
import CustomError from "./CustomError";

const debug = Debug("utils:errors");

export const notFoundError = (req: Request, res: Response) => {
  res.status(404).json({ error: "Oops! Page not found :(" });
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const errorCode = error.statusCode ?? 500;
  const errorMessage = error.publicMessage ?? "Something went wrong :(";

  debug(chalk.bgRed.white(error.message));

  res.status(errorCode).json({ error: errorMessage });
};
