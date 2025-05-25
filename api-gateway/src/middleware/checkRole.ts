import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        [key: string]: any;
      };
    }
  }
}

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    logger.info("Checking user role in middleware");

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized - No user found" });
      return;
    }

    if (!roles.includes(req.user?.role)) {
      res.status(403).json({
        message: "Forbidden - Insufficient permissions",
      });
      return;
    }

    next();
  };
};
