// src/views/DetailPlantaPage.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, Button
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';

// logos
import logoAlbahaca from '../../assets/logos/albahaca.png';
import logoCactus   from '../../assets/logos/cactus.png';
import logoTomillo  from '../../assets/logos/tomillo.png';
import logoMenta    from '../../assets/logos/menta.png';
import logoLavanda  from '../../assets/logos/lavanda.png';
import { scheduleWaterReminder } from '../utils/notifications';



const logoMap = {
  albahaca: logoAlbahaca,
  cactus:   logoCactus,
  tomillo:  logoTomillo,
  menta:    logoMenta,
  lavanda:  logoLavanda,
};

const Tab = createMaterialTopTabNavigator();

function useHumidity(lastISO, freqMinutes) {
  const calc = () => {
    const minutes = (Date.now() - new Date(lastISO)) / (1000 * 60);
    return Math.max(0, 100 - (minutes / freqMinutes) * 100).toFixed(0);
  };
  const [hum, setHum] = useState(calc());
  React.useEffect(() => {
    setHum(calc());
    const id = setInterval(() => setHum(calc()), 10000);
    return () => clearInterval(id);
  }, [lastISO, freqMinutes]);
  return hum;
}

function InfoScreen({ route }) {
  const { plant, tipo } = route.params;
  const [lastISO, setLastISO] = useState(plant.last_watered_date);
  const humedad = useHumidity(lastISO, tipo.frequency_days);

  let bannerStyle = styles.greenBanner, bannerText = 'Bien hidratada';
  if (humedad < 30) {
    bannerStyle = styles.redBanner;
    bannerText = '¡Urgente!';
  } else if (humedad < 60) {
    bannerStyle = styles.yellowBanner;
    bannerText = '¡Pronto riego!';
  }

  const handleRegar = async () => {
    const auth = getAuth(), db = getDatabase(), user = auth.currentUser;
    if (!user) return;
    const nowISO = new Date().toISOString();
    // historial
    const histRef = ref(db, `user_plants/${user.uid}/${plant.id}/history`);
    await set(push(histRef), { watered_at: nowISO });
    // último riego
    const lrRef = ref(db, `user_plants/${user.uid}/${plant.id}/last_watered_date`);
    await set(lrRef, nowISO);
    setLastISO(nowISO);
    // tras actualizar last_watered_date:
    const freqSeconds = tipo.frequency_days * 60;
    await scheduleWaterReminder(plant.id, freqSeconds, tipo.name);
  };

  return (
    <View style={styles.infoContainer}>
      <View style={bannerStyle}>
        <Text style={styles.bannerText}>{bannerText}</Text>
      </View>
      <Image source={logoMap[tipo.id]} style={styles.detailLogo} />
      <Text style={styles.detailName}>{tipo.name}</Text>
      <Text style={[styles.humidityText, bannerStyle]}>{humedad}%</Text>
      <Button title="Regar" onPress={handleRegar} color="#2196F3" />
    </View>
  );
}

function HistorialScreen({ route }) {
  const { plant } = route.params;
  const [history, setHistory] = React.useState([]);
  React.useEffect(() => {
    const auth = getAuth(), db = getDatabase(), user = auth.currentUser;
    if (!user) return;
    const hRef = ref(db, `user_plants/${user.uid}/${plant.id}/history`);
    return onValue(hRef, snap => {
      const data = snap.val() || {};
      setHistory(Object.values(data).map(x => x.watered_at).reverse());
    });
  }, []);

  return (
    <View style={styles.infoContainer}>
      {history.length === 0
        ? <Text>No hay historial.</Text>
        : history.map((ts,i) => (
            <Text key={i} style={styles.historyItem}>
              {new Date(ts).toLocaleString()}
            </Text>
          ))
      }
    </View>
  );
}

export default function DetailPlantaPage() {
  const { plant, tipo: rawTipo } = useRoute().params;
  const tipo = {
    ...rawTipo,
    frequency_days: Number(rawTipo.frequency_days),
  };
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: '#2e7d32' },
        tabBarLabelStyle:     { fontWeight: 'bold' }
      }}
    >
      <Tab.Screen name="Info"     component={InfoScreen}     initialParams={{ plant, tipo }} />
      <Tab.Screen name="Historial" component={HistorialScreen} initialParams={{ plant }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    flex:1, alignItems:'center', padding:20, backgroundColor:'#fff'
  },
  detailLogo:   { width:150, height:150, resizeMode:'contain', marginVertical:16 },
  detailName:   { fontSize:24, fontWeight:'bold', marginBottom:8 },
  humidityText: { fontSize:20, marginVertical:8 },
  greenBanner:  { backgroundColor:'#c8e6c9', padding:10, borderRadius:4, marginBottom:16 },
  yellowBanner: { backgroundColor:'#fff9c4', padding:10, borderRadius:4, marginBottom:16 },
  redBanner:    { backgroundColor:'#ffcdd2', padding:10, borderRadius:4, marginBottom:16 },
  bannerText:   { fontWeight:'bold' },
  historyItem:  { fontSize:16, marginVertical:4 },
});
