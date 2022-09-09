import express from "express";
import userAuthentication from "../../../utils/userAuthentication/userAuthentication";
import {
  createContact,
  deleteContact,
  getContacts,
} from "../../controllers/contactsController/contactsController";

const contactsRouter = express.Router();

contactsRouter.get("/contacts", userAuthentication, getContacts);

contactsRouter.delete("/delete/:id", userAuthentication, deleteContact);

contactsRouter.post("/create", userAuthentication, createContact);

export default contactsRouter;
