import express from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";
import cors from "cors";
import orderRoutes from "./routes/order.route";
import { errorHandler } from "./middleware/errorHandler";

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

// app.get("/", (req, res) => {
//   res.json({ message: "Order service works" });
// });

app.use("/api/orders", orderRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Order service running on port ${PORT}`);
  console.log(`Order service running on port ${PORT}`);
});
