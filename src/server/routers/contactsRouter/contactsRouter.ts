import express from "express";
import getContacts from "../../controllers/contactsController/contactsController";

const contactsRouter = express.Router();

contactsRouter.get("/", getContacts);

export default contactsRouter;
