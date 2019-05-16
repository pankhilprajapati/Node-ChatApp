const socket = io()

const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton = $messageForm.querySelector('button')

const $locationButton = document.querySelector("#send-location")
const $messages = document.querySelector("#messages")


const messageTemplate = document.querySelector("#message-template").innerHTML
const urlTemplate = document.querySelector("#url-template").innerHTML


socket.on('message', (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})


socket.on('locationMessage',(url)=>{
    console.log(url)
    const html = Mustache.render(urlTemplate,{
        url: url.url,
        createdAt: moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)

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