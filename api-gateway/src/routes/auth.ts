// api-gateway/src/routes/auth.ts
import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import validateToken from "../middleware/validateToken";

const authRouter = Router();
const target = String(process.env.USER_SERVICE_URL);

// Create proxy middleware for auth routes
const authProxy = createProxyMiddleware({
  target,
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req) => {
      //   console.log("Proxying to:", `${target}${req.path}`);
    },
  },
});

// Public routes (login, register, refresh-token)
authRouter.use("/login", authProxy);
authRouter.use("/register", authProxy);
authRouter.use("/refresh-token", authProxy);

// Protected routes (logout)
authRouter.use("/logout", validateToken, authProxy);

export default authRouter;
