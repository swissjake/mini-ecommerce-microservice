import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("Creating product");
  try {
    const { name, price, description, stock } = req.body;
    const product = await prisma.product.create({
      data: { name, price, description, stock },
    });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    logger.error("Error creating product", error);
    next(error);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    logger.error("Error getting products", error);
    next(error);
  }
};
