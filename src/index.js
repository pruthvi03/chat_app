const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const socketio = require('socket.io');

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = socketio(server)


io.on('connection', (socket) => {
    console.log('New websocket connection');
    io.emit('message','Welcome');
});

// Goal: Send a welcome message to new users


server.listen(3000, () => {
    console.log("server is running on port 3000!!!");
});