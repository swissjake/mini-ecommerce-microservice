import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getOrders,
} from "../controller/order.controller";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/", requireAuth, createOrder);
router.get("/", requireAuth, getOrders);
router.get("/:id", requireAuth, getOrderById);

export default router;
