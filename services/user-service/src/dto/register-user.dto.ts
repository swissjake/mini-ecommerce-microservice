import Joi from "joi";

export const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  zip: Joi.string().optional(),
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
