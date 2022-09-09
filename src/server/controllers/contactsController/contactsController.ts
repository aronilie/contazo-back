import { NextFunction, Response, Request } from "express";
import { ContactModel } from "../../../database/models/Contact/Contact";
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

export const deleteContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    await ContactModel.findByIdAndDelete(id);

    res.status(201).json("Contact successfully deleted");
  } catch {
    const finalError = new CustomError(
      400,
      "Error deleting contact",
      "Error deleting contact"
    );

    next(finalError);
  }
};
