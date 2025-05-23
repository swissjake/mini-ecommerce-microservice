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
  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized - user not found" });
    return;
  }

  req.user = { id: userId };
  next();
};
