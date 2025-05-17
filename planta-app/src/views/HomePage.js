// src/views/HomePage.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../actions/firebase_auth';

export default function HomePage({ navigation }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigation.replace('Auth');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido 🌱</Text>

      {/* Botón para navegar a AddPlantaPage */}
      <Button
        title="➕ Añadir nueva planta"
        onPress={() => navigation.navigate('AddPlant')}
        color="#2e7d32"
      />

      <View style={{ height: 20 }} />

      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  title:     { fontSize:24, fontWeight:'bold', marginBottom:20 },
});
