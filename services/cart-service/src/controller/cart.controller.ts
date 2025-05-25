import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("Adding to cart");
  const { userId, productId, quantity } = req.body;

  try {
    const cart = await prisma.cart.create({
      data: { userId, productId, quantity },
    });
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("Removing from cart");
  try {
    const { id } = req.params;
    const cart = await prisma.cart.delete({
      where: { id },
    });
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("Getting cart");
  try {
    const { userId } = req.params;
    const cart = await prisma.cart.findMany({
      where: { userId },
    });
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};
