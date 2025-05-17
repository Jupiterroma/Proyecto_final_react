// src/views/MisPlantasPage.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useSelector } from 'react-redux';

// logos
import logoAlbahaca from '../../assets/logos/albahaca.png';
import logoCactus   from '../../assets/logos/cactus.png';
import logoTomillo  from '../../assets/logos/tomillo.png';
import logoMenta    from '../../assets/logos/menta.png';
import logoLavanda  from '../../assets/logos/lavanda.png';

const logoMap = {
  albahaca: logoAlbahaca,
  cactus:   logoCactus,
  tomillo:  logoTomillo,
  menta:    logoMenta,
  lavanda:  logoLavanda,
};

// hook para humedad en tiempo real
function useHumidity(lastWateredISO, frequencyMinutes) {
  const calc = () => {
    const minutes = (Date.now() - new Date(lastWateredISO)) / (1000 * 60);
    return Math.max(0, 100 - (minutes / frequencyMinutes) * 100).toFixed(0);
  };
  const [hum, setHum] = useState(calc());
  useEffect(() => {
    setHum(calc());
    const id = setInterval(() => setHum(calc()), 10000);
    return () => clearInterval(id);
  }, [lastWateredISO, frequencyMinutes]);
  return hum;
}

// componente tarjeta de planta
function PlantCard({ plant, tipo, navigation }) {
  const humedad = useHumidity(
    plant.last_watered_date,
    tipo.frequency_days
  );
  let color = '#2e7d32';
  if (humedad < 30) color = '#d32f2f';
  else if (humedad < 60) color = '#fbc02d';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetailPlanta', { plant, tipo })}
    >
      <Image source={logoMap[tipo.id]} style={styles.logo} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{tipo.name}</Text>
        <Text style={{ color, fontSize: 16 }}>{humedad}%</Text>
        <Text style={styles.small}>
          Último: {new Date(plant.last_watered_date).toLocaleTimeString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function MisPlantasPage({ navigation }) {
  const [plants, setPlants]       = useState([]);
  const [plantTypes, setTypes]    = useState({});
  const user = getAuth().currentUser;

  useEffect(() => {
    const db = getDatabase();
    const typesRef  = ref(db, 'plant_types');
    const unsubTypes = onValue(typesRef, snap => {
      setTypes(snap.val() || {});
    });

    let unsubPlants = () => {};
    if (user) {
      const upRef = ref(db, `user_plants/${user.uid}`);
      unsubPlants = onValue(upRef, snap => {
        const data = snap.val() || {};
        setPlants(Object.entries(data).map(([id, p]) => ({ id, ...p })));
      });
    }

    return () => {
      unsubTypes();
      unsubPlants();
    };
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={plants}
        keyExtractor={i => i.id}
        renderItem={({ item }) => {
          const tipo = plantTypes[item.type_id];
          return tipo
            ? <PlantCard plant={item} tipo={tipo} navigation={navigation}/>
            : null;
        }}
        ListEmptyComponent={<Text style={styles.empty}>Sin plantas.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  card: { flexDirection: 'row', marginBottom: 12,
    padding: 12, backgroundColor: '#f9f9f9', borderRadius: 8,
    alignItems: 'center'
  },
  logo: { width: 50, height: 50, marginRight: 12, resizeMode: 'contain' },
  name: { fontSize: 18, fontWeight: 'bold' },
  small: { fontSize: 12, color: '#666' },
  empty: { textAlign: 'center', marginTop: 20, color: '#666' },
});
