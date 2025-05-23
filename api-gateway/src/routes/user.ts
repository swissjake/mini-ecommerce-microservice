// import { Router } from "express";
// import { createProxyMiddleware } from "http-proxy-middleware";
// import validateToken from "../middleware/validateToken";
// import logger from "../utils/logger";

// const userRouter = Router();
// const target = String(process.env.USER_SERVICE_URL);

// logger.info("User router initialized with target:", { target });

// const userProxy = createProxyMiddleware({
//   target,
//   changeOrigin: true,
// });

// // Apply validateToken middleware to all routes
// userRouter.use(validateToken);

// // Apply proxy to all routes
// userRouter.use("/", userProxy);

// export default userRouter;
