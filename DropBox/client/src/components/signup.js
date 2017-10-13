import React, { Component } from 'react';

export default class Signup extends Component {
  render() {
    return (
      <div className="signup">
      <form className="form-horizontal signup-form" role="form">
              <h2>Sign Up</h2>
              <div className="form-group">
                  <div className="col-sm-9">
                      <input type="text" id="firstName" placeholder="First Name" className="form-control" autofocus/>
                  </div>
              </div>
              <div className="form-group">
                  <div className="col-sm-9">
                      <input type="text" id="lastName" placeholder="Last Name" className="form-control"/>
                  </div>
              </div>
              <div className="form-group">
                  <div className="col-sm-9">
                      <input type="email" id="email" placeholder="Email" className="form-control"/>
                  </div>
              </div>
              <div className="form-group">
                  <div className="col-sm-9">
                      <input type="password" id="password" placeholder="Password" className="form-control"/>
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
                <div className="form-group">
                    <div className="col-sm-9 col-sm-offset-3">
                        <button type="submit" className="btn btn-primary btn-block btn-sign">Sign up</button>
                    </div>
                </div>
              <br/><br/><br/><br/><br/><br/><br/><br/>
          </form>
      </div>
    );
  }
}
