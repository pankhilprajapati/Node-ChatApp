const path = require("path")
const http = require('http')
const express = require("express")
const socketio = require("socket.io")
const Filter = require("bad-words")
// const ejs = require("ejs")

const app = express()
//so that express server work with socket server
const server = http.createServer(app)

//socket server 
const io = socketio(server)
const {generateMessage, generateLocation} =require("./utils/messages")
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))



io.on('connection',(socket)=>{
    console.log("New WebSocket Connect")

    socket.emit('message',generateMessage('Welcome !'))
    socket.broadcast.emit("message",generateMessage('A new user has joined !!'))

    socket.on("sendMessage",(message, callback)=>{
        const filter = new Filter()
        // filtering bad word 
        if(filter.isProfane(message)){
            return callback("Profanity not allowed")
        }
          
        io.emit("message", generateMessage(message))
        callback("Delivered")
    })

    //getting location from the 
    socket.on("sendLocation",(coords, callback)=>{
        io.emit("locationMessage",generateLocation(`http://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect',()=>{
        io.emit('message', generateMessage('A user has left'))
    })
    
})

server.listen(port,()=>{
    console.log(`Server is online at port ${port}`)
})