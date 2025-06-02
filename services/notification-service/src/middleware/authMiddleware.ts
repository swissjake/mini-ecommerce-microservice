import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  logger.info("Order service auth hit");
  const userId = req.headers["x-user-id"];
  if (!userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  req.user = { id: userId as string };
  next();
};
