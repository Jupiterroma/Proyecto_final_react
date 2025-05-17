// src/views/AddPlantaPage.js
import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch } from 'react-redux';
import { addUserPlant } from '../actions/plantas';

// Importa tus logos
import logoAlbahaca from '../../assets/logos/albahaca.png';
import logoCactus   from '../../assets/logos/cactus.png';
import logoTomillo  from '../../assets/logos/tomillo.png';
import logoMenta    from '../../assets/logos/menta.png';
import logoLavanda  from '../../assets/logos/lavanda.png';
import { scheduleWaterReminder } from '../utils/notifications';

// Define la lista de opciones
const plantOptions = [
  { id: 'albahaca', label: 'Albahaca', logo: logoAlbahaca },
  { id: 'cactus',   label: 'Cactus',   logo: logoCactus },
  { id: 'tomillo',  label: 'Tomillo',  logo: logoTomillo },
  { id: 'menta',    label: 'Menta',    logo: logoMenta },
  { id: 'lavanda',  label: 'Lavanda',  logo: logoLavanda },
];

export default function AddPlantaPage({ navigation }) {
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [selectedPlant, setSelectedPlant] = useState(plantOptions[0].id);

  useEffect(() => {
    setSelectedPlant(plantOptions[index].id);
  }, [index]);

  const onPickerChange = (value) => {
    const idx = plantOptions.findIndex(p => p.id === value);
    if (idx >= 0) setIndex(idx);
    setSelectedPlant(value);
  };

  const handleAdd = async () => {
    await dispatch(addUserPlant(selectedPlant));
    const tipo = plantOptions.find(p => p.id === selectedPlant);
   if (tipo) {
     
     await scheduleWaterReminder(
       selectedPlant,           // id de la planta
       tipo.frequency_days,     // minutos hasta el recordatorio
       tipo.label               // nombre para el mensaje
     );
   }
    navigation.goBack();
  };

  const prev = () => setIndex((index + plantOptions.length - 1) % plantOptions.length);
  const next = () => setIndex((index + 1) % plantOptions.length);
  const current = plantOptions[index];

  return (
    <View style={styles.container}>
      {/* Carrusel centrado verticalmente */}
      <View style={styles.carousel}>
        <TouchableOpacity onPress={prev} style={styles.arrow}>
          <Text style={styles.arrowText}>◀</Text>
        </TouchableOpacity>

        <View style={styles.imageBox}>
          <Image source={current.logo} style={styles.logo} />
          <Text style={styles.imageLabel}>{current.label}</Text>
        </View>

        <TouchableOpacity onPress={next} style={styles.arrow}>
          <Text style={styles.arrowText}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Picker + Botón */}
      <View style={styles.form}>
        <Text style={styles.label}>Selecciona un tipo de planta:</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={selectedPlant}
            onValueChange={onPickerChange}
          >
            {plantOptions.map(p => (
              <Picker.Item key={p.id} label={p.label} value={p.id} />
            ))}
          </Picker>
        </View>
        <Button title="Añadir planta" onPress={handleAdd} color="#2e7d32" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',    // centrar todo verticalmente
    backgroundColor: '#fff'
  },
  carousel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  arrow: {
    padding: 10,
  },
  arrowText: {
    fontSize: 24,
    color: '#2e7d32',
  },
  imageBox: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  imageLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  form: {
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
});
