import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Switch,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../actions/firebase_auth';
import { autenticarBiometricamente } from '../utils/biometria';
import {
  saveBiometricPreference,
  getBiometricPreference,
  getCredentials,
} from '../utils/secureStore';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberBiometry, setRememberBiometry] = useState(false);
  const dispatch = useDispatch();
  const error = useSelector((state) => state.firebase.error);

  const handleLogin = async () => {
    await saveBiometricPreference(rememberBiometry);
    dispatch(loginUser(email, password));
  };

  useEffect(() => {
    const tryAutoLogin = async () => {
      const { email, password } = await getCredentials();
      const enabled = await getBiometricPreference();

      if (enabled && email && password) {
        const result = await autenticarBiometricamente();
        if (result.success) {
          dispatch(loginUser(email, password));
        }
      }
    };

    tryAutoLogin();
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/fondo.webp')}
      style={styles.background}
      resizeMode="cover"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          <View style={styles.box}>
            <Text style={styles.title}>Iniciar sesión</Text>

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Recordar con huella</Text>
              <Switch
                value={rememberBiometry}
                onValueChange={setRememberBiometry}
              />
            </View>

            <Button title="Entrar" onPress={handleLogin} color="#2e7d32" />

            {error && <Text style={styles.error}>{error}</Text>}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  box: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#2e7d32',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#333',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  switchText: {
    fontSize: 16,
    color: '#2e7d32',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});
