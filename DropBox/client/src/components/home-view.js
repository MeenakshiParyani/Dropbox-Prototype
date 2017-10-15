import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'
import {PageHeader} from 'react-bootstrap'

class HomeView extends Component {

  render() {
    return (
      <div className = "container-fluid">
          <PageHeader className="header"><h3>Home</h3></PageHeader>
      </div>
    );
  }
}




export default withRouter(HomeView)
