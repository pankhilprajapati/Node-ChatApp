const socket = io()

const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton = $messageForm.querySelector('button')

const $locationButton = document.querySelector("#send-location")

socket.on('message', (message)=>{
    console.log(message)
})


document.querySelector('#message-form').addEventListener("submit", (e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value


    socket.emit('sendMessage', message,(error)=>{
        $messageFormButton.removeAttribute("disabled")
        $messageFormInput.value = ""
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log("Message Dilevered")
    })
})


document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert("Not supported by the browser")
    }
    
    $locationButton.setAttribute("disabled","disabled")

    navigator.geolocation.getCurrentPosition((p)=>{
        
        socket.emit("sendLocation",{
            latitude: p.coords.latitude,
            longitude: p.coords.longitude
        },()=>{
            console.log("Location Shared")
            $locationButton.removeAttribute("disabled")
        })
    })
})