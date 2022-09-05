import { model, Schema } from "mongoose";

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

const Contact = model("Contact", contactSchema, "contacts");

export default Contact;
