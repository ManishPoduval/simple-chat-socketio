import axios from 'axios'
import React, { Component } from 'react'
import config from '../config'
import './ChatPage.css'
import io from "socket.io-client";
import { Redirect } from 'react-router-dom';

let socket = ''

class ChatPage extends Component {
    // Assing a ref to the messages div
    messagesEnd = React.createRef()
    state = {
        loading: true, 
        messageList: [],
        currentMessage: '',
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount(){
        //setup your socket connection with the server
        socket = io(`${config.API_URL}`);

        let conversationId = this.props.match.params.chatId
        axios.get(`${config.API_URL}/api/messages/${conversationId}`)
            .then((response) => {
                this.setState({
                    loading: false, 
                    messageList: response.data
                }, () => {
                    this.scrollToBottom();
                })
            })
        // ensure that the user is connected to a specific chat via webSocket    
        socket.emit("join_chat", conversationId);

        //Handle incoming messages from webSocket
        socket.on("receive_message", (data) => {
            console.log('Got data', data)
            this.setState({
                messageList: [...this.state.messageList, data]
            }, () => {
                this.scrollToBottom();
            })
        });    
    }

    handleMessageInput = (e) => {
        this.setState({
            currentMessage: e.target.value
        })
    }

    sendMessage = async () => {
        // Create the object structure
        let messageContent = {
            chatId: this.props.match.params.chatId,
            content: {
              sender: this.props.user,
              message: this.state.currentMessage,
            },
          };
          
          // emit it so that everyone connected to the same chat receives the message
        await socket.emit("send_message", messageContent);
        this.setState({
            messageList: [...this.state.messageList, messageContent.content],
            currentMessage: ''
        }, () => {
            this.scrollToBottom();
        })
    }


    render() {
        const { loading , messageList} = this.state
        const { user } = this.props

        if (loading) {
            <p>Loading all messages . . .</p>
        }

        if(!user){
            return <Redirect to={'/signin'}  />
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
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </div>
                    <div className="messageInputs">
                        <input value={this.state.currentMessage} type="text" placeholder="Message..."
                            onChange={this.handleMessageInput}
                        />
                        <button onClick={this.sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChatPage
