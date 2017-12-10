import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {TabContainer, Tab, Row, Col, NavItem, TabContent, TabPane, Nav} from 'react-bootstrap'
import HomeView from './home-view';
import GroupView from './group-view';
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
    newFolderName: state.update.newFolderName,
    createGroupActive: state.update.createGroupActive,
    newGroupName: state.update.newGroupName
  };
};


const mapDispatchToProps = (dispatch) => {
  return {

    handleInputChange: (e) => {
      console.log('updating ' + e.target.name + ' to ' + e.target.value);
      dispatch({type: "createNewFolder", newFolderName: e.target.value});
    },

    handleGroupChange: (e) => {
      console.log('updating ' + e.target.name + ' to ' + e.target.value);
      dispatch({type: "createNewGroup", newGroupName: e.target.value});
    },

    handleShowFiles: (currentPath) => {
      axios('http://localhost:8080/api/files/list',{
        method: 'get',
        withCredentials : true,
        headers : {
          currentPath : currentPath
        }
      })
      .then(function (response) {
        if(response.status == 200){
          var files = response.data;
          console.log(response.data);
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
      axios.get('http://localhost:8080/api/user/logout')
      .then(function (response) {
        console.log(response);
        callback();
      });
    },
    handleFileUpload: (currentPath) => {
      var options = {
        withCredentials : true,
        headers: {
          currentpath : currentPath,
          'Content-Type': 'multipart/form-data'
        }
      }
      var imageFiles = document.querySelector("#files");
      var imgFiles = imageFiles.files;

      var data = new FormData();
      data.append('file', imgFiles[0]);
      axios.post('http://localhost:8080/api/files/upload',data, options)
      .then(response => {
        console.log(response);
        dispatch({ type: "updateFiles", userFiles: response.data});
      })
      .catch(err => {
        console.log(err);
      });

    },
    isLoggedIn: (callback, errCallback) => {
      axios.get('http://localhost:8080/api/user/isLoggedIn')
      .then(function (res) {
        console.log('result is ' + res.data);
        dispatch({
          type : "updateUser",
          user : {
            id: res.data.id
          }
        });
        if(res.status == 200){
          // callback();
        }else{
          errCallback();
        }
      })
      .catch(function(err){
        console.log('error is ' + err);
        errCallback();
      });
    },

    navigateToHome: () => {
      dispatch(push(
        {pathname : "/home"}
      ));
    },

    navigateToLogin: () => {
      dispatch(push(
        {pathname : "/login"}
      ));
    },
    handleCreateNewFolder: (currentPath, folderName, isActive) => {
      var options = {
        withCredentials : true
      }
      axios.post('http://localhost:8080/api/files/createDir',{
        dirpath : currentPath,
        dirname : folderName
      },options)
      .then(function (response) {
        if(response.status == 201){
          var files = response.data;
          console.log(response.data);
          dispatch({
            type : "updateFiles",
            userFiles : files
          });
          dispatch({type: "toggleCreateFolderModal", createFolderActive: !isActive});
        }else{
          var err = response;
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
    },

    toggleCreateGroupModal: (isActive) => {
      console.log(' create group modal is active ? ' + isActive );
      dispatch({type: "toggleCreateGroupModal", createGroupActive: !isActive});
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

  toggleCreateGroupModal = () => {
    this.props.toggleCreateGroupModal(this.props.createGroupActive);
  }

  modalStyle = {
    overlay : {
      position          : 'fixed',
      top               : 100,
      left              : 400,
      right             : 550,
      bottom            : 300,
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
            <br/><br/>
              <Row sm={2}>
                <Col sm={3}>
                </Col>
                <Col sm={6}>
                  <button className="dropbox-btn"></button>
                </Col>
                <Col sm={3}>
                </Col>
              </Row>
              <br/><br/>
              <Row sm={8}>
              <Nav bsStyle="pills" stacked>
                <NavItem eventKey="first">
                  Home
                </NavItem>
                <NavItem eventKey="second">
                  Files
                </NavItem>
                <NavItem eventKey="third">
                  Group Sharing
                </NavItem>
              </Nav>
              </Row>

            </Col>
            <Col sm={8}>
              <TabContent animation>
                <TabPane eventKey="first">
                  <HomeView userId={userId} userFiles={userFiles}/>
                </TabPane>
                <TabPane eventKey="second">
                  <HomeView userId={userId} userFiles={userFiles}/>
                </TabPane>
                <TabPane eventKey="third">
                  <GroupView userId={userId}/>
                </TabPane>
              </TabContent>
            </Col>
            <Col sm={2}>
            <TabContent animation>
              <TabPane eventKey="first">
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
                  </TabPane>
                </TabContent>
                <TabContent animation>
                  <TabPane eventKey="second">
                    <a href="" className="signout" onClick={this.logout}>Signout</a>
                    <br/><br/><br/><br/><br/><br/>
                    <div className="fileinput fileinput-new" data-provides="fileinput">
                      <span className="btn btn-default btn-file btn-primary btn-block"><span>Upload files</span><input type="file" id="files" onChange={this.uploadFile}/></span>
                      <span className="fileinput-filename"></span>
                    </div>
                    <br/>
                      <button className="btn btn-default btn-file btn-block" onClick={this.toggleCreateFolderModal}>New Shared Folder</button>
                      <button className="btn btn-default btn-file btn-block" onClick={this.toggleCreateFolderModal}>New Folder</button>
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
                      </TabPane>
                    </TabContent>
                <TabContent animation>

                  <TabPane eventKey="third">
                    <br/><br/><br/><br/><br/><br/>
                    <br/><br/>
                      <button className="btn btn-default btn-file btn-block" onClick={this.toggleCreateGroupModal}>New Group</button>
                      <Modal isOpen={this.props.createGroupActive} onRequestClose={this.toggleCreateGroupModal}
                             closeButton={true} style={this.modalStyle} modalTransition={{ timeout: 20 }}
                             backdropTransition={{ timeout: 10 }}>
                          <button className="close-button" data-close aria-label="Close modal" type="button" onClick={this.toggleCreateGroupModal}>
                            <span aria-hidden="true">&times;</span>
                          </button>
                          <form className="form-horizontal" role="form">
                              <h5 className="align-left">New Group Name</h5>
                              <div className="form-group">
                                  <div className="col-sm-9">
                                      <input type="text" id="group-name" name="newGroupName" placeholder="Group name" value = {this.props.newGroupName}
                                      className="form-control" onChange={this.props.handleGroupChange} required/>
                                  </div>
                              </div>
                              <div className="form-group">
                                  <div className="col-sm-3">
                                      <Button bsStyle="primary" onClick = {this.createNewGroup}>Create</Button>
                                  </div>
                              </div>
                              <br/><br/><br/><br/><br/><br/><br/><br/>
                          </form>
                          <br/>
                      </Modal>
                      </TabPane>
                    </TabContent>
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
  newGroupName: PropTypes.string.isRequired,
  handleGroupChange: PropTypes.func.isRequired,
  toggleCreateGroupModal: PropTypes.func.isRequired,
  createGroupActive: PropTypes.bool.isRequired
};

const Home = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeComponent);

export default Home;
