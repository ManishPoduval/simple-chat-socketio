import React, { Component } from 'react'
import {Redirect, Route, Switch, withRouter} from 'react-router-dom'
import UserList from './components/UserList'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import axios from 'axios'
import config from './config'
import MyNav from './components/MyNav'
import 'bootstrap/dist/css/bootstrap.min.css'
import ChatPage from './components/ChatPage'

class App extends Component {

  state = {
    users: [],
    user: null, 
    loading: true, 
  }

  componentDidMount(){
    axios.get(`${config.API_URL}/api/users`, {withCredentials: true})
      .then((response) => {
        this.setState({
          users: response.data
        })
      })
    
    axios.get(`${config.API_URL}/api/user`, {withCredentials: true}) 
      .then((response) => {
        this.setState({ 
          user: response.data,
          loading: false,
        })
      })
      .catch((errorObj) => {
        this.setState({
          error: errorObj.response.data,
          loading: false,
        })
      })
  }

  handleLogout = () => {
    axios.post(`${config.API_URL}/api/logout`, {}, {withCredentials: true})
      .then(() => {
        this.setState({
          user: null
        }, () => {
          this.props.history.push('/')
        })
      })
      .catch((errorObj) => {
        // the real error json is always is the .response.data 
        this.setState({
          error: errorObj.response.data
        })
    })
  }

  handleSignUp = (e) => {
    e.preventDefault()
    const {username, email , password} = e.target
    let newUser = {
      username: username.value, 
      email: email.value, 
      password: password.value
    }
    
    axios.post(`${config.API_URL}/api/signup`, newUser, {withCredentials: true})
      .then((response) => {
        //the real data is always in response.data
          this.setState({
            user: response.data,
            users: [response.data, ...this.state.users]
          }, () => {
              //Redirect after the user info has been fetched
              this.props.history.push('/')
          })
      })
      .catch(() => {
        console.log('SignUp failed')
      })
  }

  handleSignIn = async (e) => {
    e.preventDefault()
    const { email , password} = e.target
    let newUser = {
      email: email.value, 
      password: password.value
    }

    axios.post(`${config.API_URL}/api/signin`, newUser, {withCredentials: true})
      .then((response) => {
        this.setState({
          user: response.data,
          error: null
        }, () => {
          this.props.history.push('/')
        })
      })
      .catch((errorObj) => {
        this.setState({
          error: errorObj.response.data
        })
      })
  }

  render() {
    const { users, loading, user} = this.state
    if(loading) {
      return <p>Loading user . . .</p>
    }

    return (
      <div>
        <h1>Socket.io example</h1>
        <MyNav onLogout={this.handleLogout} user={user}  />
        <Switch>
            <Route exact path='/' render={(routeProps) => {
              return <UserList users={users} user={user}  {...routeProps}  />
            }} />
            <Route  path="/signin"  render={(routeProps) => {
              return  <SignIn  onSignIn={this.handleSignIn}  {...routeProps}  />
            }}/>
            <Route  path="/signup"  render={(routeProps) => {
              return  <SignUp onSubmit={this.handleSignUp} {...routeProps}  />
            }}/>
            <Route  path="/chat/:chatId"  render={(routeProps) => {
              return  <ChatPage user={user} {...routeProps}  />
            }}/>
        </Switch>
      </div>
    )
  }
}

export default withRouter(App)