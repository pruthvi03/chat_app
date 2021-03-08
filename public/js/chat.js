const socket = io();

socket.on('message', (msg) => {
    console.log(msg);
})

// Goal : send msg to other clients via server
document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // let msg = document.querySelector('#message').value
    let msg = e.target.elements.message.value;
    console.log(msg)
    socket.emit('sendMessage', msg)
});

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported on your system');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        socket.emit('sendLocation', { lat, lng })
    });

});

socket.on('broadcastMsg', (msg) => {
    console.log("New message: " + msg);
})