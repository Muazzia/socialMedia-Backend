const { Server } = require("socket.io");
const { validateChat, Chat } = require('../models/Chat');

const configureSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: '*'
    });

    io.on('connection', (socket) => {
        console.log("User is connected");

        socket.on('joinRoom', (room) => {
            socket.join(room);
        });

        socket.on('leaveRoom', (room) => {
            socket.leave(room);
        })

        socket.on('chat', async (payload) => {
            const { error } = validateChat(payload);
            if (error) return socket.emit('creatingChatErr', error.message);

            const { sender, receiver, message } = payload;
            const newMessage = {
                sender, receiver, message
            };
            try {
                const roomName = sender < receiver
                    ? `${sender}-${receiver}`
                    : `${receiver}-${sender}`;
                const prevChat = await Chat.findOne({
                    participants: {
                        $all: [sender, receiver]
                    }
                })

                if (prevChat) {
                    prevChat.messages.push(newMessage);
                    await prevChat.save();
                    io.to(roomName).emit('chat', prevChat.messages.at(-1));
                } else {
                    const chat = new Chat({
                        participants: [sender, receiver],
                        messages: [newMessage]
                    });
                    const savedChat = await chat.save();
                    io.to(roomName).emit('chat', savedChat.messages.at(-1));
                }

            } catch (error) {
                console.error("Error creating chat:", error);
                return socket.emit('creatingChatErr', error)
            }
        });


        socket.on('getAllChats', async (payload, callback) => {
            try {
                const { sender, receiver } = payload;
                const chats = await Chat.findOne({
                    participants: {
                        $all: [sender, receiver]
                    }
                });

                callback(chats);
            } catch (error) {
                console.error('Error retrieving chats:', error);
                callback([]);
            }
        });


    });


    return io;
};



module.exports = configureSocket;
