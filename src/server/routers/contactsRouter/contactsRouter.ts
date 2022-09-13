import express from "express";
import multer from "multer";
import path from "path";
import userAuthentication from "../../../utils/userAuthentication/userAuthentication";
import {
  createContact,
  deleteContact,
  getContactByPhoneNumber,
  getContacts,
} from "../../controllers/contactsController/contactsController";
import fileStorage from "../../middleweares/filesStorage";

const contactsRouter = express.Router();

const upload = multer({
  dest: path.join("public"),
  limits: {
    fileSize: 8000000,
  },
});

contactsRouter.get("/contacts", userAuthentication, getContacts);

contactsRouter.post(
  "/create",
  upload.single("file"),
  fileStorage,
  userAuthentication,
  createContact
);

contactsRouter.get(
  "/contacts/:phoneId",
  userAuthentication,
  getContactByPhoneNumber
);

contactsRouter.delete("/delete/:phoneId", userAuthentication, deleteContact);

export default contactsRouter;
