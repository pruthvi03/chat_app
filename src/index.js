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
// app.get("/",(req,res)=>{
//     res.render("index.html");
// });

let count = 0;
io.on('connection', (socket) => {
    console.log('New websocket connection');
    socket.emit('countUpdated',count);
    socket.on('increment',()=>{
        count++;
        // If you use below socket.emit then 
        // It emited to only client which had emmited increment event
        // To notify all client use io.emit()
        // socket.emit('countUpdated',count);
        io.emit('countUpdated',count);
    });
});


server.listen(3000, () => {
    console.log("server is running on port 3000!!!");
});