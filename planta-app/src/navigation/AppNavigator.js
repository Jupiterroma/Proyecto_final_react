import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator }   from '@react-navigation/bottom-tabs';
import { useSelector }                from 'react-redux';
import { MaterialCommunityIcons }     from '@expo/vector-icons';

import AuthPage        from '../views/AuthPage';
import HomePage        from '../views/HomePage';
import MisPlantasPage  from '../views/MisPlantasPage';
import AddPlantaPage   from '../views/AddPlantaPage';
import DetailPlantaPage from '../views/DetailPlantaPage';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2e7d32',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let icon;
          if (route.name === 'Home')       icon = 'home-outline';
          if (route.name === 'MisPlantas') icon = 'leaf';
          if (route.name === 'AddPlant')   icon = 'plus-box-outline';
          return <MaterialCommunityIcons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"       component={HomePage}       options={{ title: 'Inicio' }} />
      <Tab.Screen name="MisPlantas" component={MisPlantasPage} options={{ title: 'Mis Plantas' }} />
      <Tab.Screen name="AddPlant"   component={AddPlantaPage}   options={{ title: 'Añadir' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const user = useSelector(state => state.firebase.user);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user
        ? <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="DetailPlanta" component={DetailPlantaPage}
              options={{ headerShown: true, title: 'Detalle Planta' }}
            />
          </>
        : <Stack.Screen name="Auth" component={AuthPage} />
      }
    </Stack.Navigator>
  );
}
