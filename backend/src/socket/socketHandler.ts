import { Server, Socket } from "socket.io";
import { AppDataSource } from "../config/database";
import { User } from "../models/User";
import { Message } from "../models/Messages";

const userRepository = AppDataSource.getRepository(User);
const messageRepository = AppDataSource.getRepository(Message);

interface OnlineUser {
    userId: number;
    socketId: string;
}

const onlineUsers = new Map<number, string>();

export const setupSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("User connected:", socket.id);

        socket.on("userOnline", async (userId: number) => {
            onlineUsers.set(userId, socket.id);
            await userRepository.update(userId, { socketId: socket.id });
            io.emit("usersOnline", Array.from(onlineUsers.keys()));
        });

        socket.on("sendMessage", async (data: {
            senderId: number;
            receiverId: number;
            content: string;
        }) => {
            try {
                const message = messageRepository.create({
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    content: data.content
                });

                const savedMessage = await messageRepository.save(message);
                const sender = await userRepository.findOneBy({ id: data.senderId });

                const messageData = {
                    id: savedMessage.id,
                    content: savedMessage.content,
                    senderId: savedMessage.senderId,
                    receiverId: savedMessage.receiverId,
                    createdAt: savedMessage.createdAt,
                    isRead: savedMessage.isRead,
                    sender: {
                        id: sender?.id,
                        username: sender?.username,
                        fullName: sender?.fullName
                    }
                };

                const receiverSocketId = onlineUsers.get(data.receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newMessage", messageData);
                }

                socket.emit("messageSent", messageData);

            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("messageError", { error: "Failed to send message" });
            }
        });

        socket.on("typing", (data: { receiverId: number; isTyping: boolean }) => {
            const receiverSocketId = onlineUsers.get(data.receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("userTyping", {
                    userId: data.receiverId,
                    isTyping: data.isTyping
                });
            }
        });

        // Add delete message handler
        socket.on("deleteMessage", async (data: { messageId: number; userId: number }) => {
            try {
                const message = await messageRepository.findOne({
                    where: { id: data.messageId }
                });

                if (message && message.senderId === data.userId) {
                    await messageRepository.remove(message);

                    // Notify both users about deletion
                    const receiverSocketId = onlineUsers.get(message.receiverId);
                    const senderSocketId = onlineUsers.get(message.senderId);

                    const deletionData = { messageId: data.messageId };

                    if (receiverSocketId) {
                        io.to(receiverSocketId).emit("messageDeleted", deletionData);
                    }
                    if (senderSocketId) {
                        io.to(senderSocketId).emit("messageDeleted", deletionData);
                    }
                }
            } catch (error) {
                console.error("Error deleting message via socket:", error);
            }
        });

        socket.on("disconnect", async () => {
            console.log("User disconnected:", socket.id);

            let disconnectedUserId: number | undefined;
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    onlineUsers.delete(userId);
                    break;
                }
            }

            if (disconnectedUserId) {
                await userRepository.update(disconnectedUserId, { socketId: "" });
                io.emit("usersOnline", Array.from(onlineUsers.keys()));
            }
        });
        // Add to your socket handler
        socket.on('markAsRead', async (data: { messageId: number; userId: number }) => {
            try {
                // Update message as read in database
                await messageRepository.update(data.messageId, {
                    isRead: true,
                    readAt: new Date()
                });

                // Get the message to find sender
                const message = await messageRepository.findOneBy({ id: data.messageId });

                if (message) {
                    // Notify the sender that their message was read
                    const senderSocketId = onlineUsers.get(message.senderId);
                    if (senderSocketId) {
                        io.to(senderSocketId).emit('messageRead', {
                            messageId: data.messageId,
                            userId: data.userId
                        });
                    }
                }
            } catch (error) {
                console.error('Error marking message as read:', error);
            }
        });

        socket.on('markConversationAsRead', async (data: { otherUserId: number; userId: number }) => {
            try {
                // Mark all unread messages from otherUserId to userId as read
                await messageRepository
                    .createQueryBuilder()
                    .update(Message)
                    .set({ isRead: true, readAt: new Date() })
                    .where("senderId = :senderId AND receiverId = :receiverId AND isRead = false", {
                        senderId: data.otherUserId,
                        receiverId: data.userId
                    })
                    .execute();

                // Notify the sender that all messages were read
                const senderSocketId = onlineUsers.get(data.otherUserId);
                if (senderSocketId) {
                    io.to(senderSocketId).emit('messagesRead', {
                        userId: data.userId,
                        messageIds: []
                    });
                }
            } catch (error) {
                console.error('Error marking conversation as read:', error);
            }
        });
    });
};