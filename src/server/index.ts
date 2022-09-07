import cors from "cors";
import morgan from "morgan";
import express from "express";
import { notFoundError, generalError } from "../utils/errors/errors";
import usersRouter from "./routers/usersRouter/usersRouter";
import contactsRouter from "./routers/contactsRouter/contactsRouter";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouter);
app.use("/", contactsRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
