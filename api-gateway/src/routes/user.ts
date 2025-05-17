import dotenv from "dotenv";
import { Router, Request } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import validateToken from "../middleware/validateToken";
import { ClientRequest } from "http";

dotenv.config();

const userRouter = Router();
const target = process.env.USER_SERVICE_URL as string;

// Utility to add user headers
const withUserHeaders = (): Options & {
  onProxyReq?: (proxyReq: ClientRequest, req: Request & { user?: any }) => void;
} => ({
  target,
  changeOrigin: true,
  onProxyReq: (proxyReq: ClientRequest, req: Request & { user?: any }) => {
    if (req.user) {
      proxyReq.setHeader("x-user-id", req.user.userId);
      proxyReq.setHeader("x-user-email", req.user.email);
    }
  },
});

// Public routes (no auth)
userRouter.use("/login", createProxyMiddleware({ target, changeOrigin: true }));

userRouter.use(
  "/register",
  createProxyMiddleware({ target, changeOrigin: true })
);

// Protected routes (with JWT)
userRouter.use("/me", validateToken, createProxyMiddleware(withUserHeaders()));
userRouter.use(
  "/profile",
  validateToken,
  createProxyMiddleware(withUserHeaders())
);
userRouter.use(
  "/account",
  validateToken,
  createProxyMiddleware(withUserHeaders())
);

userRouter.use(
  "/",
  createProxyMiddleware({
    target,
    changeOrigin: true,
  })
);

export default userRouter;
