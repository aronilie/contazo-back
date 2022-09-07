import { NextFunction, Response } from "express";
import { ContactModel } from "../../../database/models/Contact/Contact";
import { CustomRequest } from "../../../interfaces/JwTPayload";
import CustomError from "../../../utils/CustomError/CustomError";

const getContacts = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.payload;

  try {
    const contacts = await ContactModel.find({
      _id: id,
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