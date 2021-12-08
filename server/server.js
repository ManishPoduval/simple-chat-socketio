const app = require("./app");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 5005;

let myServer = app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});


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
      .then(async () => {
        //Find all messages and send it back
        let allMessages = await MessageModel.find({conversationId: chatId}).populate('sender')
        socket.to(data.chatId).emit("receive_message", allMessages);
      })
    
  });
});

//---------------------------------------------------------------

