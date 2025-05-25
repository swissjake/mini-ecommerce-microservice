import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId, productId, quantity } = req.body;

  try {
    const order = await prisma.order.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await prisma.order.findMany();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id },
    });
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
