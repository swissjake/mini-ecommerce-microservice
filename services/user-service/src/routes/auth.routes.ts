import { Router } from "express";
import {
  loginUser,
  logout,
  refreshToken,
  registerUser,
} from "../controllers/auth.controller";
import logger from "../utils/logger";
import { validateRequest } from "../middleware/validateRequest";
import { registerUserSchema } from "../dto/register-user.dto";
import { loginUserSchema } from "../dto/login-user.dto";
import { requireAuth } from "../middleware/authMiddleware";
import { getUser } from "../controllers/user.controller";

const router = Router();

// Login route
router.post("/login", validateRequest(loginUserSchema), loginUser);

router.post("/refresh-token", refreshToken);

router.post("/register", validateRequest(registerUserSchema), registerUser);

router.post("/logout", requireAuth, logout);

// router.get("/me", getUser);

export default router;
