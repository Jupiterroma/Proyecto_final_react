import React, { useEffect } from 'react';
import { Button, View, Text, Platform, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configura el comportamiento de las notificaciones cuando la app está en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    (async () => {
      // Solicitar permisos de notificación
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesitan permisos para mostrar notificaciones.');
        return;
      }

      // Configurar canal de notificaciones en Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }

      // Programar la notificación repetitiva
      await scheduleRepeatingNotification();
    })();
  }, []);

  const scheduleRepeatingNotification = async () => {
    // Cancelar notificaciones previas para evitar duplicados
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Programar notificación cada 5 minutos
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Recordatorio',
        body: 'Han pasado 5 minutos.',
      },
      trigger: {
        seconds: 300, // 5 minutos = 300 segundos
        repeats: true,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones cada 5 minutos</Text>
      <Button title="Reprogramar notificación" onPress={scheduleRepeatingNotification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});
