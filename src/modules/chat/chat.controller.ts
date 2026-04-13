import mongoose from "mongoose";
import messageModel from "./message.model";

// ===============================
// ✅ GET CHAT
// ===============================
export const getChat = async (req: any, res: any) => {
  try {
    res.set("Cache-Control", "no-store");

    const currentUserId = new mongoose.Types.ObjectId(req.user.id);
    const otherUserId = new mongoose.Types.ObjectId(req.params.userId);

    const messages = await messageModel
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
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

// ===============================
// ✅ SEND MESSAGE (🔥 SOCKET + NOTIFICATION)
// ===============================
export const sendMessage = async (req: any, res: any) => {
  try {
    const senderId = req.user?.id;
    const { receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const message = await messageModel.create({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    let populated = null;

    try {
      populated = await messageModel
        .findById(message._id)
        .populate("sender", "name avatar");
    } catch (err) {
      console.error("Populate error:", err);
    }

    const io = req.app.get("io");

    if (io && receiverId && populated) {
      io.to(receiverId.toString()).emit("receive_message", populated);
      io.to(receiverId.toString()).emit("new_message_notification");
    }

    return res.json({ message: populated || message });
  } catch (error: any) {
    console.error("❌ SEND MESSAGE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ===============================
// ✅ MARK SEEN
// ===============================
export const markSeen = async (req: any, res: any) => {
  try {
    const { userId } = req.params;

    await messageModel.updateMany(
      {
        receiver: req.user.id,
        sender: userId,
        isSeen: false,
      },
      { $set: { isSeen: true } }
    );

    res.json({ success: true });

    // 🔥 OPTIONAL: realtime seen update
    const io = req.app.get("io");
    io.to(userId.toString()).emit("messages_seen", {
      by: req.user.id,
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to mark seen" });
  }
};

// ===============================
// ✅ DELETE MESSAGE (SOFT DELETE)
// ===============================
export const deleteMessage = async (req: any, res: any) => {
  try {
    const { messageId } = req.params;

    await messageModel.findByIdAndUpdate(messageId, {
      isDeleted: true,
    });

    res.json({ success: true });

    // 🔥 SOCKET DELETE SYNC
    const io = req.app.get("io");
    io.emit("message_deleted", { messageId });

  } catch (error) {
    res.status(500).json({ message: "Failed to delete message" });
  }
};


// ===============================
// 🔴 UNREAD COUNT
// ===============================
export const getUnreadCount = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;

    console.log("🔥 UNREAD COUNT HIT");
    console.log("👤 userId:", userId);

    if (!userId) {
      console.log("❌ Unauthorized - userId missing");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const count = await messageModel.countDocuments({
      receiver: userId,
      isRead: false,
    });

    console.log("📩 unread count:", count);

    return res.json({ count });
  } catch (error: any) {
    console.error("❌ Unread count error:", error);
    return res.status(500).json({ message: error.message });
  }
};
// ===============================
// 👥 UNREAD USERS
// ===============================
export const getUnreadUsers = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;

    console.log("🔥 UNREAD USERS HIT");
    console.log("👤 userId:", userId);

    if (!userId) {
      console.log("❌ Unauthorized - userId missing");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const users = await messageModel.aggregate([
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
  } catch (error: any) {
    console.error("❌ Unread users error:", error);
    return res.status(500).json({ message: error.message });
  }
};