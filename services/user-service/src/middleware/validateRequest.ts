import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import ApiError from "../utils/apiError";

export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const message = error.details.map((d) => d.message).join(", ");
      return next(new ApiError(message, 400));
    }

    next();
  };
};
