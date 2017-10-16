import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {TabContainer, Tab, Row, Col, NavItem, TabContent, TabPane, Nav} from 'react-bootstrap'
import HomeView from './home-view';
import axios from 'axios';


class Home extends Component {

  constructor(props){
      super(props);
      this.state = {
        userFiles : [],
        userId    : null
      };
  }

  // Component method
handleFileUpload(e) {

  var options = {
    headers : {
    path: "",
    userid: 100
  }}

  var imageFiles = document.querySelector("#files");
  var imgFiles = imageFiles.files;
  for(var file in imgFiles) {
    if(imgFiles.hasOwnProperty(file)) {
      var data = new FormData();
      data.append('files', imgFiles[file]);
      axios.post('http://localhost:3000/api/file/upload',data, {

      })
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
    }

  }
  }



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
            <br/><br/><br/><br/><br/><br/>

            <input type="file" id="files" multiple={true}/>
            <button onClick={this.handleFileUpload}>Upload</button>
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
