const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');


// templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locMessageTemplate = document.querySelector('#loc-message-template').innerHTML;
socket.on('message', (msg) => {
    console.log(msg);
    const html = Mustache.render(messageTemplate, {
        message: msg
    })
    $messages.insertAdjacentHTML('beforeend', html);
})

socket.on('locationMessage', (url) => {
    console.log(url)
    const html = Mustache.render(locMessageTemplate, {
        locMessage: url
    }
    )
    $messages.insertAdjacentHTML('beforeend', html);
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');
    // let msg = document.querySelector('#message').value
    let msg = e.target.elements.message.value;
    socket.emit('sendMessage', msg, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if (error) {
            return console.log(error);
        }
        console.log("the message was delivered!!! ")
    });
});

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported on your system');
    }
    $sendLocationButton.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((position) => {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        socket.emit('sendLocation', { lat, lng },
            () => {
                $sendLocationButton.removeAttribute('disabled')
                console.log("loaction shared")
            }
        )
    });

});

socket.on('broadcastMsg', (msg) => {
    console.log("New message: " + msg);
})