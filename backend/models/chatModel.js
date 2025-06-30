import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  gardenerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gardener',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [{
    sender: {
      type: String,
      enum: ['gardener', 'user'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }],
  lastMessage: {
    type: String,
    default: ''
  },
  lastMessageTime: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Index for faster queries
chatSchema.index({ gardenerId: 1, userId: 1 }, { unique: true });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat; 