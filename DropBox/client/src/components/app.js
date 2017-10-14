import React, { Component } from 'react';
import Signup from './signup';
import Login from './login';
import Landing from './landing';
import {Button} from 'react-bootstrap';


export default class App extends Component {

  render() {
    return (
      <div className = "container-fluid">
        <div className="row">
          <div className="col-md-6">< Landing /></div>
          <div className="col-md-6">< Signup /></div>
        </div>
      </div>
    );
  }
}
