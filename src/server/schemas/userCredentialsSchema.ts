import { Joi } from "express-validation";

const userCredentialsSchema = {
  body: Joi.object({
    name: Joi.string().min(1),
    surname: Joi.string().min(1),
    email: Joi.string().min(1),
    phoneNumber: Joi.string().min(1).required(),
    password: Joi.string().min(1).required(),
  }),
};

export default userCredentialsSchema;
