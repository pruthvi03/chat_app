const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generaeMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUserInRoom } = require('./utils/users');

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = socketio(server)

// Goal: Share coordinates to other users

// 'connection' event is bulit-in event
io.on('connection', (socket) => {
    console.log('New websocket connection');

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        if (error) {
            return callback(error);
        }
        socket.join(user.room);
        socket.emit('message', generaeMessage(user.username,'Welcome'));
        socket.broadcast.to(user.room).emit('message', generaeMessage(user.username,`${user.username} has joined!`))
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUserInRoom(user.room)      
        });
        callback();
    })
    socket.on('sendMessage', (msg, callback) => {
        console.log('msg recieved to server');
        const user = getUser(socket.id)
        if(!user) {
            return callback("No user found");
        }
        const filter = new Filter();
        if (filter.isProfane(msg)) {
            return callback('Profinity is not allowed');
        }
        // use io.emit to send it to all clients
        io.to(user.room).emit('message', generaeMessage(user.username,msg))
        callback('Delivered');
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        console.log(user," deleted")
        if (user) {
            
            io.to(user.room).emit('message', generaeMessage(user.username,`${user.username} has left`));
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUserInRoom(user.room)      
            });
        }
    })

    socket.on('sendLocation', ({ lat, lng }, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generaeMessage(user.username,`https://google.com/maps?q=${lat},${lng}`))
        callback();
    })
});



server.listen(3000, () => {
    console.log("server is running on port 3000!!!");
});