import express from "express";
import cors from "cors";
import morgan from "morgan";
import notFoundError from "../../utils/errors";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(notFoundError);

export default app;
