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
    userGroups: state.update.userGroups,
    showGroupMembers: state.update.showGroupMembers,
    selectedGroup: state.update.selectedGroup,
    selectedGroupMembers: state.update.selectedGroupMembers,
    showAddGroupMemberModal: state.update.showAddGroupMemberModal
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    handleInputChange: (e) => {
      console.log('updating ' + e.target.name + ' to ' + e.target.value);
      dispatch({type: "shareWithUser", shareFileUserName: e.target.value});
    },

    updateUserGroups: (groups) => {
      dispatch({type: "updateUserGroups", userGroups: groups});
    },

    toggleShowMembersModal: (group, members)=> {
      dispatch({type: "toggleShowGroupMembers", selectedGroupMembers: members, selectedGroup: group});
    },

    deleteGroupMember: (member) => {
      dispatch({type: "deleteGroupMember", member: member});
    },

    deleteGroup: (group) => {
      dispatch({type: "deleteGroup", groupName: group});
    },

    addMemberToGroup: () => {
      dispatch({type: "addGroupMember"});
    },

    toggleShowAddGroupMemberModal: (group, members) => {
      dispatch({type: "toggleShowAddGroupMemberModal", selectedGroup: group, selectedGroupMembers: members});
    },

    changeNewGroupMember: (e) => {
      dispatch({type: "changeNewGroupMember", member: e.target.value});
    }
  };
};

class GroupViewComponent extends Component {

  constructor(props){
    super(props);
    this.groupMembersFormatter = this.groupMembersFormatter.bind(this);
    this.toggleShowMembersModal = this.toggleShowMembersModal.bind(this);
    this.groupMemberNameFormatter = this.groupMemberNameFormatter.bind(this);
    this.deleteGroupFormatter = this.deleteGroupFormatter.bind(this);
    this.addMemberFormatter = this.addMemberFormatter.bind(this);
    this.addMemberToGroup= this.addMemberToGroup.bind(this);
    this.toggleShowAddGroupMemberModal = this.toggleShowAddGroupMemberModal.bind(this);
    this.updateUserGroups = this.updateUserGroups.bind(this);
  }

  updateUserGroups(){
    var groupView = this;
    var groups = [];
     fetch(`http://localhost:8080/api/groups/getGroups`,{
        credentials: 'include'
    })
		.then((response) => response.json())
		.then((json) => {
			groupView.props.updateUserGroups(json);
		});

  }

  getUserGroups(){

    // groups.push({
    //   groupName: 'Personal-Group',
    //   members: [{name : 'Meenakshi Paryani'}, {name : 'Nikhil Rajpal'} , {name: 'Murli Rajpal'}]
    // })
    // groups.push({
    //   groupName: 'Work-Group',
    //   members: [{name : 'Meenakshi Paryani'}, {name : 'Frank Gerber'} , {name: 'Prashant Rajput'}]
    // });

    // return groups;
  }

  componentWillMount(){
    this.updateUserGroups();
  }

  groupFormatter(cell, row) {
    return (
      <button className="group-btn"></button>
    );
  }

  groupNameFormatter(cell, row) {
    return (
      <div>
        <div className="col-sm-3">
          <button className="group-btn"></button>
        </div>
        <div className="col-sm-9">
          <a href='#'>{cell}</a>
        </div>
      </div>
    );
  }

  toggleShowMembersModal(cell, row){
    this.props.toggleShowMembersModal(cell, row);
  }

  groupMembersFormatter(cell, row){

    return (
      <a href="#"  onClick = { () => {this.toggleShowMembersModal(row.name,row.members)}}>Members</a>
    );
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

groupMemberNameFormatter(cell,row){
  return (
    <div>
    <div className="col-sm-10">
      {cell}
    </div>
    <div className="col-sm-2">
    <button className="close-button" data-close aria-label="Close modal" type="button" onClick={ () => {this.deleteGroupMember(cell,row)}}>
      <span aria-hidden="true">&times;</span>
    </button>
    </div>

    </div>
  );
}

deleteGroupMember(memberName, member){
  var groupView = this;
  // delete group member
  var options = {
    withCredentials : true
  }
  var data = {
    groupName : this.props.selectedGroup,
    userIds : [member.id]
  };

  axios.put('http://localhost:8080/api/groups/deleteMembers',data,options)
  .then(function (response) {
    if(response.status == 200){
      var files = response.data;
      console.log(response.data);
    }else{
      var err = response;
      console.log('error is ' + err);
    }
    groupView.props.deleteGroupMember(member);
  })
  .catch(function(err){
    console.log('error is ' + err);
    groupView.props.deleteGroupMember(member);

  });

}

deleteGroup(group){
  this.props.deleteGroup(group);
}

deleteGroupFormatter(cell, row){
  return (
    <div>
    <button className="close-button" data-close aria-label="Close modal" type="button" onClick={ () => {this.deleteGroup(cell)}}>
      <span aria-hidden="true">&times;</span>
    </button>
    </div>
  );
}

addMemberFormatter(cell,row){
  return (
    <div>
      <button className="add-member-btn btn btn-default" onClick = {() => { this.toggleShowAddGroupMemberModal(row.name,row.members) }}>Add Members</button>
    </div>
  );
}


toggleShowAddGroupMemberModal(group,members){
  this.props.toggleShowAddGroupMemberModal(group,members);
}

addMemberToGroup(){
  this.props.addMemberToGroup();
  this.props.toggleShowAddGroupMemberModal();
}

  render() {
      return (
      <div>
      <div className = "container-fluid ">
          <PageHeader className="header"><h3>Groups</h3></PageHeader>
          <BootstrapTable headerStyle={{ display: 'none' }} tableStyle={{ margin: 0, borderRadius: 0, border: 0 }}
           striped={false} sortable={true} data={this.props.userGroups} keyField='name'>
            <TableHeaderColumn className="slim-width" dataField='name' dataFormat={ this.groupNameFormatter }></TableHeaderColumn>
            <TableHeaderColumn className="wide-width file-name" dataField='members' dataFormat={ this.groupMembersFormatter }>Name</TableHeaderColumn>
            <TableHeaderColumn className="slim-width" dataField='members' dataFormat={ this.addMemberFormatter }></TableHeaderColumn>
            <TableHeaderColumn className="slim-width" dataField='name' dataFormat={ this.deleteGroupFormatter }></TableHeaderColumn>
          </BootstrapTable>
      </div>
      <Modal isOpen={this.props.showGroupMembers} onRequestHide={this.toggleShowMembersModal}
        closeButton={true} modalTransition={{ timeout: 20 }}
        backdropStyles={this.backdropStyles} dialogStyles={this.dialogStyles}
        backdropTransition={{ timeout: 10 }}>
        <ModalHeader>
          <ModalClose onClick={this.toggleShowMembersModal}/>
          <ModalTitle>
          <div>
            <div className="col-sm-12">
                 {this.groupNameFormatter(this.props.selectedGroup)}
            </div>
          </div>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <BootstrapTable headerStyle={{ display: 'none' }} tableStyle={{ margin: 0, borderRadius: 0, border: 0 }}
           striped={false} sortable={true} data={this.props.selectedGroupMembers} keyField='fullname'>
            <TableHeaderColumn className="slim-width" dataField='fullname' dataFormat={ this.groupMemberNameFormatter }></TableHeaderColumn>
          </BootstrapTable>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={this.toggleShowMembersModal}>
            Save
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={this.props.showAddGroupMemberModal} onRequestHide={this.toggleShowAddGroupMemberModal}
        closeButton={true} modalTransition={{ timeout: 20 }}
        backdropStyles={this.backdropStyles} dialogStyles={this.dialogStyles}
        backdropTransition={{ timeout: 10 }}>
        <ModalHeader>
          <ModalClose onClick={this.toggleShowAddGroupMemberModal}/>
          <ModalTitle>
          <div>
            <div className="col-sm-12">
                 {this.groupNameFormatter(this.props.selectedGroup)}
            </div>
          </div>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <input type="text" id="newMember" name="newMemberName" placeholder="Email Or Name" value = {this.props.newGroupMember}
          className="form-control" onChange={this.props.changeNewGroupMember} required/>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={this.addMemberToGroup}>
            Add
          </button>
        </ModalFooter>
      </Modal>
      </div>
    );
  }
}

GroupViewComponent.PropTypes = {
  user: PropTypes.object.isRequired,
  files: PropTypes.array,
  currentPath: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.func.isRequired,
  userGroups: PropTypes.array,
  navigateToLogin: PropTypes.func.isRequired,
  updateUserGroups: PropTypes.func.isRequired,
  toggleShowMembersModal: PropTypes.func.isRequired,
  showGroupMembers: PropTypes.bool.isRequired,
  selectedGroup: PropTypes.string.isRequired,
  selectedGroupMembers: PropTypes.array,
  deleteGroupMember: PropTypes.func.isRequired,
  deleteGroup: PropTypes.func.isRequired,
  addMemberToGroup: PropTypes.func.isRequired,
  showAddGroupMemberModal: PropTypes.bool.isRequired,
  changeNewGroupMember: PropTypes.func.isRequired
};

const GroupView = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupViewComponent);

export default GroupView;
