import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {TabContainer, Tab, Row, Col, NavItem, TabContent, TabPane, Nav} from 'react-bootstrap'
import HomeView from './home-view';
import {connect} from  "react-redux";
import axios from 'axios';
axios.defaults.withCredentials = true;
import {replace, push} from "react-router-redux";

const mapStateToProps = (state) => {
  return {
    user: state.update.user,
    files: state.update.files,
    currentPath: state.update.currentPath
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    handleShowFiles: (userId, currentPath) => {
      console.log('state is userid' + userId);
      axios('http://localhost:3000/api/file/list',{
        method: 'get',
        withCredentials : true,
        headers : {
          currentPath : currentPath
        }
      })
      .then(function (response) {
        if(response.status == 200){
          var files = response.data.result.files;
          console.log(response.data.result);
          dispatch({
            type : "updateFiles",
            userFiles : files
          });
        }else{
          var err = response.data.error;
          console.log('error is ' + err);
          dispatch({type: "error", errorMessage: err.response.data.error});
        }

      })
      .catch(function(err){
        console.log('error is ' + err);
        dispatch({type: "error", errorMessage: err.response.data.error});
      });
    },
    handleLogout: (callback) => {
      axios.get('http://localhost:3000/api/logout')
      .then(function (response) {
        console.log(response.data.result);
        callback();
      });
    },
    handleFileUpload: (currentPath) => {
      var options = {
        withCredentials : true,
        headers: {
          currentpath : currentPath
        }
      }
      var imageFiles = document.querySelector("#files");
      var imgFiles = imageFiles.files;
      for(var file in imgFiles) {
        if(imgFiles.hasOwnProperty(file)) {
          var data = new FormData();
          data.append('files', imgFiles[file]);
          axios.post('http://localhost:3000/api/file/upload',data, options)
          .then(response => {
            console.log(response);
            dispatch({ type: "updateFiles", userFiles: response.data.files});
          })
          .catch(err => {
            console.log(err);
          });
        }

      }
    },
    isLoggedIn: (callback, errCallback) => {
      axios.get('http://localhost:3000/api/login/isLoggedIn')
      .then(function (res) {
        console.log('result is ' + res.data);
        dispatch({
          type : "updateUser",
          user : {
            id: res.response.data.userId
          }
        });
        if(res.status == 200){
          callback();
        }else{
          errCallback();
        }
      })
      .catch(function(err){
        console.log('error is ' + err);
        dispatch({
          type : "updateUser",
          user : {
            id: err.response.data.userId
          }
        });
        errCallback();
      });
    },

    navigateToLogin: () => {
      dispatch(push(
        {pathname : "/login"}
      ));
    }
  };
};


class HomeComponent extends Component {

  showFiles = () => {
    this.props.handleShowFiles(this.props.user.id, this.props.currentPath);
  }

  logout = () => {
    this.props.handleLogout(this.props.navigateToLogin);
  }

  uploadFile = () => {
    this.props.handleFileUpload(this.props.currentPath);
  }

componentWillMount() {
  console.log('Mounting home!!');
  this.props.isLoggedIn(this.props.navigateToHome, this.props.navigateToLogin);
  this.showFiles();
}

  render() {
    console.log(this.props.user);
    const userId = this.props.userId;
    const userFiles = this.props.files;
    if(userFiles){
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
              <a href="" onClick={this.logout}>Signout</a>
              <br/><br/><br/><br/><br/><br/>

              <input type="file" id="files" multiple={true}/>
              <button onClick={this.uploadFile}>Upload</button>
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
  handleLogout    : PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  files: PropTypes.array,
  currentPath: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.func.isRequired,
  navigateToLogin: PropTypes.func.isRequired
};

const Home = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeComponent);

export default Home;
