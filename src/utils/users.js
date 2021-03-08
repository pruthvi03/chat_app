const users = [];
// add user, remov user, get user, get user room
const addUser = ({id,username,room}) =>{
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    if(!username || !room){
        return {
            error: 'Username and room are required'
        };
    }
    
    const exisitingUser = users.find((user) =>{
        // console.log("comparing")
        return user.room === room && user.username === username
    })

    // validate username
    if(exisitingUser){
        return {
            error: 'Username is in use'
        }
    }

    // store user 
    const user = {id,username,room};
    users.push(user);
    return {user};
}

const removeUser = (id) =>{
    const index = users.findIndex(user =>user.id === id)
    const user = users[index];
    console.log(user);
    if(index!=-1){
        return users.splice(index,1)[0];
    }
}

const getUser = (id)=>{
    return users.find(user => user.id === id)
}

const getUserInRoom = (room) =>{
    room = room.trim().toLowerCase();
    return users.filter(user => user.room === room);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}