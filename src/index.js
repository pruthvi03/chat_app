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

// Goal allow  clients to send message
// 1. create form with an input and button
// 2. setup the event listener for form submissions
//  -Emit 'sendMessage' with  i/p string as msg data
// 2. have server listen for 'sendMessage'
//  -send message to all clients

// 'connection' event is bulit-in event
io.on('connection', (socket) => {
    console.log('New websocket connection');

    socket.emit('message','Welcome');

    // socket.broadcast emits the event to all user except this socket
    socket.broadcast.emit('message','A new user has joined');

    socket.on('sendMessage',(msg) => {
        console.log('msg recieved to server');
        // use io.emit to send it to all clients
        io.emit('broadcastMsg', msg)
    })

    socket.on('disconnect',()=>{
        io.emit('message','A user has left');
    })
});



server.listen(3000, () => {
    console.log("server is running on port 3000!!!");
});