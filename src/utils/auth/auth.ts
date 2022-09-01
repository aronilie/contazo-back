import "../../loadEnvironment";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JwtPayload } from "../../interfaces/JwTPayload";

export const hashCreator = (text: string) => {
  const salt = 10;
  return bcrypt.hash(text, salt);
};

export const hashCompare = (firstHash: string, secondHash: string) =>
  bcrypt.compare(firstHash, secondHash);

export const createToken = (payload: JwtPayload) =>
  jwt.sign(payload, process.env.SECRET);
