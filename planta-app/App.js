// App.js
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';

import AppNavigator from './src/navigation/AppNavigator';
import { ConfigureStore } from './src/store/store';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner:  true,
    shouldShowList:    true,
    shouldPlaySound:   false,
    shouldSetBadge:    false,
  }),
});

export default function App() {
  const store = ConfigureStore();

  useEffect(() => {
    (async () => {
      // 1️⃣ Pedir permisos de notificación
      const { status } = await Notifications.requestPermissionsAsync();
      console.log('Permisos notificaciones:', status);

      // 2️⃣ Crear canal para Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('watering-reminders', {
          name: 'Recordatorios de riego',
          importance: AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
        console.log('Canal watering-reminders creado');
      }
    })();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
