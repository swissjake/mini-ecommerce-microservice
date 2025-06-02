import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, message } = req.body;

    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
      },
    });

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    next(error);
  }
};
