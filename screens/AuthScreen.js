// screens/AuthScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function AuthScreen({ navigation }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleAuth();
  }, []);

  const handleAuth = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !enrolled) {
      Alert.alert("Error", "El dispositivo no tiene huella configurada.");
      setLoading(false);
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autenticación con huella digital',
      disableDeviceFallback: true,
      cancelLabel: 'Cancelar',
    });

    if (result.success) {
      navigation.replace('MainMenu');
    } else {
      Alert.alert("Falló la autenticación", "No se pudo verificar la huella.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 20 }}>Verificando huella digital...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
});
