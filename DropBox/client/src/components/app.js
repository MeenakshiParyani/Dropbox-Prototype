import React, { Component } from 'react';
import {connect} from  "react-redux";

import Signup from './signup';
import Login from './login';
import Landing from './landing';
import {Button} from 'react-bootstrap';


const mapStateToProps = (state) => {
  return {
    state: state
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleClick: () => {
      dispatch({type: "update", data: []});
    }
  };
};



class AppContainer extends Component {

  render() {
    return (
      <div className = "container-fluid1">
        <div className="row row1">
          <div className="col-md-8">< Landing /></div>
          <div className="col-md-4">< Signup /></div>
        </div>
      </div>
    );
  }
}

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
export default App;
