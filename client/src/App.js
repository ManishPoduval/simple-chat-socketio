import React, { useState, useEffect } from 'react'
import {Route, Routes, useNavigate} from 'react-router-dom'
import UserList from './components/UserList'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import axios from 'axios'
import config from './config'
import MyNav from './components/MyNav'
import 'bootstrap/dist/css/bootstrap.min.css'
import ChatPage from './components/ChatPage'

function App() {

  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
      const getUsers = async () => {
        let response = await axios.get(`${config.API_URL}/api/users`, {withCredentials: true})
        setUsers(response.data)

        try{
          let userResponse = await axios.get(`${config.API_URL}/api/user`, {withCredentials: true})
          setUser(userResponse.data)
          setLoading(false)
        }
        catch(err){
          setLoading(false)
        }
      }
      getUsers()
  }, [])

  useEffect(() => {
    navigate('/')
  }, [user])

  const handleLogout = async () => {
    await axios.post(`${config.API_URL}/api/logout`, {}, {withCredentials: true})
    setUser(null)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    const {username, email , password} = e.target
    let newUser = {
      username: username.value, 
      email: email.value, 
      password: password.value
    }
    
    let response  = await axios.post(`${config.API_URL}/api/signup`, newUser, {withCredentials: true})
    setUsers([response.data, ...users])
    setUser(response.data)
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    const { email , password} = e.target
    let newUser = {
      email: email.value, 
      password: password.value
    }

    let response  =await axios.post(`${config.API_URL}/api/signin`, newUser, {withCredentials: true})
    setUser(response.data)
  }


  if(loading) {
    return <p>Loading user . . .</p>
  }

  return (
    <div>
        <h1>Socket.io example</h1>
        <MyNav onLogout={handleLogout} user={user}  />
        <Routes>
            <Route path='/' element={<UserList users={users} user={user} />}/>
            <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />}/>
            <Route path="/signup"  element={<SignUp onSubmit={handleSignUp} />}/>
            <Route path="/chat/:chatId"  element={ <ChatPage user={user} />}/>
        </Routes>
      </div>
  )
}


export default App