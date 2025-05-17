import express from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";

dotenv.config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Order service works 🎉" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Order service running on port ${PORT}`);
  console.log(`Order service running on port ${PORT}`);
});
