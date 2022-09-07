import { model, Schema } from "mongoose";

export interface Contact {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  image: string;
  owner: string;
  id: string;
}

const contactSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  surname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const ContactModel = model("Contact", contactSchema, "contacts");
