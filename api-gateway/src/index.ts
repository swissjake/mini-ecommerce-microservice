import express, { Response } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import dotenv from "dotenv";
import validateToken from "./middleware/validateToken";
import { Request } from "express";
import { ClientRequest } from "http";
import userRouter from "./routes/user";
import logger from "./utils/logger";
import { apiRateLimiter } from "./middleware/rateLimiter";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import { specs } from "./config/swagger";
import swaggerUi from "swagger-ui-express";

declare global {
  namespace Express {
    interface Request {
      apiVersion: string;
    }
  }
}
type ApiVersion = "v1";
type ApiVersions = Record<
  ApiVersion,
  {
    users: string | undefined;
    cart: string | undefined;
    orders: string | undefined;
    payments: string | undefined;
    notify: string | undefined;
  }
>;

dotenv.config();

const app = express();

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(apiRateLimiter);

const API_VERSIONS: ApiVersions = {
  v1: {
    users: process.env.USER_SERVICE_URL,
    cart: process.env.CART_SERVICE_URL,
    orders: process.env.ORDER_SERVICE_URL,
    payments: process.env.PAYMENT_SERVICE_URL,
    notify: process.env.NOTIFICATION_SERVICE_URL,
  },
};

// Version middleware
const versionMiddleware = (req: Request, res: Response, next: Function) => {
  const version = req.path.split("/")[1] as ApiVersion;
  if (version && API_VERSIONS[version]) {
    req.apiVersion = version;
    next();
  } else {
    req.apiVersion = "v1";
    next();
  }
};

app.use(versionMiddleware);

// Protected + Forward user info
const createAuthProxy = (target: string) => {
  return [
    validateToken,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      onError: (err: any, req: Request, res: Response) => {
        logger.info("Gateway Proxy error:", err);
        res.status(500).json({ message: "Gateway Proxy error" });
      },
      onProxyReq: (proxyReq: ClientRequest, req: Request & { user?: any }) => {
        if (req.user) {
          proxyReq.setHeader("x-user-id", req.user.userId);
          proxyReq.setHeader("x-user-email", req.user.email);
        }
      },
    } as Options),
  ];
};

//some user routes are protected
app.use("/v1/users", userRouter);

app.use("/v1/cart", ...createAuthProxy(API_VERSIONS.v1.cart as string));
app.use("/v1/orders", ...createAuthProxy(API_VERSIONS.v1.orders as string));
app.use("/v1/payments", ...createAuthProxy(API_VERSIONS.v1.payments as string));

app.use(
  "/v1/notify",
  createProxyMiddleware({
    target: API_VERSIONS.v1.notify as string,
    changeOrigin: true,
  })
);

// Redirect root to v1
app.get("/", (req, res) => {
  res.redirect("/v1");
});

// Version info endpoint
app.get("/versions", (req, res) => {
  res.json({
    description: "We only support v1 for now",
    current: "v1",
    supported: ["v1"],
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`API Gateway is running on http://localhost:${PORT}`);
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});
