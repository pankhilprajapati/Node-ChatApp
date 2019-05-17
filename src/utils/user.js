const users = []


const addUser = ({id, username, room})=>{
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return{
            error:"Username and room are required !"
        }
    }
    const existUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    if(existUser){
        return{
            error:"Username is in user"
        }
    }

    const user = {id, username, room}
    users.push(user)
    return{user}
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>user.id === id)
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser=(id)=>{
    return users.find((user)=>user.id===id)

}

const getUserRoom = (name)=>{
    room = name.trim().toLowerCase()
    return users.filter(user=>user.room===name)
}


module.exports={
    addUser,
    getUser,
    removeUser,
    getUserRoom
}

