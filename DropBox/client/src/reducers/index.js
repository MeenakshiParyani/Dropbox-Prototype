import { combineReducers } from 'redux';
import {routerReducer} from "react-router-redux";
import update from "./main-reducer";

function appReducers() {
  return {
    update : update
  };

}

export default function createReducers() {
  const allReducers = combineReducers({
    ...appReducers(),
    router: routerReducer
  });
  const rootReducer = (state, action) => {
    return allReducers(state, action);
  }
  return rootReducer;
}
