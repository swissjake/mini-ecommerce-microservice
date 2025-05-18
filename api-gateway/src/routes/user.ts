import dotenv from "dotenv";
import { Router, Request, Response } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import validateToken from "../middleware/validateToken";
import { ClientRequest } from "http";
import logger from "../utils/logger";

dotenv.config();

const userRouter = Router();
const target = String(process.env.USER_SERVICE_URL);

// Simple proxy for all user routes
userRouter.use(
  "/",
  createProxyMiddleware({
    target,
    changeOrigin: true,
  })
);

userRouter.use(
  "/me",
  validateToken,
  createProxyMiddleware({
    target,
    changeOrigin: true,
  })
);

userRouter.use(
  "/profile",
  validateToken,
  createProxyMiddleware({
    target,
    changeOrigin: true,
  })
);

userRouter.use(
  "/account",
  validateToken,
  createProxyMiddleware({
    target,
    changeOrigin: true,
  })
);

export default userRouter;
