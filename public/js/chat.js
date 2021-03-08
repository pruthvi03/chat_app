const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');


// templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locMessageTemplate = document.querySelector('#loc-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// options
const {username, room} = Qs.parse(location.search,{ignoreQueryPrefix:true});

const autoscroll = ()=>{
    // New messages element
    const $newMessage = $messages.lastElementChild

    // height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // visible height 
    const visibleHeight = $messages.offsetHeight;

    // hight of the message container
    const containerHeight = $messages.scrollHeight;

    // how far have I scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight >= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }

}

socket.on('message', (msg) => {
    console.log(msg);
    const html = Mustache.render(messageTemplate, {
        username: msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.on('locationMessage', (url) => {
    console.log(url)
    const html = Mustache.render(locMessageTemplate, {
        username: url.username,
        locMessage: url.text,
        createdAt: moment(url.createdAt).format('h:mm:ss a')
    }
    )
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
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

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href = '/';
    }
});

socket.on('roomData', ({room,users})=>{
    console.log(room);
    console.log(users);
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html;
})