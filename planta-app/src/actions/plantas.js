// src/actions/plantas.js
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, push, set } from 'firebase/database';
import { ADD_USER_PLANT, ADD_USER_PLANT_ERROR } from '../action_types/plantas';
import { app } from '../firebase/config';

// Instancias de Auth y Database usando tu config existente
const auth     = getAuth(app);
const database = getDatabase(app);

export const addUserPlant = (typeId) => {
  return async (dispatch) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Usuario no autenticado');

      console.log('[addUserPlant] uid:', user.uid);

      // referencia a /user_plants/{uid}
      const plantRef    = ref(database, `user_plants/${user.uid}`);
      const newPlantRef = push(plantRef);

      const newPlant = {
        type_id:           typeId,
        last_watered_date: new Date().toISOString(),
      };

      console.log('[addUserPlant] escribiendo en:', newPlantRef.toString(), newPlant);

      await set(newPlantRef, newPlant);

      console.log('[addUserPlant] ¡Éxito!, key:', newPlantRef.key);

      dispatch({
        type:    ADD_USER_PLANT,
        payload: { id: newPlantRef.key, ...newPlant }
      });
    } catch (error) {
      console.error('[addUserPlant] ERROR:', error);
      dispatch({
        type:    ADD_USER_PLANT_ERROR,
        payload: error.message
      });
    }
  };
};
