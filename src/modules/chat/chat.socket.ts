import { Server, Socket } from "socket.io";
import messageModel from "./message.model";

export const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    // ================= USER ONLINE =================
    socket.on("user_online", (userId: string) => {
      if (!userId) return;

      socket.data.userId = userId;

      io.emit("update_user_status", {
        userId,
        status: "online",
      });
    });

    // ================= JOIN ROOM =================
    socket.on("join_room", ({ senderId, receiverId }) => {
      if (!senderId || !receiverId) return;

      const room = [senderId, receiverId].sort().join("_");
      socket.join(room);
    });

    // ================= SEND MESSAGE =================
   socket.on("send_message", async ({ receiverId, content }) => {
  try {
    const senderId = socket.data.userId;

    if (!senderId) {
      console.error("❌ senderId missing");
      return;
    }

    if (!receiverId || !content) return;

    const room = [senderId, receiverId].sort().join("_");

    const message = await messageModel.create({
      sender: senderId,
      receiver: receiverId,
      content,
      roomId: room,
    });

    const populatedMessage = await messageModel
      .findById(message._id)
      .populate("sender", "name avatar");

    if (!populatedMessage) return;

    io.to(room).emit("receive_message", populatedMessage);
  } catch (error) {
    console.error("❌ Send message error:", error);
  }
});
    // ================= DELETE MESSAGE =================
    socket.on("delete_message", async ({ messageId }) => {
      try {
        if (!messageId) return;

        await messageModel.findByIdAndUpdate(messageId, {
          isDeleted: true,
        });

        io.emit("message_deleted", { messageId });
      } catch (error) {
        console.error("Delete message error:", error);
      }
    });

    // ================= MARK AS SEEN =================
    socket.on("mark_seen", async ({ messageIds }) => {
      try {
        if (!messageIds?.length) return;

        await messageModel.updateMany(
          { _id: { $in: messageIds } },
          { isSeen: true }
        );

        io.emit("messages_seen", { messageIds });
      } catch (error) {
        console.error("Mark seen error:", error);
      }
    });

    // ================= DISCONNECT =================
    socket.on("disconnect", () => {
      const userId = socket.data.userId;

      if (userId) {
        io.emit("update_user_status", {
          userId,
          status: "offline",
        });
      }

      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};