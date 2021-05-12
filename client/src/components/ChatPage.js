import axios from 'axios'
import React, { Component } from 'react'
import config from '../config'
import './ChatPage.css'
import io from "socket.io-client";

let socket = ''

class ChatPage extends Component {

    state = {
        loading: true, 
        messageList: [],
        currentMessage: '',
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
                })
            })
        // ensure that the user is connected to a specific chat via webSocket    
        socket.emit("join_chat", conversationId);

        //Handle incoming messages from webSocket
        socket.on("receive_message", (data) => {
            console.log('Got data', data)
            this.setState({
                messageList: [...this.state.messageList, data]
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
        })
    }


    render() {
        const { loading , messageList} = this.state
        const { user } = this.props

        if (loading) {
            <p>Loading all messages . . .</p>
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
                    </div>
                    <div className="messageInputs">
                        <input type="text" placeholder="Message..."
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
