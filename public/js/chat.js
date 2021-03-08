const socket = io();

// Goal :get welcome msg sended by server when client connects
socket.on('message', (msg) => {
    console.log('Printin msg sent by server: ', msg);
})

