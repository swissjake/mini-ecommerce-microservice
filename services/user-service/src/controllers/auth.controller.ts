import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";
import ApiError from "../utils/apiError";
import bcrypt from "bcrypt";
import TokenService from "../services/token.service";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("Register endpoint hit in user service");
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (existingUser) {
      throw new ApiError("User already exists", 400);
    }

    const { email, fullName, phone, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, fullName, phone, password: hashedPassword },
    });

    logger.info("User created successfully with id: ", { userId: user.id });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      email: user.email,
    });
  } catch (error) {
    logger.error("Error registering user:", { error });
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("Login endpoint hit in user service");
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError("Invalid password", 401);
    }

    const { accessToken, refreshToken } = await TokenService.createTokens(
      user.id,
      user.role
    );

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("Refresh token endpoint hit in user service");
  try {
    const { refreshToken } = req.body;

    const decoded = await TokenService.verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    await TokenService.revokeRefreshToken(user.id);

    const { accessToken, refreshToken: newRefreshToken } =
      await TokenService.createTokens(user.id, user.role);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      await TokenService.revokeAllUserTokens(userId);
    }

    logger.info("Logged out successfully for user:", { userId });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
