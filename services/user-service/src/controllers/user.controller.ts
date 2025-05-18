import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";
import ApiError from "../utils/apiError";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  logger.info("Register endpoint hit in user service");
  try {
    const user = await prisma.user.create({
      data: req.body,
    });

    logger.info("User created successfully:", user);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    logger.error("Error creating user:", error);
    throw new ApiError("Failed to register user", 500);
  }
};
