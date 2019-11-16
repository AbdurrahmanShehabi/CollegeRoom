import React, { Component } from 'react'
import { register } from './UserFunctions'

class Register extends Component {
  constructor() {
    super()
    this.state = {
        email: '',
        password: '',
        firstName:'',
        lastName:'',
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

    const newUser = {
      email: this.state.email,
      password: this.state.password,
      firstName:this.state.firstName,
      lastName:this.state.lastName
      
    }

    register(newUser).then(res => {
      this.props.history.push(`/login`)
    })
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Register</h1>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="firstName"
                  className="form-control"
                  name="firstName"
                  placeholder="First Name"
                  value={this.state.firstName}
                  onChange={this.onChange}
                />
              </div><div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="lastName"
                  className="form-control"
                  name="lastName"
                  placeholder="Last Name"
                  value={this.state.lastName}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter email"
                  value={this.state.email}
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
                Register!
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Register