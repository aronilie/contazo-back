import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface JwtCustomPayload {
  id: string;
  phoneNumber: string;
}

export interface CustomRequest extends Request {
  payload: JwtPayload;
}
