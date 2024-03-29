import { NextFunction, Response, Request } from "express";
import {
  Contact,
  ContactModel,
} from "../../../database/models/Contact/Contact";
import { CustomRequest } from "../../../interfaces/JwTPayload";
import CustomError from "../../../utils/CustomError/CustomError";

export const getContacts = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.payload;

  try {
    const contacts = await ContactModel.find({
      owner: id,
    }).populate("owner");

    res.status(200).json({ contacts });
  } catch (error) {
    const finalError = new CustomError(
      400,
      "The contacts couldn't been loaded successfully",
      "Error while getting the contacts"
    );

    next(finalError);
  }
};

export const getContactByPhoneNumber = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { phoneId } = req.params;
  const { id } = req.payload;

  try {
    const contact = await ContactModel.findOne({
      phoneNumber: phoneId,
      owner: id,
    });

    res.status(200).json(contact);
  } catch (error) {
    const finalError = new CustomError(
      400,
      "Error loading contact",
      "Error loading contact"
    );

    next(finalError);
  }
};

export const deleteContact = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.payload;
  const { phoneId } = req.params;

  try {
    await ContactModel.findOneAndDelete({
      phoneNumber: phoneId,
      owner: id,
    });

    res.status(201).json("Contact successfully deleted");
  } catch (error) {
    const finalError = new CustomError(
      400,
      "Error deleting contact",
      "Error deleting contact"
    );

    next(finalError);
  }
};

export const createContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const contact: Contact = req.body;

  try {
    await ContactModel.create(contact);

    res.status(201).json("Contact successfully created");
  } catch (error) {
    const finalError = new CustomError(
      400,
      "Error creating contact",
      "Error creating contact"
    );

    next(finalError);
  }
};

export const updateContact = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.payload;
  const { phoneId } = req.params;
  const contact: Contact = req.body;

  try {
    await ContactModel.findOneAndUpdate(
      {
        phoneNumber: phoneId,
        owner: id,
      },
      contact
    );

    res.status(201).json("Contact successfully updated");
  } catch (error) {
    const finalError = new CustomError(
      400,
      "Error updating contact",
      "Error updating contact"
    );

    next(finalError);
  }
};
