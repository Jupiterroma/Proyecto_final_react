import * as LocalAuthentication from 'expo-local-authentication';

export const autenticarBiometricamente = async () => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();

  if (!compatible || !enrolled) {
    return { success: false, message: 'Biometría no disponible o no configurada.' };
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Autenticación biométrica',
    fallbackLabel: 'Usar contraseña',
    cancelLabel: 'Cancelar',
  });

  return result;
};
