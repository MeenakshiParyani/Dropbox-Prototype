import React, { Component } from 'react';
import Signup from './signup';
import Landing from './landing';

export default class App extends Component {
  render() {
    return (
      <div class = "container">
        < Landing />
        < Signup />
      </div>
    );
  }
}
