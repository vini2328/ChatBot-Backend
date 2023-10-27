const http = require("http");
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const socketIO = require("socket.io");
const connectDB = require('./config/connectDB.js');
const userRoutes = require('./routes/userRoutes.js');



const app=express();
const port =4500 ||process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL


const users=[{}]

app.use(cors());
connectDB(DATABASE_URL)

// json
app.use(express.json())

// load
app.use("/api/user",userRoutes)



app.get("/",(req,res)=>{
    res.send("Hell its working");
})

const server=http.createServer(app);

const io=socketIO(server)

io.on("connection",(socket)=>{
    console.log("New Connection");

    socket.on('joined',({user})=>{
        users[socket.id]=user
        console.log(`${user} has joined`)
        socket.broadcast.emit('userJoined',{user:"Admin",   message:` ${users[socket.id]} has Joined`})
        socket.emit("welcome",{user:"Admin",message:`Welcome to the Chat,${users[socket.id]}`})


         
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id})

    })

    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`})
        console.log(`User left`)
    })


})



server.listen(port,()=>{
    console.log(`server is working on http://localhost:${port}`);

})

