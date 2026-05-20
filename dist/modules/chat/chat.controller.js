"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnreadUsers = exports.getUnreadCount = exports.deleteMessage = exports.markSeen = exports.sendMessage = exports.getChat = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const message_model_1 = __importDefault(require("./message.model"));
// ===============================
// ✅ GET CHAT
// ===============================
const getChat = async (req, res) => {
    try {
        res.set("Cache-Control", "no-store");
        const currentUserId = new mongoose_1.default.Types.ObjectId(req.user.id);
        const otherUserId = new mongoose_1.default.Types.ObjectId(req.params.userId);
        const messages = await message_model_1.default
            .find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId },
            ],
            isDeleted: false,
        })
            .sort({ createdAt: 1 })
            .populate("sender", "name avatar");
        res.json({ messages });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};
exports.getChat = getChat;
// ===============================
// ✅ SEND MESSAGE (🔥 SOCKET + NOTIFICATION)
// ===============================
const sendMessage = async (req, res) => {
    try {
        const senderId = req.user?.id;
        const { receiverId, content } = req.body;
        if (!senderId || !receiverId || !content) {
            return res.status(400).json({ message: "Missing fields" });
        }
        const message = await message_model_1.default.create({
            sender: senderId,
            receiver: receiverId,
            content,
        });
        let populated = null;
        try {
            populated = await message_model_1.default
                .findById(message._id)
                .populate("sender", "name avatar");
        }
        catch (err) {
            console.error("Populate error:", err);
        }
        const io = req.app.get("io");
        if (io && receiverId && populated) {
            io.to(receiverId.toString()).emit("receive_message", populated);
            io.to(receiverId.toString()).emit("new_message_notification");
        }
        return res.json({ message: populated || message });
    }
    catch (error) {
        console.error("❌ SEND MESSAGE ERROR:", error);
        return res.status(500).json({ message: error.message });
    }
};
exports.sendMessage = sendMessage;
// ===============================
// ✅ MARK SEEN
// ===============================
const markSeen = async (req, res) => {
    try {
        const { userId } = req.params;
        await message_model_1.default.updateMany({
            receiver: req.user.id,
            sender: userId,
            isSeen: false,
        }, { $set: { isSeen: true } });
        res.json({ success: true });
        // 🔥 OPTIONAL: realtime seen update
        const io = req.app.get("io");
        io.to(userId.toString()).emit("messages_seen", {
            by: req.user.id,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to mark seen" });
    }
};
exports.markSeen = markSeen;
// ===============================
// ✅ DELETE MESSAGE (SOFT DELETE)
// ===============================
const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        await message_model_1.default.findByIdAndUpdate(messageId, {
            isDeleted: true,
        });
        res.json({ success: true });
        // 🔥 SOCKET DELETE SYNC
        const io = req.app.get("io");
        io.emit("message_deleted", { messageId });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete message" });
    }
};
exports.deleteMessage = deleteMessage;
// ===============================
// 🔴 UNREAD COUNT
// ===============================
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user?.id;
        console.log("🔥 UNREAD COUNT HIT");
        console.log("👤 userId:", userId);
        if (!userId) {
            console.log("❌ Unauthorized - userId missing");
            return res.status(401).json({ message: "Unauthorized" });
        }
        const count = await message_model_1.default.countDocuments({
            receiver: userId,
            isRead: false,
        });
        console.log("📩 unread count:", count);
        return res.json({ count });
    }
    catch (error) {
        console.error("❌ Unread count error:", error);
        return res.status(500).json({ message: error.message });
    }
};
exports.getUnreadCount = getUnreadCount;
// ===============================
// 👥 UNREAD USERS
// ===============================
const getUnreadUsers = async (req, res) => {
    try {
        const userId = req.user?.id;
        console.log("🔥 UNREAD USERS HIT");
        console.log("👤 userId:", userId);
        if (!userId) {
            console.log("❌ Unauthorized - userId missing");
            return res.status(401).json({ message: "Unauthorized" });
        }
        const users = await message_model_1.default.aggregate([
            {
                $match: {
                    receiver: userId,
                    isRead: false,
                },
            },
            {
                $group: {
                    _id: "$sender",
                    count: { $sum: 1 },
                },
            },
        ]);
        console.log("👥 unread users:", users);
        return res.json(users);
    }
    catch (error) {
        console.error("❌ Unread users error:", error);
        return res.status(500).json({ message: error.message });
    }
};
exports.getUnreadUsers = getUnreadUsers;
