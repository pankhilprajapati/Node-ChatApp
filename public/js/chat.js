const socket = io()

socket.on('message', (message)=>{
    console.log(message)
})


document.querySelector('#message-form').addEventListener("submit", (e)=>{
    e.preventDefault()

    const message = e.target.elements.message

    socket.emit('sendMessage', message)
})


document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert("Not supported by the browser")
    }
    
    navigator.geolocation.getCurrentPosition((p)=>{
        
        socket.emit("sendLocation",{
            latitude: p.coords.latitude,
            longitude: p.coords.longitude
        })
    })
})