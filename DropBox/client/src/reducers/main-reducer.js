import R from "ramda";

export const initialState = {
  isLoggedIn: false,
  errors: [],
  user : {
    id: "",
    email: "",
    firstname: "",
    password: ""
  },
  files: []
};

export default function update(state = initialState, action = null) {
  if(action.type === "updateFiles") {
    state.files = action.files;
  } else if(action.type === "updateUser") {
    const nextState = R.clone(state);
    nextState.user = action.user;
    nextState.isLoggedIn = action.isLoggedIn;
    return nextState;
  } else if(action.type === "login") {
    return {
      ...state,
      isLoggedIn : action.isLoggedIn
    };
  } else if(action.type === "error") {
    state.errors.push(action.errorMessage);
    state.isLoggedIn = action.isLoggedIn;
  } else if(action.type === "loginFormChange") {
    const nextState = R.clone(state);
    const data = action.data;
    nextState.user[data.field] = data.value;
    return nextState;
  }else if(action.type === "updateFiles") {
    const nextState = R.clone(state);
    nextState.userFiles = action.userFiles;
    return nextState;
  }
  return state;
}
