import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";
import ApiError from "../utils/apiError";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const getUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  logger.info("Fetching user endpoint hit in user service");
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError("User ID is required", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    res.status(200).json(user);
  } catch (error) {
    logger.error("Error fetching user:", { error });
    next(error);
  }
};
