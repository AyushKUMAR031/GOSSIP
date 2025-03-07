const express = require('express');
const cors = require('cors'); //cross - origin - resource - sharing
//CORS is a security feature implemented by web browsers that restricts web pages from making requests 
//to a different domain than the one that served the web page. It prevents unauthorized cross-origin requests for security reasons.
const app = express();

require('dotenv').config();

const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messagesRoutes = require('./routes/messagesRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/auth',userRoutes);
app.use('/api/messages',messagesRoutes);

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err.message);
});

const server = app.listen(process.env.PORT,() =>{
    console.log(`Server is running on port: ${process.env.PORT}`);
})