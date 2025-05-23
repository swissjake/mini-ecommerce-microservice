import { Router } from "express";
import { getUser } from "../controllers/user.controller";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.get("/me", requireAuth, getUser);

export default router;
