  
import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Landing from './components/Landing'
import Login from './components/Login'
import Register from './components/Register'

function App() {
          return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </div>
        </div>
      </Router>
    )

}

export default App