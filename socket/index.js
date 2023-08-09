const { Server } = require("socket.io");

const configureSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: '*'
    });

    io.on('connection', (socket) => {
        console.log("User is connected");

        socket.on('message', (payload) => {
            console.log(payload);
            io.emit('message', payload);
        });
    });

    return io;
};

module.exports = configureSocket;
