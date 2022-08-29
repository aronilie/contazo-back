import "../loadEnvironment";
import { Request, Response } from "express";

const notFoundError = (req: Request, res: Response) => {
  res.status(404).json({ error: "Oops! Page not found :(" });
};

export default notFoundError;
