const path = require("path")
const http = require('http')
const express = require("express")
const socketio = require("socket.io")
// const ejs = require("ejs")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection',()=>{
    console.log("New WebSocket Connect")
})

server.listen(port,()=>{
    console.log(`Server is online at port ${port}`)
})