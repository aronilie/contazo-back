import express from "express";
import { validate } from "express-validation";
import registerUser, {
  loginUser,
} from "../../controllers/usersController/usersController";
import userCredentialsSchema from "../../schemas/userCredentialsSchema";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validate(userCredentialsSchema, {}, { abortEarly: false }),
  registerUser
);

usersRouter.post(
  "/login",
  validate(userCredentialsSchema, {}, { abortEarly: false }),
  loginUser
);

export default usersRouter;
