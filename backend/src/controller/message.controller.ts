import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { AuthRequest } from "../middleware/auth";
import { Message } from "../models/Messages";
import { User } from "../models/User";
import { parseParamId } from "../helpers/parsParamId";

const messageRepository = AppDataSource.getRepository(Message);
const userRepository = AppDataSource.getRepository(User);


// Helper function to get socket ID
async function getSocketId(userId: number): Promise<string | null> {
    try {
        const user = await userRepository.findOneBy({ id: userId });
        return user?.socketId || null;
    } catch (error) {
        console.error("Error getting socket ID:", error);
        return null;
    }
}

export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.userId;

        const targetUserId = parseParamId(userId);

        if (!targetUserId) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const messages = await messageRepository.find({
            where: [
                { senderId: currentUserId, receiverId: targetUserId },
                { senderId: targetUserId, receiverId: currentUserId }
            ],
            order: { createdAt: "ASC" },
            relations: ["sender", "receiver"]
        });

        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
    try {
        const { messageId } = req.params;

        const targetMessageId = parseParamId(messageId);

        if (!targetMessageId) {
            return res.status(400).json({ error: "Invalid message ID" });
        }

        await messageRepository.update(targetMessageId, {
            isRead: true,
            readAt: new Date()
        });

        res.json({ message: "Message marked as read" });
    } catch (error) {
        console.error("Error marking message as read:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const deleteMessage = async (req: AuthRequest, res: Response) => {
    try {
        const { messageId } = req.params;
        const currentUserId = req.userId;

        const targetMessageId = parseParamId(messageId);

        if (!targetMessageId) {
            return res.status(400).json({ error: "Invalid message ID" });
        }

        // Find the message
        const message = await messageRepository.findOne({
            where: { id: targetMessageId },
            relations: ["sender", "receiver"]
        });

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Check if user is the sender of the message
        if (message.senderId !== currentUserId) {
            return res.status(403).json({ error: "You can only delete your own messages" });
        }

        // Delete the message
        await messageRepository.remove(message);

        // Emit socket event for real-time deletion
        const io = req.app.get("io");
        if (io) {
            // Notify both sender and receiver about deletion
            const senderSocketId = await getSocketId(message.senderId);
            const receiverSocketId = await getSocketId(message.receiverId);

            const deletionData = { messageId: targetMessageId };

            if (senderSocketId) {
                io.to(senderSocketId).emit("messageDeleted", deletionData);
            }
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("messageDeleted", deletionData);
            }
        }

        res.json({
            message: "Message deleted successfully",
            messageId: targetMessageId
        });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const deleteConversation = async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.userId;

        const targetUserId = parseParamId(userId);

        if (!targetUserId) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Delete all messages between current user and the other user
        const messages = await messageRepository.find({
            where: [
                { senderId: currentUserId, receiverId: targetUserId },
                { senderId: targetUserId, receiverId: currentUserId }
            ]
        });

        if (messages.length === 0) {
            return res.status(404).json({ error: "No messages found in this conversation" });
        }

        await messageRepository.remove(messages);

        // Emit socket event for conversation deletion
        const io = req.app.get("io");
        if (io) {
            const otherUserSocketId = await getSocketId(targetUserId);
            if (otherUserSocketId) {
                io.to(otherUserSocketId).emit("conversationDeleted", {
                    userId: currentUserId
                });
            }
        }

        res.json({
            message: "Conversation deleted successfully",
            deletedCount: messages.length
        });
    } catch (error) {
        console.error("Error deleting conversation:", error);
        res.status(500).json({ error: "Server error" });
    }
};


export const markConversationAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;
    const targetUserId = parseParamId(userId);
    
    if (!targetUserId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Mark all unread messages as read
    await messageRepository
      .createQueryBuilder()
      .update(Message)
      .set({ isRead: true, readAt: new Date() })
      .where("senderId = :senderId AND receiverId = :receiverId AND isRead = false", {
        senderId: targetUserId,
        receiverId: currentUserId
      })
      .execute();

    // Emit socket event for read receipts
    const io = req.app.get("io");
    const senderSocketId = await getSocketId(targetUserId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesRead", { 
        userId: currentUserId, 
        messageIds: [] // or send specific message IDs
      });
    }

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ error: "Server error" });
  }
};