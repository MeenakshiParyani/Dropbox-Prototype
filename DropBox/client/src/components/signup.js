import React, { Component } from 'react';
import {Button, HelpBlock} from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';
import {push} from "react-router-redux";
import {connect} from  "react-redux";

const mapStateToProps = (state) => {
  return {
    user: state.update.user,
    errors: state.update.errors
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleInputChange: (e) => {
      dispatch({type: "signupFormChange", data: {field: e.target.name, value: e.target.value}});
    },
    signUp: (e) => {
      e.preventDefault();
      console.log('state is ' + JSON.stringify(this.state));
      const {firstname, lastname, email, password} = this.props.user;
      console.log('state is ' + firstname + ' ' + lastname + ' ' + email + ' ' + password);
      axios.post('http://localhost:3000/api/signup',{
        data: {
          firstName : firstname,
          lastName  : lastname,
          email     : email,
          password  : password
        }
      })
      .then(function (response) {
        console.log('result is ' + response.data.result);
        dispatch({
          type : "updateUser",
          user : {
            email: response.data.email,
            firstname: response.data.firstname,
            lastname: response.data.lastname,
            password: password
          },
          success: true,
          errors: []
        });
      })
      .catch(function(err){
        console.log('error is ' + err);
        dispatch({
          type : "error",
          success: false,
          errorMessage: err.response.data.error
        });
      });
    },

    isLoggedIn: (callback) => {
      axios.get('http://localhost:3000/api/login/isLoggedIn')
      .then(function (response) {
        console.log('result is ' + response.data);
        if(response.status == 200){
          dispatch({
            type : "updateUser",
            user : {
              id: response.data.userId
            }
          });
          callback();
        }
      })
      .catch(function(err){
        console.log('error is ' + err);
        dispatch({
          type : "error",
          isLoggedIn: err.response.data.isLoggedIn
        });
      });
    },

    navigateToHome: () => {
      dispatch(replace(
        {pathname : "/home"}
      ));
    }
  };
};

class SignupComponent extends Component {

  componentWillMount(){
    this.props.isLoggedIn(this.props.navigateToHome);
  }

  render() {

    return (
      <div className="signup">
      <form className="form-horizontal signup-form" role="form" onSubmit={ (e) => this.signUp(e) } >
              <h2 className="align-left">Sign Up <span><a className="signin" href="/login">Sign In</a></span></h2>
              <div className="form-group">
                  <div className="col-sm-9">
                      <input type="text" id="firstName" placeholder="First Name" value = {this.props.user.firstname}
                      className="form-control"  onChange={this.props.handleInputChange} required autoFocus={true}/>
                  </div>
              </div>
              <div className="form-group">
                  <div className="col-sm-9">
                      <input type="text" id="lastName" placeholder="Last Name" value = {this.props.user.lastname}
                      className="form-control" onChange={this.props.handleInputChange} required/>
                  </div>
              </div>
              <div className="form-group">
                  <div className="col-sm-9">
                      <input type="email" id="email" placeholder="Email" value = {this.props.user.email}
                      className="form-control" onChange={this.props.handleInputChange} required/>
                  </div>
              </div>
              <div className="form-group">
                  <div className="col-sm-9">
                      <input type="password" id="password" placeholder="Password" value = {this.props.user.password}
                      className="form-control" onChange={this.props.handleInputChange} required/>
                  </div>
              </div>
              <div className="form-group">
                    <div className="col-sm-9">
                        <div className="checkbox">
                            <input type="checkbox" id="terms" value="terms" />
                            <label>
                                Agree to Dropbox Terms
                            </label>
                        </div>
                    </div>
              </div>
              {this.props.errors[0] &&
                <HelpBlock>
                  <p> {this.props.error[this.props.errors.length-1]} </p>
                </HelpBlock>
              }
              {this.props.success &&
                <HelpBlock>
                  <p> Sign up completed, use sign in to use the app</p>
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


SignupComponent.PropTypes = {
  user: PropTypes.object.isRequired,
  errors: PropTypes.array,
  handleInputChange: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.func.isRequired,
  navigateToHome: PropTypes.func.isRequired
};

const Signup = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupComponent);

export default Signup;
