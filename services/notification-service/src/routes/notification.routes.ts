import express, { Request, Response } from 'express';
import { createNotification } from '../controllers/notification.controller';
import { requireAuth } from '../middleware/authMiddleware';


const router = express.Router();


router.post("/create", requireAuth, createNotification)