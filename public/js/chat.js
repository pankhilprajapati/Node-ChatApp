const socket = io()

socket.on("countUpdated",(c)=>{
    console.log("The count is updated",c)
})

document.querySelector('#increment').addEventListener('click',()=>{
    console.log('clicked')
    socket.emit("increment")

})

