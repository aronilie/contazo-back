import { NextFunction, Request, Response } from "express";
import { ContactModel } from "../../../database/models/Contact/Contact";
import CustomError from "../../../utils/CustomError/CustomError";

const getContacts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contacts = await ContactModel.find({
      owner: "631791f8d7342693105b6908",
    }).populate("owner");

    res.status(200).json({ contacts });
  } catch (error) {
    const finalError = new CustomError(
      400,
      "The contacts couldn't been loaded successfully.",
      "Error while getting the contacts."
    );

    next(finalError);
  }
};

export default getContacts;
