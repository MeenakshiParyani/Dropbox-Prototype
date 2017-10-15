import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'
import {TabContainer, Tab, Row, Col, NavItem, TabContent, TabPane, Nav} from 'react-bootstrap'

class Home extends Component {

  render() {
    console.log(this.props);
    return (
      <div className = "container-fluid">
      <TabContainer id="left-tabs-example" defaultActiveKey="first">
        <Row className="clearfix">
          <Col sm={4}>
            <Nav bsStyle="pills" stacked>
              <NavItem eventKey="first">
                Tab 1
              </NavItem>
              <NavItem eventKey="second">
                Tab 2
              </NavItem>
            </Nav>
          </Col>
          <Col sm={8}>
            <TabContent animation>
              <TabPane eventKey="first">
                Tab 1 content
              </TabPane>
              <TabPane eventKey="second">
                Tab 2 content
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </TabContainer>
      </div>
    );
  }
}

Home.PropTypes ={
  state : PropTypes.object
}


export default withRouter(Home)
