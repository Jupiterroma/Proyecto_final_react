// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { firebaseReducer as firebase } from '../reducers/firebaseReducer';
import userPlantsReducer from '../reducers/userPlantsReducer';

export const ConfigureStore = () => {
  const store = configureStore({
    reducer: {
      firebase,
      userPlants: userPlantsReducer,
      
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, 
      }),
  });

  return store;
};
