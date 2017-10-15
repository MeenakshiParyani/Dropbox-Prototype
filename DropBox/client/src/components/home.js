import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'

class Home extends Component {

  render() {
    console.log(this.props);
    return (
      <div className = "container-fluid">
        MY HOME!!
      </div>
    );
  }
}

Home.PropTypes ={
  state : PropTypes.object
}


export default withRouter(Home)
