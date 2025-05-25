// api-gateway/src/index.ts
import express from "express";
import proxy from "express-http-proxy";
import dotenv from "dotenv";
import validateToken from "./middleware/validateToken";
import logger from "./utils/logger";
import { apiRateLimiter } from "./middleware/rateLimiter";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import { Request, Response, NextFunction } from "express";
import { specs } from "./config/swagger";
import swaggerUi from "swagger-ui-express";
import { checkRole } from "./middleware/checkRole";
dotenv.config();

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

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiRateLimiter);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const proxyOptions = {
  proxyReqPathResolver: (req: Request) => {
    return req.originalUrl.replace(/^\/v1/, "/api");
  },
};

const protectedAuthRoutes = ["/logout"];

// Public auth routes (login, register)
app.use(
  "/v1/auth",
  (req, res, next) => {
    if (protectedAuthRoutes.includes(req.path)) {
      return validateToken(req, res, next);
    }
    next();
  },
  proxy(process.env.USER_SERVICE_URL || "", {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      (proxyReqOpts.headers as Record<string, string>)["content-type"] =
        "application/json";
      if (srcReq.user?.userId) {
        (proxyReqOpts.headers as Record<string, string>)["x-user-id"] =
          srcReq.user.userId;
      }
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      return proxyResData;
    },
  })
);

app.use(
  "/v1/users",
  validateToken,
  proxy(process.env.USER_SERVICE_URL || "", {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      (proxyReqOpts.headers as Record<string, string>)["content-type"] =
        "application/json";
      (proxyReqOpts.headers as Record<string, string>)["x-user-id"] =
        srcReq.user?.userId || "";
      (proxyReqOpts.headers as Record<string, string>)["x-user-role"] =
        srcReq.user?.role || "";
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      return proxyResData;
    },
  })
);

app.use(
  "/v1/orders",
  validateToken,
  proxy(process.env.ORDER_SERVICE_URL || "", {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      (proxyReqOpts.headers as Record<string, string>)["content-type"] =
        "application/json";
      (proxyReqOpts.headers as Record<string, string>)["x-user-id"] =
        srcReq.user?.id || "";
      (proxyReqOpts.headers as Record<string, string>)["x-user-role"] =
        srcReq.user?.role || "";

      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      return proxyResData;
    },
  })
);

app.use(
  "/v1/products",
  validateToken,
  proxy(process.env.PRODUCT_SERVICE_URL || "", {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      (proxyReqOpts.headers as Record<string, string>)["content-type"] =
        "application/json";
      (proxyReqOpts.headers as Record<string, string>)["x-user-id"] =
        srcReq.user?.id || "";
      (proxyReqOpts.headers as Record<string, string>)["x-user-role"] =
        srcReq.user?.role || "";

      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      return proxyResData;
    },
  })
);

app.use(
  "/v1/admin/products",
  validateToken,
  checkRole(["ADMIN"]),
  proxy(process.env.PRODUCT_SERVICE_URL || "", {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      (proxyReqOpts.headers as Record<string, string>)["content-type"] =
        "application/json";
      (proxyReqOpts.headers as Record<string, string>)["x-user-id"] =
        srcReq.user?.id || "";
      (proxyReqOpts.headers as Record<string, string>)["x-user-role"] =
        srcReq.user?.role || "";

      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      return proxyResData;
    },
  })
);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`API Gateway is running on http://localhost:${PORT}`);
});
