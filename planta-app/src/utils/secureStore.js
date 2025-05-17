import * as SecureStore from 'expo-secure-store';

// Guarda credenciales
export async function saveCredentials(email, password) {
  await SecureStore.setItemAsync('email', email);
  await SecureStore.setItemAsync('password', password);
}

// Obtiene credenciales
export async function getCredentials() {
  const email = await SecureStore.getItemAsync('email');
  const password = await SecureStore.getItemAsync('password');
  return { email, password };
}

// Elimina credenciales
export async function deleteCredentials() {
  await SecureStore.deleteItemAsync('email');
  await SecureStore.deleteItemAsync('password');
}

// Guarda preferencia de biometría
export async function saveBiometricPreference(remember) {
  await SecureStore.setItemAsync('rememberBiometry', remember ? 'true' : 'false');
}

// Lee preferencia de biometría
export async function getBiometricPreference() {
  const value = await SecureStore.getItemAsync('rememberBiometry');
  return value === 'true';
}
