  # Socket.io  in MERN Stack

Before implementing, it's important to understand what are are websockets and how they work. 

## Install necessary packages

We will use [socket.io](https://www.npmjs.com/package/socket.io) package on the server side and the  [socket.io-client](https://www.npmjs.com/package/socket.io-client) package on the client side

#### Server side installation
Run this command in your client side terminal
```
npm i socket.io
```

#### Client side installation
Run this command in your client side terminal
```
npm i socket.io-client
```


## Part 1 | Server Code (Express)

### 1.1 Set up Mongoose Models

We will need **two extra models** to use 1:1 chats in our application along with the already defined **User Model** 

A **Conversation** Model and a **Message** Model
On a high level overview, this is how our three models are linked

![](https://imgur.com/J268VIi.png)


You can find the models here

Conversation  Model: [Link](https://gist.github.com/ManishPoduval/f94f93792f5884f1ea642fd6fd958654)
Message Model: [Link](https://gist.github.com/ManishPoduval/85be22b200498f595e5e899d7b939089) 

### 1.2 Set up Chat Routes 

We will need two main routes specifically for chats

 1. **POST** `/conversation` : To create a new conversation between two users when they are ready to chat. 
 2. **GET** `/messages/:conversationId` : To get all the messages of a certain conversation when the chat page loads

Create a new `chat.routes.js` in your routes folder and add the logic for them. Understand, before copy pasting!

You'll find the routes here : [Link](https://gist.github.com/ManishPoduval/a4950bbafa515925d3f2a47a77449e12)

### 1.3 Set up Socket.io 

Now comes the main part. Our socket.io setup will be done in the `server.js` file. 

#### First save the server that is created in a variable

```js
  let myServer = app.listen(PORT, () => {
	    console.log(`Server listening on port http://localhost:${PORT}`);
    });
```
 #### Create the socket io instance

```js
const { Server } = require("socket.io");
const io = new Server(myServer, {
	cors: {
		origin: '*',
	}
});
``` 

#### Set up your connection and Voila! 

```js
io.on('connection', (socket) => {
   // all your 'emits' and 'on' events here
   // your code to add messages in the message model will also be here 
}
```

Do checkout out this link on our server.js file finally looks: [Link](https://gist.github.com/ManishPoduval/c38da1a7311dbabe4d9a52aeed9af652)

Turn up your server and see if everything looks good on the terminal

```
npm run dev
``` 

## Part 2 | Client Code (React)

There's so much to say here, but i'll leave it upto you'll to analyse this component and ask questions. 

ChatPage.js component: [Link](https://gist.github.com/ManishPoduval/76e466c39dd9bc98aa4917edb5f69b69)

The important things to note : 

#### 2 .1 Emit an event to join a room 

```js
socket.emit("join_chat",  conversationId);
``` 

Note: on the server side  we have the `on` event that handles this in `server.js`  (Don't type the code below, it already there in the server side)

```js
socket.on("join_chat", (data) => {
	socket.join(data);
});
```

#### 2.2 Handle events to deal with messages been sent back an forth

```js
socket.on("receive_message", (data) => {
	 //code
	 // here we will get the messages that the other user sends to us. Ensure you update your state here
})
```

Note: on the server side we have the `emit` event that sends us the message (Don't type the code below, it already there in the server side)

```js
// specifically targets a particular chat and emits the data to it
socket.to(data.chatId).emit("receive_message", data.content);
```

#### 2.3   Send messages when the user types in the inputs and sends it

In the event listener of the submit button  we `emit` this web socket event and  

```js
socket.emit("send_message", messageContent);
```

Note: on the server side we have the `on` event that handles the message we type and adds it to the database (Don't type the code below, it already there in the server side)

```js
socket.on("send_message", (data) => {
	// add the data to the database 
	// emit the data to all the people in the chat
})
```

Hope this helps, if it does not, ask us for more explanations :) 

Happy coding! :heart: