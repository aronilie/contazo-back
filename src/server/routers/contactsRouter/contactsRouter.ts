import express from "express";
import userAuthentication from "../../../utils/userAuthentication/userAuthentication";
import {
  deleteContact,
  getContacts,
} from "../../controllers/contactsController/contactsController";

const contactsRouter = express.Router();

contactsRouter.get("/contacts", userAuthentication, getContacts);

contactsRouter.delete("/delete/:id", userAuthentication, deleteContact);

export default contactsRouter;
