import { LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT_SUCCESS, LOGOUT_FAILED } from '../action_types/firebase_auth';

const initialState = {
  user: null,
  error: null,
};

export const firebaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, user: action.payload, error: null };
    case LOGIN_FAILED:
      return { ...state, user: null, error: action.payload };
    case LOGOUT_SUCCESS:
      return { ...state, user: null, error: null };
    case LOGOUT_FAILED:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
