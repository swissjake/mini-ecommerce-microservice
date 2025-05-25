import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  logger.info("User service auth hit");
  const userId = req.headers["x-user-id"] as string;
  const role = req.headers["x-user-role"] as string;

  if (!userId || !role) {
    res.status(401).json({
      message: "Unauthorized - missing user information",
    });
    return;
  }

  req.user = { id: userId, role };
  next();
};
