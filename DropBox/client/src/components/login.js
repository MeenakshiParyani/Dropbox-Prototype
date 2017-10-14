import React, { Component } from 'react';
import {Button, HelpBlock} from 'react-bootstrap';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Login extends Component {

  constructor(props){
    super(props);
    console.log(this);
  }

  state = {
    email      : null,
    password   : null,
    isLoggedIn : false,
    error      : ''
  }

  login(e){
    e.preventDefault();
    console.log('state is ' + JSON.stringify(this.state));
    const { email, password } = this.state;
    console.log('state is ' + email + ' ' + password);
    const login = this;
    axios.get('http://localhost:3000/api/login',{
      params: {
        email  : email,
        password  : password
      }
    })
    .then(function (response) {
      console.log('result is ' + response.data.result);
      login.handleInputChange({
        isLoggedIn : true,
        error   : ''
      });
      login.displayHome();
    })
    .catch(function(err){
      console.log('error is ' + err.response.data.error);
      login.handleInputChange({
        isLoggedIn : false,
        error : err.response.data.error
      });
    });
  }

  displayHome(){
    this.props.history.push('/home');
    console.log(this.props.router);
  }


  handleInputChange(newPartialInput) {
    this.setState(state => ({
        ...state,
        ...newPartialInput
    }))
  }



  render() {
    return (
      <div>
      <form className="form-horizontal" role="form" onSubmit={ (e) => this.login(e) } >
              <h2 className="align-left">Login</h2>
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
                                <input type="checkbox" id="terms" value="terms">Remember me</input>
                            </label>
                        </div>
                    </div>
              </div>
              { this.state.error &&
                <HelpBlock>
                  <p> {this.state.error} </p>
                </HelpBlock>
              }
              <div className="form-group">
                  <div className="col-sm-9">
                      <Button type="submit" bsStyle="primary" bsSize="large" block>Login</Button>
                  </div>
              </div>
              <br/><br/><br/><br/><br/><br/><br/><br/>
          </form>
      </div>
    );
  }

}

export default withRouter(Login)
