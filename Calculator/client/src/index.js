import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import Calculator from './components/calculator';
import reducers from './reducers';

ReactDOM.render(
  <div id="wrapper">
    <Calculator />
  </div> , document.querySelector('.container'));
