import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {TabContainer, Tab, Row, Col, NavItem, TabContent, TabPane, Nav} from 'react-bootstrap'
import HomeView from './home-view';
import {connect} from  "react-redux";
import axios from 'axios';
axios.defaults.withCredentials = true;

const mapStateToProps = (state) => {
  return {
    user: state.update.user
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    handleShowFiles: (userId) => {
      console.log('state is userid' + userId);
      axios('http://localhost:3000/api/file/list',{
        method: 'get',
        withCredentials : true,
        params: {
          userid  : userId
        }
      })
      .then(function (response) {
        console.log(response.data.result);
        dispatch({
          type : "updateFiles",
          userFiles : response.data.result
        });
      })
      .catch(function(err){
        console.log('error is ' + err);
        dispatch({type: "error", errorMessage: err.response.data.error});
      });
    }
  };
};


class HomeComponent extends Component {

  showFiles = () => {
    this.props.handleShowFiles(this.props.user.id);
  }

componentWillMount() {
  console.log('Mounting home!!');
  this.showFiles();
  // var state = this.props.history.location.state;
  // if(state){
  //   const userId = this.props.history.location.state.user.id;
  //   this.setState({
  //     userId : userId,
  //     path: "/",
  //     userFiles: this.props.history.location.state.userFiles
  //   });
  // }
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

  render() {
    console.log(this.props.user);
    const userId = this.props.userId;
    const userFiles = this.props.userFiles;
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



HomeComponent.PropTypes = {
  handleShowFiles : PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

const Home = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeComponent);

export default Home;
