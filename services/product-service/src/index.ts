import express from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";
import cors from "cors";
import productRoutes from "./routes/product.routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/admin/products", productRoutes);
app.use("/api/products", productRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Product service running on port ${PORT}`);
  console.log(`Product service running on port ${PORT}`);
});
