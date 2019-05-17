const socket = io()

const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton = $messageForm.querySelector('button')

const $locationButton = document.querySelector("#send-location")
const $messages = document.querySelector("#messages")


const messageTemplate = document.querySelector("#message-template").innerHTML
const urlTemplate = document.querySelector("#url-template").innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
const sideTemplate = document.querySelector("#side-template").innerHTML

const autoScroll = ()=>{
    const $newMessage = $messages.lastElementChild

    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight+newMessageMargin

    const visibleHeight = $messages.offsetHeight

    const containerHeight = $messages.scrollHeight

    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}


socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username:message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})


socket.on('locationMessage', ( url) => {
    console.log(url)
    const html = Mustache.render(urlTemplate, {
        username: url.username,
        url: url.url,
        createdAt: moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('roomData',({room, users})=>{
    const html = Mustache.render(sideTemplate,{
        room,
        users
    })
    document.querySelector("#side").innerHTML = html
})

$messageForm.addEventListener("submit", (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
 
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute("disabled")
        $messageFormInput.value = ""
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log("Message Dilevered")
    })
})

$locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert("Not supported by the browser")
    }

    $locationButton.setAttribute("disabled", "disabled")

    navigator.geolocation.getCurrentPosition((p) => {

        //emitting when the locaton is send through
        socket.emit("sendLocation", {
            latitude: p.coords.latitude,
            longitude: p.coords.longitude
        }, () => {
            console.log("Location Shared")
            $locationButton.removeAttribute("disabled")
        })
    })
})


socket.emit("join",{username, room},(error)=>{
    if(error){
        alert(error)
        location.href="/"
    }
})