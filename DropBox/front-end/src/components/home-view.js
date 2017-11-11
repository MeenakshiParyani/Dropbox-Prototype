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

const mapStateToProps = (state) => {
  return {
    user: state.update.user,
    files: state.update.files,
    currentPath: state.update.currentPath,
    isLoggedIn: state.update.isLoggedIn,
    navigateToLogin: state.update.navigateToLogin
  };
};

class HomeViewComponent extends Component {

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

  shareFormatter(cell, row) {
    return (
      <button className="share-btn">Share</button>
    );
  }

  overlayFormatter(cell, row) {
    return (
      <button className="overlay-btn" onClick={ () => this.formatExtraData.dowloadFile(this.formatExtraData, row)}>Download</button>
    );
  }

  fileNameFormatter(cell, row) {
    return (
      <span className="file-name">{cell}</span>
    );
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


  render() {

    if(this.props.files.length > 0){
      const columns = ["name", "isDir"];
      return (
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
  navigateToLogin: PropTypes.func.isRequired
};

const HomeView = connect(
  mapStateToProps
)(HomeViewComponent);

export default HomeView;
