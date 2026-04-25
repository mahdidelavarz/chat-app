import { Router } from "express";

import { authenticateToken } from "../middleware/auth";
import { getMessages, markAsRead } from "../controller/message.controller";

const router = Router();

router.get("/:userId", authenticateToken, getMessages);
router.put("/:messageId/read", authenticateToken, markAsRead);

export default router;