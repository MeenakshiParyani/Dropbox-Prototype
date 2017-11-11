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
  newFolderName: ''
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
  }
  return state;
}
