import { Joi } from "express-validation";

const userCredentialsSchema = {
  body: Joi.object({
    phoneNumber: Joi.string().min(1).required(),
    password: Joi.string().min(1).required(),
  }),
};

export default userCredentialsSchema;
