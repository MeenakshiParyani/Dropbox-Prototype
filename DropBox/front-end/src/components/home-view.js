import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'
import {PageHeader, Grid, Row, Col, Button} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import fileDownlaoder from 'react-file-download';
import {connect} from  "react-redux";
import axios from 'axios';
axios.defaults.withCredentials = true;
import {replace, push} from "react-router-redux";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter
} from 'react-modal-bootstrap';

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
    shareLinkCopied: state.update.shareLinkCopied
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

    toggleShareFileFolderModal: (isActive, fileName, isDir) => {
      console.log(' create folder modal is active ? ' + isActive );
      if(isActive){
        dispatch({type: "toggleShareFileFolderModal", shareFileFolderActive: !isActive,
          sharedFileFolderName : '', sharedFileFolderIsDir : false});
      }else{
        dispatch({type: "toggleShareFileFolderModal", shareFileFolderActive: !isActive,
          sharedFileFolderName : fileName, sharedFileFolderIsDir : isDir});
      }
    },

    toggleShareLinkCreated: (isActive) => {
      dispatch({type: "toggleShareLinkCreated", shareLinkCreated: !isActive});
    },

    toggleShareLinkCopied: (isActive) => {
      dispatch({type: "toggleShareLinkCopied", shareLinkCopied: !isActive});
    }
  };
};

class HomeViewComponent extends Component {

  constructor(props){
    super(props);
    this.shareFormatter = this.shareFormatter.bind(this);
  }

  shareFileFolder = (fileName, isDir) => {
    this.props.shareFileFolder(fileName, isDir);
  }

  toggleShareFileFolderModal = (fileName, isDir) => {
    this.props.toggleShareFileFolderModal(this.props.shareFileFolderActive, fileName, isDir);
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
    console.log(row);
    // var filename = row.
    return (
      <button className="share-btn btn btn-default" onClick = {(row) => { this.toggleShareFileFolderModal(fileName, isDir) }}>Share</button>
    );
  }

  overlayFormatter(cell, row) {
    return (
      <button className="overlay-btn btn btn-default" onClick={ () => this.formatExtraData.dowloadFile(this.formatExtraData, row)}>Download</button>
    );
  }

  fileNameFormatter(cell, row) {
    var temp=cell.split('_');
    var out=[];
    for(var i=0; i<temp.length;i=i+2)
      out.push(temp.slice(i,i+2).join('_'));
    var fileName = (out[1] != undefined) ? out[1] : out[0];
    console.log(fileName);
    return (
      <span className="file-name"> {fileName}</span>
    );
  }

  getShareFileDownloadLink = () => {
    return 'http://localhost:3000/api/file/download?filename=' + this.props.sharedFileFolderName + '&isDir=' + this.props.sharedFileFolderIsDir;
  }

  toggleShareLinkCreated = () => {
    this.props.toggleShareLinkCreated(this.props.shareLinkCreated);
  }

  toggleShareLinkCopied = () => {
    this.props.toggleShareLinkCopied(this.props.shareLinkCopied);
  }

  dowloadFile(homeView, row){
    console.log(this.props.user);
    const url = 'http://localhost:3000/api/file/download?filename=' + row.name + '&isDir=' + row.isDir;
    window.open(url, "_blank");
    // axios.get('http://localhost:3000/api/file/download',{
    //   params: {
    //     userid  : this.props.user.id,
    //     filename : row.name,
    //     isDir    : row.isDir
    //   }
    // })
    // .then(function (response) {
    //   fileDownlaoder(response.data, row.name);
    // })
    // .catch(function(err){
    //   console.log('error is ' + err);
    // });

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




  render() {

    if(this.props.files.length > 0){
      const columns = ["name", "isDir"];
      return (
        <div>
          <div className = "container-fluid ">
              <PageHeader className="header"><h3>Home</h3></PageHeader>
              <BootstrapTable headerStyle={{ display: 'none' }} tableStyle={{ margin: 0, borderRadius: 0, border: 0 }}
               striped={false} sortable={true} data={this.props.files} keyField='name'>
                <TableHeaderColumn className="slim-width" dataField='isDir' dataFormat={ this.dirFormatter }></TableHeaderColumn>
                <TableHeaderColumn className="wide-width file-name" dataField='name' dataFormat={ this.fileNameFormatter }>Name</TableHeaderColumn>
                <TableHeaderColumn className="slim-width" dataField='name' dataFormat={ this.shareFormatter }></TableHeaderColumn>
                <TableHeaderColumn className="slim-width" dataField='name' dataFormat={ this.overlayFormatter } formatExtraData={ this.dowloadFile, this }></TableHeaderColumn>
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
                            <input type="text" id="shareFileUserName" name="shareFileUserName" placeholder="Email Or Name" value = {this.props.shareFileUserName}
                            className="form-control" onChange={this.props.handleInputChange} required/>
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
              <button className='btn btn-primary'>
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
  toggleShareLinkCopied: PropTypes.func.isRequired
};

const HomeView = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeViewComponent);

export default HomeView;
