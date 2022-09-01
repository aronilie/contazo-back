import { model, Schema } from "mongoose";

export interface UserData {
  id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  password: string;
}

const userSchema = new Schema({
  name: {
    type: String,
  },
  surname: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = model("User", userSchema, "users");

export default User;
