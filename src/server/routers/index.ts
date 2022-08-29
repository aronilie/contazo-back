import express from "express";
import cors from "cors";
import morgan from "morgan";
import { notFoundError, generalError } from "../../utils/errors";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(notFoundError);
app.use(generalError);

export default app;
