import { Router } from "express";
import { registerUser } from "../controllers/user.controller";
import logger from "../utils/logger";
import { validateRequest } from "../middleware/validateRequest";
import { registerUserSchema } from "../dto/register-user.dto";

const router = Router();

// Login route
router.post("/login", (req, res) => {
  logger.info("Login route hit in user service");
  res.json({ message: "Login endpoint" });
});

router.post("/register", validateRequest(registerUserSchema), registerUser);

router.get("/", (req, res) => {
  logger.info("Root route hit in user service in user.routes.ts");
  res.json({ message: "User service root" });
});

export default router;
