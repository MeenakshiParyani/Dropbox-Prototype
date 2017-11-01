import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from  "react-redux";
import {Button, HelpBlock} from 'react-bootstrap';
import axios from 'axios';
axios.defaults.withCredentials = true;
import {push, replace} from "react-router-redux";

const mapStateToProps = (state) => {
  return {
    user: state.update.user,
    errors: state.update.errors
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleInputChange: (e) => {
      dispatch({type: "loginFormChange", data: {field: e.target.name, value: e.target.value}});
    },
    handleLogin: (email, password) => {
      console.log('state is ' + email + ' ' + password);
      const login = this;
      axios.post('http://localhost:3000/api/login',{
          email  : email,
          password  : password
      })
      .then(function (response) {
        console.log('result is ' + response.data);
        dispatch({
          type : "updateUser",
          user : {
            id: response.data.id,
            email: response.data.email,
            firstname: response.data.firstname,
            password: password
          },
          isLoggedIn : true
        });
        dispatch(push(
          {pathname : "/home"}
        ));
      })
      .catch(function(err){
        console.log('error is ' + err.response.data.error);
        dispatch({type: "error", errorMessage: err.response.data.error, isLoggedIn : false});
      });
    }
  };
};


class LoginComponent extends Component {

  loginUser = () => {
    this.props.handleLogin(this.props.user.email, this.props.user.password);
  }

  render() {
    console.log(this.props.user);
    return (
      <div>
      <form className="form-horizontal" role="form">
              <h2 className="align-left">Login</h2>
              <div className="form-group">
                  <div className="col-sm-9">
                      <input type="email" id="email" name="email" placeholder="Email" value = {this.props.user.email}
                      className="form-control" onChange={this.props.handleInputChange} required/>
                  </div>
              </div>
              <div className="form-group">
                  <div className="col-sm-9">
                      <input type="password" id="password" name="password" placeholder="Password" value = {this.props.user.password}
                      className="form-control" onChange={this.props.handleInputChange} required/>
                  </div>
              </div>
              <div className="form-group">
                    <div className="col-sm-9">
                        <div className="checkbox">
                            <input type="checkbox" id="terms" value="terms" />
                            <label>
                                Remember me
                            </label>
                        </div>
                    </div>
              </div>
              { this.props.errors.length > 0 &&
                <HelpBlock>
                  <p> {this.props.errors[this.props.errors.length - 1]} </p>
                </HelpBlock>
              }
              <div className="form-group">
                  <div className="col-sm-9">
                      <Button bsStyle="primary" bsSize="large" block onClick = {this.loginUser}>Login</Button>
                  </div>
              </div>
              <br/><br/><br/><br/><br/><br/><br/><br/>
          </form>
      </div>
    );
  }

}

LoginComponent.PropTypes = {
  handleLogin : PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired
};

const Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);

export default Login;
