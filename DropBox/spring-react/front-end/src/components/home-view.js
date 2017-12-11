import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'
import {PageHeader, Grid, Row, Col, Button} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
// import fileDownlaoder from 'react-file-download';
import fileDownlaoder from'js-file-download';
import {connect} from  "react-redux";
import axios from 'axios';
axios.defaults.withCredentials = true;
import {replace, push} from "react-router-redux";
import StarRatings from 'react-star-ratings';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter
} from 'react-modal-bootstrap';
import Select from 'react-select';
import fetch from 'isomorphic-fetch';

const mapStateToProps = (state) => {
  return {
    user: state.update.user,
    files: state.update.files,
    currentPath: state.update.currentPath,
    shareFileFolderActive: state.update.shareFileFolderActive,
    sharedFileFolderName: state.update.sharedFileFolderName,
    sharedFileFolderIsDir: state.update.sharedFileFolderIsDir,
    shareFileUserName: state.update.shareFileUserName,
    shareLinkCreated: state.update.shareLinkCreated,
    shareLinkCopied: state.update.shareLinkCopied,
    rating: state.update.rating,
    shareWithUsers : state.update.shareWithUsers,
    selectedFile : state.update.selectedFile
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    handleInputChange: (e) => {
      console.log('updating ' + e.target.name + ' to ' + e.target.value);
      dispatch({type: "shareWithUser", shareFileUserName: e.target.value});
    },

    shareFileFolder: (fileName, isDir) => {
      console.log(row);
    },

    toggleShareFileFolderModal: (isActive, fileName, isDir, file) => {
      console.log(' create folder modal is active ? ' + isActive );
      if(isActive){
        dispatch({type: "toggleShareFileFolderModal", shareFileFolderActive: !isActive,
          sharedFileFolderName : '', sharedFileFolderIsDir : false});
      }else{
        dispatch({type: "toggleShareFileFolderModal", shareFileFolderActive: !isActive,
          sharedFileFolderName : fileName, sharedFileFolderIsDir : isDir});
      }
      dispatch({type: "updateSelectedFile", selectedFile: file});
    },

    toggleShareLinkCreated: (isActive) => {
      dispatch({type: "toggleShareLinkCreated", shareLinkCreated: !isActive});
    },

    toggleShareLinkCopied: (isActive) => {
      dispatch({type: "toggleShareLinkCopied", shareLinkCopied: !isActive});
    },

    toggleRating: (newRating) => {
      dispatch({type: "toggleRating", rating: newRating});
    },

    handleDeleteFileOrDir: (currentPath, fileOrDir) => {
      var options = {
        withCredentials : true
      }
      axios.post('http://localhost:8080/api/files/deleteFileOrDir',{
        dirpath : currentPath,
        dirname : fileOrDir
      },options)
      .then(function (response) {
        if(response.status == 200){
          var files = response.data;
          console.log(response.data);
          dispatch({
            type : "updateFiles",
            userFiles : files
          });
        }else{
          var err = response;
          console.log('error is ' + err);
          dispatch({type: "error", errorMessage: err.response.data.error});
        }

      })
      .catch(function(err){
        console.log('error is ' + err);
        dispatch({type: "error", errorMessage: err.response.data.error});
      });
    },

    handleStarFileOrDir : (file) => {
      var options = {
        withCredentials : true
      }
      axios.put('http://localhost:8080/api/files/star',file ,options)
      .then(function (response) {
        if(response.status == 200){
          var files = response.data;
          console.log(response.data);
          dispatch({
            type : "updateFiles",
            userFiles : files
          });
        }else{
          var err = response;
          console.log('error is ' + err);
          dispatch({type: "error", errorMessage: err.response.data.error});
        }

      })
      .catch(function(err){
        console.log('error is ' + err);
        dispatch({type: "error", errorMessage: err.response.data.error});
      });
    },

    handleShareWithUsers(users){
      dispatch({type: "updateShareWithUsers", shareWithUsers: users});
    }
  };
};



class HomeViewComponent extends Component {

  constructor(props){
    super(props);
    this.shareFormatter = this.shareFormatter.bind(this);
    this.toggleRating = this.toggleRating.bind(this);
    this.fileNameFormatter = this.fileNameFormatter.bind(this);
    this.onChangeShareWithUsers = this.onChangeShareWithUsers.bind(this);
    this.shareWithUsers =  this.shareWithUsers.bind(this);
  }

  shareFileFolder = (fileName, isDir) => {
    this.props.shareFileFolder(fileName, isDir);
  }

  toggleShareFileFolderModal = (fileName, isDir, file) => {
    this.props.toggleShareFileFolderModal(this.props.shareFileFolderActive, fileName, isDir, file);
  }

  dirFormatter(cell, row) {
    if(cell){
      return (
        <button className="dir-btn"></button>
      );
    }else{
      return (
        <button className="file-btn"></button>
      );
    }
  }

  dirFormatterShareFile = () => {
    if(this.props.sharedFileFolderIsDir){
      return (
        <button className="dir-btn"></button>
      );
    }else{
      return (
        <button className="file-btn"></button>
      );
    }
  }

  shareFormatter(cell, row) {
    var fileName = row.name;
    var isDir = row.isDir;
    var file = row;
    console.log(row);
    // var filename = row.
    if(fileName=="Shared-Folder"){
      return (
        <a className="share-btn btn btn-default" onClick = {(row) => { this.toggleShareFileFolderModal(fileName, isDir, file) }}>Shared</a>
      );
    }
    return (
      <button className="share-btn btn btn-default" onClick = {(row) => { this.toggleShareFileFolderModal(fileName, isDir, file) }}>Share</button>
    );
  }

  overlayFormatter(cell, row) {
    return (
      <button className="overlay-btn btn btn-default" onClick={ () => this.formatExtraData.dowloadFile(this.formatExtraData, row)}>Download</button>
    );
  }

  deleteFormatter(cell, row) {
    return (
      <button className="delete-btn btn btn-default" onClick={ () => this.formatExtraData.deleteFileOrFolder(this.formatExtraData, row)}>Delete</button>
    );
  }

  deleteFileOrFolder(homeView, row){
    console.log(row);
    this.props.handleDeleteFileOrDir(row.currentPath, row.name);
  }

  toggleRating(newRating) {
    this.props.toggleRating(newRating);
  }

  onStarRatingChange(row) {
    this.props.handleStarFileOrDir(row);
  }

  fileNameFormatter(cell, row) {
    var fileName = cell;
    console.log(fileName);
    var rating = row != undefined ? row.isStared ? 1 : 0 : 0;
    return (
      <span className="file-name">
      <a href="#">{fileName}</a>
      <span> <StarRatings
          rating={rating}
          isSelectable={true}
          isAggregateRating={false}
          numOfStars={ 1 } starRatedColor="rgb(244, 215, 66)" starWidthAndHeight="27px" starSelectingHoverColor="yellow"
          changeRating ={ (rating) => this.onStarRatingChange(row)}
        /></span>
      </span>
    );
  }

  getShareFileDownloadLink = () => {
    return 'http://localhost:8080/api/file/download?filename=' + this.props.sharedFileFolderName + '&isDir=' + this.props.sharedFileFolderIsDir;
  }

  toggleShareLinkCreated = () => {
    this.props.toggleShareLinkCreated(this.props.shareLinkCreated);
  }

  toggleShareLinkCopied = () => {
    this.props.toggleShareLinkCopied(this.props.shareLinkCopied);
  }

  dowloadFile(homeView, row){
    console.log(this.props.user);
    // const url = 'http://localhost:8080/api/files/download?filePath=' + row.currentPath + '&fileName=' + row.name + '&isDir=' + row.isDir;
    // window.open(url, "_blank");
    axios.get('http://localhost:8080/api/files/download',{
      params: {
        filePath  : row.currentPath,
        fileName : row.name,
        isDir    : row.isDir
      }
    })
    .then(function (response) {
      fileDownlaoder(response.data, row.name);
    })
    .catch(function(err){
      console.log('error is ' + err);
    });

  }

  backdropStyles = {
  base: {
    background: 'rgba(0, 0, 0, .7)',
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.4s',
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  open: {
    opacity: 1,
    visibility: 'visible'
  }
};

dialogStyles = {
  base: {
    top: -600,
    transition: 'top 0.4s',
  },
  open: {
    top: 0
  }
};

  getUsers(){
    return fetch(`http://localhost:8080/api/user/listAllExceptSelf`,{
        credentials: 'include'
    })
		.then((response) => response.json())
		.then((json) => {
			return { options: json };
		});
  }

  onChangeShareWithUsers(users){
    this.props.handleShareWithUsers(users);
  }

  getUserIds(users){
    var userids = [];
    for (var i = 0; i < users.length; i++) {
      userids.push(users[i].id);
    }
    return userids;
  }

  shareWithUsers(){
    var homeView = this;
    var userids = this.getUserIds(this.props.shareWithUsers);
    var options = {
      withCredentials : true,
      headers: {
        sharewithuserids : userids
      }
    }
    axios.post('http://localhost:8080/api/files/shareWithUser',this.props.selectedFile,options)
    .then(function (response) {
      if(response.status == 200){
        var files = response.data;
        console.log(response.data);
      }else{
        var err = response;
        console.log('error is ' + err);
      }
      homeView.toggleShareFileFolderModal();
    })
    .catch(function(err){
      console.log('error is ' + err);
      homeView.toggleShareFileFolderModal();
    });
  }


  render() {

    if(this.props.files.length > 0){
      const columns = ["name", "isDir"];
      return (
        <div>
          <div className = "container-fluid ">
              <PageHeader className="header"><h3>Home</h3></PageHeader>
              <BootstrapTable headerStyle={{ display: 'none' }} tableStyle={{ margin: 0, borderRadius: 0, border: 0 }}
               striped={false} sortable={true} data={this.props.files} keyField='name'>
                <TableHeaderColumn width="20px" dataField='isDir' dataFormat={ this.dirFormatter }></TableHeaderColumn>
                <TableHeaderColumn width="140px" className="wide-width file-name" dataField='name' dataFormat={ this.fileNameFormatter }>Name</TableHeaderColumn>
                <TableHeaderColumn width="30px" className="slim-width" dataField='name' dataFormat={ this.shareFormatter }></TableHeaderColumn>
                <TableHeaderColumn width="30px" className="slim-width" dataField='name' dataFormat={ this.overlayFormatter } formatExtraData={ this.dowloadFile, this }></TableHeaderColumn>
                <TableHeaderColumn width="28px" className="slim-width" dataField='name' dataFormat={ this.deleteFormatter } formatExtraData={ this.deleteFileOrFolder, this }></TableHeaderColumn>
              </BootstrapTable>
          </div>
          <div className ='shareModal'>
          <Modal isOpen={this.props.shareFileFolderActive} onRequestHide={this.toggleShareFileFolderModal}
            closeButton={true} style={this.modalStyle} modalTransition={{ timeout: 20 }}
            backdropStyles={this.backdropStyles} dialogStyles={this.dialogStyles}
            backdropTransition={{ timeout: 10 }}>
            <ModalHeader>
              <ModalClose onClick={this.toggleShareFileFolderModal}/>
              <ModalTitle>
              <div>
                <div className="col-sm-2">
                    {this.dirFormatterShareFile()}
                </div>
                <div className="col-sm-10">
                     {this.fileNameFormatter(this.props.sharedFileFolderName)}
                </div>
              </div>
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
            <div>
            <form className="form-horizontal" role="form">
                    <div className="form-group">
                        <div className="col-sm-1">
                            <label htmlFor="username">To:</label>
                        </div>
                        <div className="col-sm-11">
                        <div className="section">

                          <Select.Async multi={true} value={this.props.shareWithUsers} onChange={this.onChangeShareWithUsers}  valueKey="id" labelKey="email" loadOptions={this.getUsers} />

                        </div>
                        </div>
                    </div>
            </form>
            <PageHeader className="header"></PageHeader>
            <div>
              {this.props.shareLinkCopied && <div>
                <div className="col-sm-10">
                  {this.getShareFileDownloadLink()}
                </div>
                <div className="col-sm-2">
                  <a href='#' onClick={this.toggleShareLinkCopied}>Hide Link</a>
                </div>
              </div>}

              {this.props.shareLinkCreated && <div>
                <div className="col-sm-8">
                  Anyone with the link can view this folder
                </div>
                <div className="col-sm-2">
                  <a href='#' onClick={this.toggleShareLinkCopied}>Copy Link</a>
                </div>
              </div>}

              {!this.props.shareLinkCreated && !this.props.shareLinkCopied && <div>
                <div className="col-sm-10">
                  No Link Created Yet
                </div>
                <div className="col-sm-2">
                  <a href='#' onClick={this.toggleShareLinkCreated}>Create a Link</a>
                </div>
              </div>}
              <br/><br/>
            </div>
            </div>
            </ModalBody>
            <ModalFooter>
              <button className='btn btn-primary' onClick = {this.shareWithUsers}>
                Share
              </button>
            </ModalFooter>
          </Modal>
          </div>
        </div>
      );
    }else{
      return <div></div>
    }
  }
}

HomeViewComponent.PropTypes = {
  user: PropTypes.object.isRequired,
  files: PropTypes.array,
  currentPath: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.func.isRequired,
  navigateToLogin: PropTypes.func.isRequired,
  shareFileFolder: PropTypes.func.isRequired,
  shareFileFolderActive: PropTypes.bool.isRequired,
  sharedFileFolderName: PropTypes.string.isRequired,
  sharedFileFolderIsDir: PropTypes.bool.isRequired,
  shareFileUserName: PropTypes.string.isRequired,
  shareLinkCreated: PropTypes.bool.isRequired,
  shareLinkCopied: PropTypes.bool.isRequired,
  toggleShareLinkCreated: PropTypes.func.isRequired,
  toggleShareLinkCopied: PropTypes.func.isRequired,
  handleDeleteFileOrDir: PropTypes.func.isRequired,
  rating: PropTypes.string.isRequired,
  handleDeleteFileOrDir : PropTypes.func.isRequired,
  shareWithUsers : PropTypes.array,
  selectedFile : PropTypes.object.isRequired
};

const HomeView = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeViewComponent);

export default HomeView;
