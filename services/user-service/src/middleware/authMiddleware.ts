import { NextFunction, Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized - user not found" });
  }

  req.user = { id: userId };
  next();
};
