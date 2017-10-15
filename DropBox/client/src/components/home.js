import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {TabContainer, Tab, Row, Col, NavItem, TabContent, TabPane, Nav} from 'react-bootstrap'
import HomeView from './home-view';


class Home extends Component {


  render() {
    console.log(this.props);
    const userId = this.props.history.location.state.user.id;
    const userFiles = this.props.history.location.state.userFiles;
    return (
      <div className = "container-fluid">
      <TabContainer id="left-tabs-example" defaultActiveKey="first">
        <Row className="clearfix">
          <Col sm={2}>
          <br/><br/><br/><br/><br/><br/>
            <Nav bsStyle="pills" stacked>
              <NavItem eventKey="first">
                Home
              </NavItem>
              <NavItem eventKey="second">
                Files
              </NavItem>
            </Nav>
          </Col>
          <Col sm={8}>
            <TabContent animation>
              <TabPane eventKey="first">
                <HomeView userId={userId} userFiles={userFiles}/>
              </TabPane>
              <TabPane eventKey="second">
                Tab 2 content {userId}
              </TabPane>
            </TabContent>
          </Col>
          <Col sm={2}>
            right
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
