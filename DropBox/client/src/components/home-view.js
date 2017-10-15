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
      const columns = ["name", "dir"];
      return (
        <div className = "container-fluid">
            <PageHeader className="header"><h3>Home</h3></PageHeader>
            <BootstrapTable data={this.props.userFiles} keyField='name'>
              {columns.map(column =>
                  <Row>
                  <TableHeaderColumn dataField={column}>{column}</TableHeaderColumn>
                  </Row>
              )}
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
