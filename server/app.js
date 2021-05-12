// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 5005;

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

let myServer = app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});

//---------------------------------------------------------
// --------YOUR session config has been done here---------
//---------------------------------------------------------
// Set up connect-mongo
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
    secret: 'NotMyAge',
    saveUninitialized: false, 
    resave: false, 
    cookie: {
      maxAge: 1000*60*60*24// is in milliseconds.  expiring in 1 day
    },
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/ReactTodos",
      ttl: 60*60*24, // is in seconds. expiring in 1 day
    })
}));

//---------------------------------------------------------
//---------------------------------------------------------

//-----------------SCOKET.IO SETUP-------------------------------
const { Server } = require("socket.io");
const io = new Server(myServer, {
  cors: {
    origin: '*',
  }
});
//---------------------------------------------------------------

//-------------------SOCKET EVENTS -----------------------------

const MessageModel = require('./models/Message.model')

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on("join_chat", (data) => {
    socket.join(data);
    console.log("User Joined Room: " + data);
  });

  socket.on("send_message", (data) => {
    const { content: {sender, message}, chatId } = data
    let newMessage = {
      sender: sender._id, 
      message: message, 
      conversationId: chatId
    }
    // As the conversation happens, keep saving the messages in the DB
    MessageModel.create(newMessage)
      .then(() => {
        socket.to(data.chatId).emit("receive_message", data.content);
      })
    
  });
});

//---------------------------------------------------------------




// 👇 Start handling routes here
// Contrary to the views version, all routes are controled from the routes/index.js
const allRoutes = require('./routes');
app.use('/api', allRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

const chatRoutes = require('./routes/chat.routes');
app.use('/api', chatRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);



