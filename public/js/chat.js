const socket = io();

socket.on('message', (msg) => {
    console.log(msg);
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // let msg = document.querySelector('#message').value
    let msg = e.target.elements.message.value;

    socket.emit('sendMessage', msg, (error)=>{
        if (error){
            return console.log(error);
        }
        console.log("the message was delivered!!! ")
    });
});

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported on your system');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        socket.emit('sendLocation', { lat, lng },
            ()=>{
                console.log("loaction shared")
            }
        )
    });

});

socket.on('broadcastMsg', (msg) => {
    console.log("New message: " + msg);
})