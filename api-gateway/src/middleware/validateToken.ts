import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  logger.info("Validating token in api gateway middleware");

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing or invalid token" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    logger.info("Verifying token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // @ts-ignore: Add user to request object

    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

export default validateToken;
