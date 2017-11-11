import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {TabContainer, Tab, Row, Col, NavItem, TabContent, TabPane, Nav} from 'react-bootstrap'
import HomeView from './home-view';
import {connect} from  "react-redux";
import axios from 'axios';
axios.defaults.withCredentials = true;
import {replace, push} from "react-router-redux";
import Modal from 'react-modal';
import {Button} from 'react-bootstrap';

const mapStateToProps = (state) => {
  return {
    user: state.update.user,
    files: state.update.files,
    currentPath: state.update.currentPath,
    createFolderActive: state.update.createFolderActive,
    newFolderName: state.update.newFolderName
  };
};


const mapDispatchToProps = (dispatch) => {
  return {

    handleInputChange: (e) => {
      console.log('updating ' + e.target.name + ' to ' + e.target.value);
      dispatch({type: "createNewFolder", newFolderName: e.target.value});
    },
    handleShowFiles: (currentPath) => {
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
    },
    handleCreateNewFolder: (currentPath, folderName, isActive) => {
      axios('http://localhost:3000/api/file/newFolder',{
        method: 'post',
        withCredentials : true,
        headers : {
          currentPath : currentPath,
          folderName : folderName
        }
      })
      .then(function (response) {
        if(response.status == 200){
          var files = response.data.result;
          console.log(response.data.result);
          dispatch({
            type : "updateFiles",
            userFiles : files
          });
          dispatch({type: "toggleCreateFolderModal", createFolderActive: !isActive});
        }else{
          var err = response.data.error;
          console.log('error is ' + err);
          dispatch({type: "error", errorMessage: err.response.data.error});
          dispatch({type: "toggleCreateFolderModal", createFolderActive: !isActive});
        }

      })
      .catch(function(err){
        console.log('error is ' + err);
        dispatch({type: "error", errorMessage: err.response.data.error});
      });
    },

    toggleCreateFolderModal: (isActive) => {
      console.log(' create folder modal is active ? ' + isActive );
      dispatch({type: "toggleCreateFolderModal", createFolderActive: !isActive});
    }
  };
};


class HomeComponent extends Component {

  showFiles = () => {
    this.props.handleShowFiles(this.props.currentPath);
  }

  logout = () => {
    this.props.handleLogout(this.props.navigateToLogin);
  }

  uploadFile = () => {
    this.props.handleFileUpload(this.props.currentPath);
  }

  createNewFolder = () => {
    this.props.handleCreateNewFolder(this.props.currentPath, this.props.newFolderName, this.props.createFolderActive);
  }

  componentWillMount() {
    console.log('Mounting home!!');
    Modal.setAppElement('body');
    this.props.isLoggedIn(this.props.navigateToHome, this.props.navigateToLogin);
    this.showFiles();
  }

  toggleCreateFolderModal = () => {
    this.props.toggleCreateFolderModal(this.props.createFolderActive);
  }

  modalStyle = {
    overlay : {
      position          : 'fixed',
      top               : 100,
      left              : 400,
      right             : 550,
      bottom            : 350,
      backgroundColor   : 'rgba(255, 255, 255, 0.75)'
    },
    content : {
      position                   : 'absolute',
      top                        : '40px',
      left                       : '40px',
      right                      : '40px',
      bottom                     : '40px',
      border                     : '1px solid #ccc',
      background                 : '#fff',
      overflow                   : 'auto',
      WebkitOverflowScrolling    : 'touch',
      borderRadius               : '4px',
      outline                    : 'none',
      padding                    : '20px'

    }
  };

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
              <a href="" className="signout" onClick={this.logout}>Signout</a>
              <br/><br/><br/><br/><br/><br/>
              <div className="fileinput fileinput-new" data-provides="fileinput">
                <span className="btn btn-default btn-file btn-primary btn-block"><span>Upload files</span><input type="file" id="files" onChange={this.uploadFile}/></span>
                <span className="fileinput-filename"></span>
            </div>
            <br/>
              <button className="btn btn-default btn-file btn-block" onClick={this.toggleCreateFolderModal}>New Shared Folder</button>
              <Modal isOpen={this.props.createFolderActive} onRequestClose={this.toggleCreateFolderModal}
                     closeButton={true} style={this.modalStyle} modalTransition={{ timeout: 20 }}
                     backdropTransition={{ timeout: 10 }}>
              <button className="close-button" data-close aria-label="Close modal" type="button" onClick={this.toggleCreateFolderModal}>
                <span aria-hidden="true">&times;</span>
              </button>
                  <form className="form-horizontal" role="form">
                          <h5 className="align-left">New Shared Folder</h5>
                          <div className="form-group">
                              <div className="col-sm-9">
                                  <input type="text" id="folder-name" name="newFolderName" placeholder="folder-name" value = {this.props.newFolderName}
                                  className="form-control" onChange={this.props.handleInputChange} required/>
                              </div>
                          </div>
                          <div className="form-group">
                              <div className="col-sm-3">
                                  <Button bsStyle="primary" onClick = {this.createNewFolder}>Create</Button>
                              </div>
                          </div>
                          <br/><br/><br/><br/><br/><br/><br/><br/>
                      </form>
                  <br/>
              </Modal>
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
  newFolderName : PropTypes.string,
  currentPath: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.func.isRequired,
  navigateToLogin: PropTypes.func.isRequired,
  createFolderActive: PropTypes.bool.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

const Home = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeComponent);

export default Home;
