import express from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";

dotenv.config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "User service root " });
});

app.get("/users", (req, res) => {
  res.json({ message: "User route root works" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`User service running on port ${PORT}`);
  console.log(`User service running on port ${PORT}`);
});
