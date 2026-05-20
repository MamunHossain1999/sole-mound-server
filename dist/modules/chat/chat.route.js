"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("./chat.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get("/chat/:userId", auth_middleware_1.protect, chat_controller_1.getChat);
router.post("/chat/send", auth_middleware_1.protect, chat_controller_1.sendMessage);
router.patch("/chat/seen/:userId", auth_middleware_1.protect, chat_controller_1.markSeen);
router.patch("/chat/delete/:messageId", auth_middleware_1.protect, chat_controller_1.deleteMessage);
router.get("/chat/unread-count", auth_middleware_1.protect, chat_controller_1.getUnreadCount);
router.get("/chat/unread-users", auth_middleware_1.protect, chat_controller_1.getUnreadUsers);
exports.default = router;
