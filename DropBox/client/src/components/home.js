import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {TabContainer, Tab, Row, Col, NavItem, TabContent, TabPane, Nav} from 'react-bootstrap'
import HomeView from './home-view';
import axios from 'axios';
axios.defaults.withCredentials = true;


class Home extends Component {

  constructor(props){
    super(props);
    this.state = {
      userId    : null,
      path      : '/',
      userFiles : []
    };
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

componentWillMount() {
  // get list of files
  this.props.getFilesList();

  var state = this.props.history.location.state;
  if(state){
    const userId = this.props.history.location.state.user.id;
    this.setState({
      userId : userId,
      path: "/",
      userFiles: this.props.history.location.state.userFiles
    });
  }
}
  // Component method
handleFileUpload() {
  var home = this;
  var options = {
    withCredentials : true,
    headers : {
    path: home.state.path,
    userid: home.state.userId
  }}

  var imageFiles = document.querySelector("#files");
  var imgFiles = imageFiles.files;
  for(var file in imgFiles) {
    if(imgFiles.hasOwnProperty(file)) {
      var data = new FormData();
      data.append('files', imgFiles[file]);
      axios.post('http://localhost:3000/api/file/upload',data, options)
      .then(response => {
        console.log(response);
        home.setState({
          userFiles : response.data.files
        });
      })
      .catch(err => {
        console.log(err);
      });
    }

  }
  }

  handleLogout(event){
    var home = this;
    event.preventDefault();
    axios.get('http://localhost:3000/api/logout')
    .then(function (response) {
      console.log(response.data.result);
      home.setState({
        userId    : null,
        path      : '/',
        userFiles : []
      });
      home.props.history.replace({
        pathname      : '/login',
        state         : home.state
      });
    });

  }

  componentWillReceiveProps(nextProps){
    // this.handleInputChange({'userId' : nextProps.userId, 'path' : nextProps.path});
  }

  render() {
    console.log(this.props);
    const userId = this.state.userId;
    const userFiles = this.state.userFiles;
    if(userId){
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
              <a href="#" onClick={this.handleLogout}>Signout</a>
              <br/><br/><br/><br/><br/><br/>

              <input type="file" id="files" multiple={true}/>
              <button onClick={this.handleFileUpload}>Upload</button>
            </Col>
          </Row>
        </TabContainer>
        </div>
      );
    }else{
      return (
        <div>
             &nbsp;Unauthorized access
        </div>
      );
    }

  }
}



Home.PropTypes ={
  state : PropTypes.object
}


export default withRouter(Home)
