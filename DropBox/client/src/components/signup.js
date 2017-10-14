import React, { Component } from 'react';
import {Button, HelpBlock} from 'react-bootstrap';
import axios from 'axios';

export default class Signup extends Component {

  state = {
    firstName : null,
    lastName  : null,
    email     : null,
    password  : null,
    error     : ''
  }

  signUp(e){
    e.preventDefault();
    console.log('state is ' + JSON.stringify(this.state));
    const {firstName, lastName, email, password} = this.state;
    console.log('state is ' + firstName + ' ' + lastName + ' ' + email + ' ' + password);
    const signUp = this;
    axios.get('http://localhost:3000/api/signup',{
      params: {
        firstName : firstName,
        lastName  : lastName,
        email     : email,
        password  : password
      }
    })
    .then(function (response) {
      console.log('result is ' + response.data.result); 
    })
    .catch(function(response){
      console.log('result is ' + response.response.data.error);
      signUp.handleInputChange({
        error : response.response.data.error
      });
    });
  }


  handleInputChange(newPartialInput) {
    this.setState(state => ({
        ...state,
        ...newPartialInput
    }))
  }



  render() {
    return (
      <div className="signup">
      <form className="form-horizontal signup-form" role="form" onSubmit={ (e) => this.signUp(e) } >
              <h2 className="align-left">Sign Up</h2>
              <div className="form-group">
                  <div className="col-sm-9">
                      <input type="text" id="firstName" placeholder="First Name" value = {this.state.firstName}
                      className="form-control"  onChange={e => this.handleInputChange({firstName: e.target.value})} required autofocus/>
                  </div>
              </div>
              <div className="form-group">
                  <div className="col-sm-9">
                      <input type="text" id="lastName" placeholder="Last Name" value = {this.state.lastName}
                      className="form-control" onChange={e => this.handleInputChange({lastName: e.target.value})} required/>
                  </div>
              </div>
              <div className="form-group">
                  <div className="col-sm-9">
                      <input type="email" id="email" placeholder="Email" value = {this.state.email}
                      className="form-control" onChange={e => this.handleInputChange({email: e.target.value})} required/>
                  </div>
              </div>
              <div className="form-group">
                  <div className="col-sm-9">
                      <input type="password" id="password" placeholder="Password" value = {this.state.password}
                      className="form-control" onChange={e => this.handleInputChange({password: e.target.value})} required/>
                  </div>
              </div>
              <div className="form-group">
                    <div className="col-sm-9">
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" id="terms" value="terms">Agree to Dropbox Terms</input>
                            </label>
                        </div>
                    </div>
              </div>
              {this.state.error &&
                <HelpBlock>
                  <p> {this.state.error} </p>
                </HelpBlock>
              }
              <div className="form-group">
                  <div className="col-sm-9">
                      <Button type="submit" bsStyle="primary" bsSize="large" block>Sign up</Button>
                  </div>
              </div>
              <br/><br/><br/><br/><br/><br/><br/><br/>
          </form>
      </div>
    );
  }
}
