import Joi from "joi";

export const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  zip: Joi.string(),
});

export type RegisterUserDto = {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
};
