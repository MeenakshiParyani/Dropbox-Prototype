import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import Calculator from './components/calculator';
import reducers from './reducers';

ReactDOM.render(<Calculator />, document.querySelector('.container'));
