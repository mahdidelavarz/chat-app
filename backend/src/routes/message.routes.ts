import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { getMessages, markAsRead, deleteMessage, deleteConversation } from "../controller/message.controller";

const router = Router();

router.get("/:userId", authenticateToken, getMessages);
router.put("/:messageId/read", authenticateToken, markAsRead);
router.delete("/:messageId", authenticateToken, deleteMessage);
router.delete("/conversation/:userId", authenticateToken, deleteConversation);

export default router;