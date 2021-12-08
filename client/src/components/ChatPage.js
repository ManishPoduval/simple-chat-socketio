import axios from 'axios'
import React, { createRef, useState, useEffect } from 'react'
import config from '../config'
import './ChatPage.css'
import io from "socket.io-client";
import { Navigate, useParams } from 'react-router-dom';

let socket = ''

function ChatPage(props) {
    // Assing a ref to the messages div
    let messagesEnd = createRef()

    const [loading, setLoading] = useState(true)
    const [messageList, setMessageList] = useState([])
    const [currentMessage, setCurrentMessage] = useState('')
    const {chatId} = useParams()

    const scrollToBottom = () => {
        messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        //setup your socket connection with the server
        socket = io(`${config.API_URL}`);

        const getMessages = async () => {
            let response  = await axios.get(`${config.API_URL}/api/messages/${chatId}`)
            setLoading(false)
            setMessageList(response.data)

            // ensure that the user is connected to a specific chat via webSocket    
            socket.emit("join_chat", chatId);

            //Handle incoming messages from webSocket
            socket.on("receive_message", (data) => {
                console.log('Got data', data)
                setMessageList(data)
            });   

        }

        getMessages()

    }, [])

    useEffect(() => {
        // makes the chat scroll to the bottom everytime a new message is sent or received
        scrollToBottom();
    }, [messageList])

    const handleMessageInput = (e) => {
        setCurrentMessage( e.target.value )
    }

    const sendMessage = async () => {
        // Create the object structure
        let messageContent = {
            chatId, 
            content: {
              sender: props.user,
              message: currentMessage,
            },
          };
          
          // emit it so that everyone connected to the same chat receives the message
        await socket.emit("send_message", messageContent);
        setMessageList( [...messageList, messageContent.content])
        setCurrentMessage('')
    }

    const { user } = props
    if (loading) {
        <p>Loading all messages . . .</p>
    }
    if(!user){
        return <Navigate to={'/signin'}  />
    }
    return (
        <div>
            <h3>You're in the Chat Page </h3>
            <div className="chatContainer">
                <div className="messages">
                    {
                        messageList.map((val) => {
                            return (
                                <div key={val._id} className="messageContainer" id={val.sender.name == user.name ?"You" : "Other"}>
                                    <div className="messageIndividual">
                                        {val.sender.name}: {val.message}
                                    </div>
                                </div>
                            );
                        })
                    }
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { messagesEnd = el; }}>
                    </div>
                </div>
                <div className="messageInputs">
                    <input value={currentMessage} type="text" placeholder="Message..."
                        onChange={handleMessageInput}
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    )
}


export default ChatPage
