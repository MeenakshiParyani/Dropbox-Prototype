import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'
import {PageHeader, Grid, Row, Col} from 'react-bootstrap'

class HomeView extends Component {

  getUserFiles() {
    console.log(this.props.userId);
  }

  render() {
    // this.getUserFiles();
    return (
      <div className = "container-fluid">
          <PageHeader className="header"><h3>Home</h3></PageHeader>
          <Grid>
            <Row>
              hi
            </Row>
            <Row key="count"
                 style={{float: 'right', paddingRight: '50px'}} >
              <div key="description">
               hi1
              </div>
            </Row>
            <Col style={{maxWidth: '225px'}}
                 xs={12} sm={6} md={2} lg={2}>
              hi2
            </Col>
            <Col xs={12} sm={6} md={10} lg={10}>
              hi3
            </Col>
          </Grid>
      </div>
    );
  }
}


HomeView.PropTypes = {
  userId : PropTypes.string
}

export default withRouter(HomeView)
