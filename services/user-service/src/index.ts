import express from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";
import userRoutes from "./routes/user.routes";
import cors from "cors";

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

app.use("/", userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`User service running on port ${PORT}`);
  console.log(`User service running on port ${PORT}`);
});
