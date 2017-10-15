import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'
import {PageHeader, Grid, Row, Col, Button} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import axios from 'axios';

class HomeView extends Component {

  constructor(props){
      super(props);
      this.state = {
        userFiles : []
      };
  }

  handleInputChange(newPartialInput) {
    this.setState(state => ({
        ...state,
        ...newPartialInput
    }))
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

  shareFormatter(cell, row) {
    return (
      <button className="share-btn">Share</button>
    );
  }

  overlayFormatter(cell, row) {
    return (
      <button className="overlay-btn" onClick={ () => this.downloadFile(row)}>Download</button>
    );
  }

  fileNameFormatter(cell, row) {
    return (
      <span className="file-name">{cell}</span>
    );
  }

  dowloadFile(row){
    var fileName = row.name;
    console.log(fileName);
    if(row.isDir){
      // update userFiles


    }else{

    }

  }

  componentWillReceiveProps(nextProps){
    this.handleInputChange({'userFiles' : nextProps.userFiles});
  }

  render() {

    if(this.state.userFiles.length > 0){
      const columns = ["name", "isDir"];
      return (
        <div className = "container-fluid ">
            <PageHeader className="header"><h3>Home</h3></PageHeader>
            <BootstrapTable headerStyle={{ display: 'none' }} tableStyle={{ margin: 0, borderRadius: 0, border: 0 }}
             striped={false} sortable={true} data={this.state.userFiles} keyField='name'>
              <TableHeaderColumn className="slim-width" dataField='isDir' dataFormat={ this.dirFormatter }></TableHeaderColumn>
              <TableHeaderColumn className="wide-width file-name" dataField='name' dataFormat={ this.fileNameFormatter }>Name</TableHeaderColumn>
              <TableHeaderColumn className="slim-width" dataField='name' dataFormat={ this.shareFormatter }></TableHeaderColumn>
              <TableHeaderColumn className="slim-width" dataField='name' dataFormat={ this.overlayFormatter }></TableHeaderColumn>
            </BootstrapTable>
        </div>
      );
    }else{
      return <div></div>
    }
  }
}


HomeView.PropTypes = {
  userId : PropTypes.string,
  userFiles : PropTypes.array
}

export default withRouter(HomeView)
