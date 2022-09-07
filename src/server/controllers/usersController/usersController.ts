import { NextFunction, Request, Response } from "express";
import User, { UserData } from "../../../database/models/User/User";
import {
  createToken,
  hashCompare,
  hashCreator,
} from "../../../utils/auth/auth";
import CustomError from "../../../utils/CustomError/CustomError";
import UserRegister from "../../../interfaces/UserRegister";
import { JwtCustomPayload } from "../../../interfaces/JwTPayload";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userReceived: UserRegister = req.body;
  userReceived.password = await hashCreator(userReceived.password);

  try {
    const newUser = await User.create(userReceived);
    const { phoneNumber } = newUser;
    res.status(201).json({ user: { phoneNumber } });
  } catch (error) {
    const customError = new CustomError(
      409,
      "Error creating the user",
      `name: ${(error as Error).name}; message: ${(error as Error).message}`
    );
    next(customError);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  interface LoginData {
    phoneNumber: string;
    password: string;
  }

  const userReceived = req.body as LoginData;

  const userError = new CustomError(
    401,
    "Invalid phone number or password",
    "Invalid phone number or password"
  );

  let findUsers: UserData[];

  try {
    findUsers = await User.find({ phoneNumber: userReceived.phoneNumber });

    if (findUsers.length === 0) {
      next(userError);
      return;
    }
  } catch (error) {
    const finalError = new CustomError(
      401,
      "Invalid phone number or password",
      `name: ${(error as Error).name}; message: ${(error as Error).message}`
    );
    next(finalError);
  }

  try {
    const isPasswordValid = await hashCompare(
      userReceived.password,
      findUsers[0].password
    );

    if (!isPasswordValid) {
      userError.message = "Invalid password";

      next(userError);
      return;
    }
  } catch (error) {
    const finalError = new CustomError(
      401,
      "Invalid phone number or password",
      `name: ${(error as Error).name}; message: ${(error as Error).message}`
    );
    next(finalError);
    return;
  }

  const userPayload: JwtCustomPayload = {
    id: findUsers[0].id,
    phoneNumber: findUsers[0].phoneNumber,
  };

  const responseData = {
    user: {
      token: createToken(userPayload),
    },
  };

  res.status(200).json(responseData);
};

export default registerUser;
