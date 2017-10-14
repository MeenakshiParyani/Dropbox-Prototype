import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {Router, Route, hashHistory } from "react-router";

import App from './components/app';
import Login from './components/login';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware()(createStore);

ReactDOM.render(
  <Router>
    <Route path="/" component={App} />
    <Route path="/login" component={Login} />
  </Router>
  , document.querySelector('.container'));
