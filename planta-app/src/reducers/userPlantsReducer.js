// src/reducers/userPlantsReducer.js
import { ADD_USER_PLANT, ADD_USER_PLANT_ERROR } from '../action_types/plantas';

const initialState = {
  list: [],
  error: null
};

export default function userPlantsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_USER_PLANT:
      return {
        ...state,
        list:  [...state.list, action.payload],
        error: null
      };
    case ADD_USER_PLANT_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
}
