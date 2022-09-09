import express from "express";
import userAuthentication from "../../../utils/userAuthentication/userAuthentication";
import { getContacts } from "../../controllers/contactsController/contactsController";

const contactsRouter = express.Router();

contactsRouter.get("/contacts", userAuthentication, getContacts);

export default contactsRouter;
