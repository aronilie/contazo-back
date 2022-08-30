import { NextFunction, Request, Response } from "express";
import User from "../../../database/models/User/User";
import hashCreator from "../../../utils/auth/auth";
import CustomError from "../../../utils/CustomError/CustomError";
import UserRegister from "../../../interfaces/UserRegister";

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

export default registerUser;
