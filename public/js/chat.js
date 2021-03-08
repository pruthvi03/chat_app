const socket = io();

socket.on('countUpdated',(count)=>{
    console.log('the count is updated',count);
})

document.querySelector('#increment').addEventListener('click',()=>{
    console.log('Click');
    socket.emit('increment');
});