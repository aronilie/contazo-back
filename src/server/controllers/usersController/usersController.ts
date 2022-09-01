import { NextFunction, Request, Response } from "express";
import User, { UserData } from "../../../database/models/User/User";
import {
  createToken,
  hashCompare,
  hashCreator,
} from "../../../utils/auth/auth";
import CustomError from "../../../utils/CustomError/CustomError";
import UserRegister from "../../../interfaces/UserRegister";
import { JwtPayload } from "../../../interfaces/JwTPayload";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userReceived: UserRegister = req.body;
  userReceived.password = await hashCreator(userReceived.password);

  try {
    const newUser = await User.create(userReceived);

    res.status(201).json({ user: newUser });
  } catch (error) {
    const customError = new CustomError(
      400,
      error.message,
      "Error creating the user"
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
    userName: string;
    password: string;
  }

  const userReceived = req.body as LoginData;

  const userError = new CustomError(
    403,
    "User not found on database",
    "Invalid username or password"
  );

  let findUsers: UserData[];

  try {
    findUsers = await User.find({ userName: userReceived.userName });

    if (findUsers.length === 0) {
      next(userError);
      return;
    }
  } catch (error) {
    const finalError = new CustomError(
      403,
      `name: ${(error as Error).name}; message: ${(error as Error).message}`,
      "Invalid username or password"
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
      403,
      `name: ${(error as Error).name}; message: ${(error as Error).message}`,
      "Invalid username or password"
    );
    next(finalError);
    return;
  }

  const userPayload: JwtPayload = {
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
