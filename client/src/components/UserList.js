import axios from 'axios'
import React, { Component } from 'react'
import config from '../config'

class UserList extends Component {

    handleChatClick = (chatUserId) => {
        const { user } = this.props
        if(!user){
            this.props.history.push('/signin')
        }
        else {
           let data = {
               participants: [chatUserId, user._id]
           }
           axios.post(`${config.API_URL}/api/conversation`, data, {withCredentials: true})
                .then((response) => {
                    this.props.history.push(`/chat/${response.data._id}`)
                })
            
        }
    }

    render() {
        const { users, user } = this.props
        // remove yourself if you're signed in
        let allUsers = users
        if (user) {
            allUsers = users.filter(u => u._id !== user._id)
        }
        return (
            <div>
                {
                    allUsers.map((user) => {
                        return (
                            <p>
                                {user.name} 
                                <button onClick={() => { this.handleChatClick(user._id) }}>
                                   Chat
                                </button>
                            </p>
                        )
                    })
                }
            </div>
        )
    }
}

export default UserList
