import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT_SUCCESS, LOGOUT_FAILED } from '../action_types/firebase_auth';
import { auth } from '../firebase/config';
import { Vibration } from 'react-native';
import { saveCredentials, deleteCredentials } from '../utils/secureStore';


export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: user.displayName,
    photoURL: user.photoURL,
  },
});

export const loginFailed = (error) => ({
  type: LOGIN_FAILED,
  payload: error,
});

export const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS,
});

export const logoutFailed = (error) => ({
  type: LOGOUT_FAILED,
  payload: error,
});

export const loginUser = (email, password) => async (dispatch) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    dispatch(loginSuccess(userCredential.user));
    await saveCredentials(email, password);
  } catch (error) {
    Vibration.vibrate();
    dispatch(loginFailed(error.message));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await signOut(auth);
    dispatch(logoutSuccess());
    await deleteCredentials();
  } catch (error) {
    dispatch(logoutFailed(error.message));
  }
};

