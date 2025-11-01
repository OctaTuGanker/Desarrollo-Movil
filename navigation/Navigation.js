import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { AuthProvider, useAuth } from '../contexts/AuthContext';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Home from '../screens/Home';
import Cursos from '../screens/Cursos';
import Admisiones from '../screens/Admisiones';
import VidaEstudiantil from '../screens/VidaEstudiantil';
import Cuenta from '../screens/Cuenta';
import Profesores from '../screens/Profesores';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs (Inicio, Cursos, etc.)
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
          height: 60 + insets.bottom,
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

// Navegador principal
function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#922b21" />
      </View>
    );
  }

  // Pantallas según si hay usuario o no
  const screens = !user
    ? [
        { name: 'Login', component: Login },
        { name: 'SignUp', component: SignUp },
      ]
    : [
        { name: 'MainTabs', component: BottomTabs },
        { name: 'Profesores', component: Profesores },
        { name: 'SignUp', component: SignUp }, // AÑADIDO: SignUp disponible cuando estás logueado
      ];

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {screens.map(s => (
        <Stack.Screen key={s.name} name={s.name} component={s.component} />
      ))}
    </Stack.Navigator>
  );
}

// App principal
export default function Navigation() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});