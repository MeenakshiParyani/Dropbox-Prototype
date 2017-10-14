import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter as Router, Route, Link, hashHistory, Switch } from 'react-router-dom'

import App from './components/app';
import Login from './components/login';
import Home from './components/home';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware()(createStore);

ReactDOM.render(
  <Router history={hashHistory}>
    <Switch>
      <Route exact path="/" component={App}/>
      <Route exact path="/login" component={Login}/>
      <Route exact path="/Home" component={Home}/>
    </Switch>
  </Router>
  , document.querySelector('.container1'));
