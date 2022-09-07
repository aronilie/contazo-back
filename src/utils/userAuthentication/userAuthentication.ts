import { NextFunction, Response } from "express";
import { CustomRequest } from "../../interfaces/JwTPayload";
import { verifyToken } from "../auth/auth";
import CustomError from "../CustomError/CustomError";

const userAuthentication = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const customError = new CustomError(
    400,
    "Bad request",
    "User sends bad login"
  );

  const requestAuthentification = req.get("Authorization");

  if (
    !requestAuthentification ||
    !requestAuthentification.startsWith("Bearer ")
  ) {
    next(customError);
    return;
  }

  const token = requestAuthentification.slice(7);
  const userToken = verifyToken(token);

  if (typeof userToken === "string") {
    next(customError);
    return;
  }

  req.payload = userToken;
  next();
};

export default userAuthentication;
