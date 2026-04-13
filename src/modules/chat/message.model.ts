import mongoose, { Schema, model, Document } from "mongoose";

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver?: mongoose.Types.ObjectId;
  content: string;
  isSeen: boolean;
  isDeleted: boolean;
  roomId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    roomId: {
      type: String,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ roomId: 1 });

export default model<IMessage>("Message", messageSchema);