import express from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import dotenv from "dotenv";
import validateToken from "./middleware/validateToken";
import { Request } from "express";
import { ClientRequest } from "http";
import userRouter from "./routes/user";
import logger from "./utils/logger";
import { apiRateLimiter } from "./middleware/rateLimiter";
dotenv.config();
const app = express();

app.use(apiRateLimiter);
//some user routes are protected
app.use("/users", userRouter);

// Protected + Forward user info
const createAuthProxy = (target: string) => {
  return [
    validateToken,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      onProxyReq: (proxyReq: ClientRequest, req: Request & { user?: any }) => {
        if (req.user) {
          proxyReq.setHeader("x-user-id", req.user.userId);
          proxyReq.setHeader("x-user-email", req.user.email);
        }
      },
    } as Options),
  ];
};

app.use("/cart", ...createAuthProxy(process.env.CART_SERVICE_URL as string));
app.use("/orders", ...createAuthProxy(process.env.ORDER_SERVICE_URL as string));
app.use(
  "/payments",
  ...createAuthProxy(process.env.PAYMENT_SERVICE_URL as string)
);

app.use(
  "/notify",
  createProxyMiddleware({
    target: process.env.NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
  })
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`API Gateway is running on http://localhost:${PORT}`);
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});
