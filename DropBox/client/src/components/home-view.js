import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'
import {PageHeader, Grid, Row, Col, Button} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import axios from 'axios';

class HomeView extends Component {

  state = {
    userfiles : []
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
        <button>normal</button>
      );
    }

  }

  render() {

    if(this.props.userFiles.length > 0){
      const columns = ["name", "isDir"];
      return (
        <div className = "container-fluid ">
            <PageHeader className="header"><h3>Home</h3></PageHeader>
            <BootstrapTable headerStyle={{ display: 'none' }} tableStyle={{ margin: 0, borderRadius: 0, border: 0 }}
             striped={false} sortable={true} data={this.props.userFiles} keyField='name'>
              <TableHeaderColumn className="slim-width" dataField='isDir' dataFormat={ this.dirFormatter }>Active</TableHeaderColumn>
              <TableHeaderColumn className="wide-width" dataField='name'>Name</TableHeaderColumn>
            </BootstrapTable>
        </div>
      );
    }
  }
}


HomeView.PropTypes = {
  userId : PropTypes.string,
  userFiles : PropTypes.array
}

export default withRouter(HomeView)
