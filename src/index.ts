import "./loadEnvironment";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import connectDB from "./database";
import startServer from "./server/startServer";
import { notFoundError, generalError } from "./utils/errors/errors";
import usersRouter from "./server/routers/usersRouter";
import app from "./server";

const port = +process.env.PORT || 3100;

const mongoURL = process.env.MONGODB_URL;

(async () => {
  try {
    await connectDB(mongoURL);
    await startServer(port);
  } catch (error) {
    process.exit(1);
  }
})();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouter);

app.use(notFoundError);
app.use(generalError);
