import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Pantallas
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Home from '../screens/Home';
import Cursos from '../screens/Cursos';
import Admisiones from '../screens/Admisiones';
import VidaEstudiantil from '../screens/VidaEstudiantil';
import Cuenta from '../screens/Cuenta';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Menú inferior con íconos y safe area
function BottomTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#922b21',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0.5,
          borderTopColor: '#ccc',
          paddingBottom: insets.bottom + 5,
          height: 60 + insets.bottom, // asegura espacio para barra de sistema
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          switch (route.name) {
            case 'Inicio': iconName = focused ? 'home' : 'home-outline'; break;
            case 'Cursos': iconName = focused ? 'book' : 'book-outline'; break;
            case 'Admisiones': iconName = focused ? 'school' : 'school-outline'; break;
            case 'Vida Estudiantil': iconName = focused ? 'calendar' : 'calendar-outline'; break;
            case 'Cuenta': iconName = focused ? 'person' : 'person-outline'; break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={Home} />
      <Tab.Screen name="Cursos" component={Cursos} />
      <Tab.Screen name="Admisiones" component={Admisiones} />
      <Tab.Screen name="Vida Estudiantil" component={VidaEstudiantil} />
      <Tab.Screen name="Cuenta" component={Cuenta} />
    </Tab.Navigator>
  );
}

// Navegación principal (Login / Registro / App)
export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setIsAuthenticated(!!user);
    });
    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="SignUp" component={SignUp} />
            </>
          ) : (
            <Stack.Screen name="MainTabs" component={BottomTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
