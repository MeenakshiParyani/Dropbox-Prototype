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
    activities : state.update.activities
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserActivities(activities){
      dispatch({type: "updateUserActivities", activities : activities});
    }
  };
};



class ActivityComponent extends Component {

  constructor(props){
    super(props);
    this.updateActivities = this.updateActivities.bind(this);
    this.dateFormatter1 = this.dateFormatter1.bind(this);
  }

  componentWillMount(){
    this.updateActivities();
  }

  updateActivities(){
      var ActivityView = this;
      fetch(`http://localhost:8080/api/user/getUserActivities`,{
          credentials: 'include'
      }).then((response) => response.json())
  		.then((json) => {
        ActivityView.props.updateUserActivities(json);
  		});
  }

  formatter(cell, row) {
    var op = row.operation + " ";
    return (
      <div>  <a href='#'> {op} {row.target} </a> </div>
    );
  }

  dateFormatter1(cell, row) {
    var date = this.formatDate(row.date);
    return (
      <div> <a href='#'> {date}</a> </div>
    );
  }

   formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
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

    if(this.props.activities.length > 0){
      const columns = ["operation"];
      return (
        <div>
          <div className = "container-fluid ">
              <PageHeader className="header"><h3>Your Activity</h3></PageHeader>
              <BootstrapTable headerStyle={{ display: 'none' }} tableStyle={{ margin: 0, borderRadius: 0, border: 0 }}
               striped={false} sortable={true} data={this.props.activities} keyField='name'>
                <TableHeaderColumn width="140px" dataField='operation' dataFormat={ this.formatter }></TableHeaderColumn>
                <TableHeaderColumn width="40px" dataField='date' dataFormat={ this.dateFormatter1 }></TableHeaderColumn>
              </BootstrapTable>
          </div>
        </div>
      );
    }else{
      return (<div>No data to display</div>);
    }
  }
}

ActivityComponent.PropTypes = {
  user: PropTypes.object.isRequired,
  activities: PropTypes.array.isRequired,
  updateUserActivities : PropTypes.func.isRequired
};

const ActivityView = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityComponent);

export default ActivityView;
