import express from "express";
import {
  getChat,
  sendMessage,
  markSeen,
  deleteMessage,
  getUnreadCount,
  getUnreadUsers,
 
} from "./chat.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/chat/:userId", protect, getChat);
router.post("/chat/send", protect, sendMessage);
router.patch("/chat/seen/:userId", protect, markSeen);
router.patch("/chat/delete/:messageId", protect, deleteMessage);

router.get("/chat/unread-count", protect, getUnreadCount);
router.get("/chat/unread-users", protect, getUnreadUsers);

export default router;