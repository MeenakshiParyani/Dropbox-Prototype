import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'
import {PageHeader, Grid, Row, Col, Button} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import axios from 'axios';
import fileDownlaoder from 'react-file-download';

class HomeView extends Component {

  constructor(props){
      super(props);
      this.state = {
        userFiles : [],
        userId    : null
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
      <button className="overlay-btn" onClick={ () => this.formatExtraData.dowloadFile(this.formatExtraData, row)}>Download</button>
    );
  }

  fileNameFormatter(cell, row) {
    return (
      <span className="file-name">{cell}</span>
    );
  }

  dowloadFile(homeView, row){
    const url = 'http://localhost:3000/api/file/download?userid=' + homeView.state.userId + '&filename=' + row.name + '&isDir=' + row.isDir;
    window.open(url, "_blank");
    // axios.get('http://localhost:3000/api/file/download',{
    //   params: {
    //     userid  : homeView.state.userId,
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

  componentWillReceiveProps(nextProps){
    this.handleInputChange({'userFiles' : nextProps.userFiles, 'userId' : nextProps.userId});
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
              <TableHeaderColumn className="slim-width" dataField='name' dataFormat={ this.overlayFormatter } formatExtraData={ this.dowloadFile, this }></TableHeaderColumn>
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
