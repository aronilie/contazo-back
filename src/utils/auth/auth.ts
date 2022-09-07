import "../../loadEnvironment";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JwtCustomPayload } from "../../interfaces/JwTPayload";

export const hashCreator = (text: string) => {
  const salt = 10;
  return bcrypt.hash(text, salt);
};

export const hashCompare = (firstHash: string, secondHash: string) =>
  bcrypt.compare(firstHash, secondHash);

export const createToken = (payload: JwtCustomPayload) =>
  jwt.sign(payload, process.env.SECRET);

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.SECRET);
