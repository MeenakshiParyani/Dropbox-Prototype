import R from "ramda";

export const initialState = {
  isLoggedIn: false,
  errors: [],
  success: false,
  user : {
    id: "",
    email: "",
    firstname: "",
    lastname: "",
    password: ""
  },
  currentPath: "/",
  files: [],
  createFolderActive: false,
  newFolderName: '',
  shareFileFolderActive: false,
  sharedFileFolderName: '',
  sharedFileFolderIsDir: false,
  shareFileUserName: '',
  shareLinkCreated: false,
  shareLinkCopied: false,
  userGroups: [],
  selectedGroup: '',
  selectedGroupMembers: [],
  showGroupMembers: false
};

export default function update(state = initialState, action = null) {
  if(action.type === "updateFiles") {
    console.log('updaing files!!')
    const nextState = R.clone(state);
    nextState.files = action.userFiles;
    return nextState;
  } else if(action.type === "updateUser") {
    const nextState = R.clone(state);
    nextState.user.id = action.user.id;
    nextState.isLoggedIn = action.isLoggedIn;
    nextState.success = action.success;
    return nextState;
  } else if(action.type === "login") {
    const nextState = R.clone(state);
    nextState.isLoggedIn = action.isLoggedIn;
    return nextState;
  } else if(action.type === "error") {
    const nextState = R.clone(state);
    nextState.errors.push(action.errorMessage);
    nextState.isLoggedIn = action.isLoggedIn;
    return nextState;
  } else if(action.type === "loginFormChange") {
    const nextState = R.clone(state);
    const data = action.data;
    nextState.user[data.field] = data.value;
    return nextState;
  }else if(action.type === "signupFormChange") {
    const nextState = R.clone(state);
    const data = action.data;
    nextState.user[data.field] = data.value;
    return nextState;
  }else if(action.type === "success") {
    const nextState = R.clone(state);
    nextState.success = true;
    return nextState;
  }else if(action.type === "toggleCreateFolderModal") {
    const nextState = R.clone(state);
    nextState.createFolderActive = action.createFolderActive;
    return nextState;
  }else if(action.type === "createNewFolder") {
    const nextState = R.clone(state);
    nextState.newFolderName = action.newFolderName;
    return nextState;
  }else if(action.type === "toggleShareFileFolderModal") {
    const nextState = R.clone(state);
    nextState.shareFileFolderActive = action.shareFileFolderActive;
    nextState.sharedFileFolderName = action.sharedFileFolderName;
    nextState.sharedFileFolderIsDir = action.sharedFileFolderIsDir;
    return nextState;
  }else if(action.type === "toggleShareLinkCreated"){
    const nextState = R.clone(state);
    nextState.shareLinkCreated = action.shareLinkCreated;
    return nextState;
  }else if(action.type === "toggleShareLinkCopied"){
    const nextState = R.clone(state);
    nextState.shareLinkCopied = action.shareLinkCopied;
    nextState.shareLinkCreated = !nextState.shareLinkCreated;
    return nextState;
  }else if(action.type === "shareWithUser") {
    const nextState = R.clone(state);
    nextState.shareFileUserName = action.shareFileUserName;
    return nextState;
  }else if(action.type === "updateUserGroups") {
    const nextState = R.clone(state);
    nextState.userGroups = action.userGroups;
    return nextState;
  }else if(action.type === "toggleShowGroupMembers") {
    const nextState = R.clone(state);
    nextState.selectedGroup = action.selectedGroup;
    nextState.selectedGroupMembers = action.selectedGroupMembers;
    nextState.showGroupMembers = !nextState.showGroupMembers;
    return nextState;
  }else if(action.type === "deleteGroupMember") {
    const nextState = R.clone(state);
    var members = nextState.selectedGroupMembers;
    nextState.selectedGroupMembers.pop({'name' : action.member});
    nextState.selectedGroupMembers = nextState.selectedGroupMembers;
    return nextState;
  }
  return state;
}
