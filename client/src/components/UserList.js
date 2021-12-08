import axios from 'axios'
import config from '../config'
import {useNavigate} from 'react-router-dom'

function UserList(props) {

    const navigate = useNavigate()

    const handleChatClick = (chatUserId) => {
        const { user } = props
        if(!user){
            navigate('/signin')
            return; 
        }
        else {
           let data = {
               participants: [chatUserId, user._id]
           }
           axios.post(`${config.API_URL}/api/conversation`, data, {withCredentials: true})
                .then((response) => {
                    navigate(`/chat/${response.data._id}`)
                })
            
        }
    }

    const { users, user } = props
    
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
                            <button onClick={() => { handleChatClick(user._id) }}>
                               Chat
                            </button>
                        </p>
                    )
                })
            }
        </div>
    )
}

export default UserList
