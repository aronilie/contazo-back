import express from "express";
import registerUser from "../../controllers/usersController/usersController";

const usersRouter = express.Router();

usersRouter.post("/register", registerUser);

export default usersRouter;
