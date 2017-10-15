import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'
import {PageHeader, Grid, Row, Col} from 'react-bootstrap'
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

  render() {

    if(this.props.userFiles.length > 0){
      const columns = ["name", "isDir"];
      return (
        <div className = "container-fluid">
            <PageHeader className="header"><h3>Home</h3></PageHeader>
            <BootstrapTable className="fileGrid" striped={true} data={this.props.userFiles} keyField='name'>
              <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='isDir'>Dir</TableHeaderColumn>
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
