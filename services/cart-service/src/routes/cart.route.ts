import { Router } from "express";
import { addToCart, getCart } from "../controller/cart.controller";

const router = Router();

router.post("/cart", addToCart);
router.get("/cart/:userId", getCart);

export default router;
