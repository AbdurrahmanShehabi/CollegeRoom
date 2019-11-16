import React, { Component } from 'react'
import { login } from './UserFunctions'

class Login extends Component {
  constructor() {
    super()
    this.state = {
      userid: '',
      password: '',
      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault()

    const user = {
      userid: this.state.userid,
      password: this.state.password
    }

   login(user).then(res => {
    //  if (!res.error) {
    //    this.props.history.push(`http://localhost:5000/api/profile`)
    //  }
          console.log()
     })
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
              <div className="form-group">
                <label htmlFor="userid">Email address</label>
                <input
                  type="userid"
                  className="form-control"
                  name="userid"
                  placeholder="Enter email"
                  value={this.state.userid}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Sign in
              </button>         
                     Hello I am Ronnie Ver.2    
                <a href="register" class="btn btn-info btn-lg active btn-block" role="button" aria-pressed="true">Register</a>
  
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login