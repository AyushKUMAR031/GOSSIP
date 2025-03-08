const express = require('express');
const cors = require('cors'); //cross - origin - resource - sharing
//CORS is a security feature implemented by web browsers that restricts web pages from making requests 
//to a different domain than the one that served the web page. It prevents unauthorized cross-origin requests for security reasons.
const app = express();

require('dotenv').config();

const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messagesRoute = require('./routes/messagesRoute');

// socket.io for ws connection
const socket = require('socket.io');

app.use(cors());
app.use(express.json());

app.use('/api/auth',userRoutes);
app.use('/api/messages',messagesRoute);

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err.message);
});

//extra
app.get("/ping", (_req, res) => {
    return res.json({ msg: "Ping Successful" });
});

const server = app.listen(process.env.PORT,() =>{
    console.log(`Server is running on port: ${process.env.PORT}`);
})

//creating a socket.io instance
const io = socket(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
    },
});

//Socket.IO requires CORS (Cross-Origin Resource Sharing) settings when 
// the frontend (React app) and backend are hosted on different ports.

//credentials: true → Allows cookies and HTTP authentication headers to be
//sent along with the WebSocket request.

global.onlineUsers = new Map();
/*
In Node.js, global.onlineUsers = new Map(); initializes a Map to efficiently store key-value pairs, where userId is the key and socket.id is the value.

    On User Connect: Adds the userId and socket.id to global.onlineUsers.
    On Message Send: Retrieves the recipient's socket.id via .get() and emits the message.
    On Disconnect: Removes the user from the Map to keep data updated.
*/

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });


    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-receive",data.message);
        }
    });


});
