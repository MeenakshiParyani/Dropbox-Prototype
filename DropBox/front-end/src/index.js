import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Route } from 'react-router';
import  createHistory from 'history/createBrowserHistory';
import {routerMiddleware} from 'react-router-redux';
import {ConnectedRouter} from 'react-router-redux';
import thunk from "redux-thunk";

import App from './components/app';
import Login from './components/login';
import Home from './components/home';
import createReducers from './reducers';

function createRouterMiddleWare(history) {
  const routerMw = routerMiddleware(history);
  return routerMw;
}

const history = createHistory();
const middleWares = [createRouterMiddleWare(history), thunk];
const store = createStore(
  createReducers(),
  applyMiddleware(...middleWares)
);

const LoginWrapper = (props) => <Login {...props} />;
const HomeWrapper = (props) => <Home {...props} />;
const AppWrapper = (props) => <App {...props} />;

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Route exact path="/" component={AppWrapper} />
        <Route exact path="/login" component={LoginWrapper}/>
        <Route exact path="/home" component={HomeWrapper}/>
      </div>
    </ConnectedRouter>
  </Provider>
  , document.querySelector('.container1'));
