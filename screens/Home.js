// screens/Home.js

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../src/config/firebaseConfig";
// --- 1. IMPORTAR EL BACKGROUND WRAPPER ---
import BackgroundWrapper from "../src/components/BackgroundWrapper"; 

const TAB_HEIGHT = 65; // altura del Tab Navigator (60 + 5)

export default function Home({ navigation }) {
  const [showWelcome, setShowWelcome] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Lógica para ocultar/mostrar la barra de pestañas (tab bar)
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setShowWelcome(false);
        // Lógica para restaurar la barra de pestañas
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 0.5,
            borderTopColor: "#ccc",
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom - 5 : 5,
          },
        });
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al cerrar sesión.");
    }
  };

  if (showWelcome) {
    // 3. La pantalla de bienvenida se deja sin el BackgroundWrapper
    return (
      <Animated.View style={[styles.welcomeContainer, { opacity: fadeAnim }]}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logoWelcome}
          resizeMode="contain"
        />
        <Text style={styles.titleWelcome}>
          Bienvenido al Instituto Superior del Milagro
        </Text>
      </Animated.View>
    );
  }

  // --- 2. REEMPLAZO DE SafeAreaView POR BackgroundWrapper ---
  return (
    // Reemplazamos la SafeAreaView principal por el BackgroundWrapper.
    // Usamos View adentro para simular el comportamiento de SafeAreaView si es necesario, 
    // y para aplicar el fondo blanco (¡quitamos el fondo blanco para ver el patrón!)
    <BackgroundWrapper> 
      {/* Usamos View para aplicar los insets de SafeArea y el color de fondo si lo deseas. 
          Aquí la he quitado para que el fondo del patrón se vea, ¡pero el header debe estar dentro de la zona segura! */}
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        
        <ScrollView
          contentContainerStyle={[
            // Es importante quitar el backgroundColor: '#fff' de scrollContainer si lo tuviera,
            // pero lo tiene aplicado en el styles.scrollContainer, ¡lo quitamos en la sección de estilos!
            styles.scrollContainer,
            { paddingBottom: insets.bottom + TAB_HEIGHT + 20 },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>ISDEM</Text>
            <TouchableOpacity onPress={handleLogOut}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
          </View>

          {/* Resto del contenido de tu Home */}
          {/* Imagen principal */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/banner.jpg")}
              style={styles.banner}
              resizeMode="cover"
            />
            <View style={styles.overlay}>
              <Text style={styles.bannerTitle}>
                Formando los profesionales del futuro
              </Text>
              <Text style={styles.bannerSubtitle}>
                con excelencia académica y valores.
              </Text>
            </View>
          </View>

          {/* Botones principales*/}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate('Cursos')}
            >
              <Text style={styles.cardText}>Nuestros Cursos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate('Admisiones')}
            >
              <Text style={styles.cardText}>Admisiones</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate('Vida Estudiantil')}
            >
              <Text style={styles.cardText}>Vida Estudiantil</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

// --- AJUSTE DE ESTILOS ---
// Debes **eliminar el fondo blanco** de los contenedores que no quieras que lo tengan.
const styles = StyleSheet.create({
  // ... estilos de bienvenida sin cambios ...
  welcomeContainer: {
    flex: 1,
    backgroundColor: "#fff", // Dejar el fondo blanco en la pantalla de bienvenida
    alignItems: "center",
    justifyContent: "center",
  },
  // ...

  // AJUSTE CRÍTICO: QUITAR EL FONDO BLANCO DEL SCROLLVIEW
  scrollContainer: {
    flexGrow: 1,
    // CAMBIO: Quitar backgroundColor: "#fff" para que se vea el fondo de patrón
    backgroundColor: "transparent", 
  },
  // ... el resto de tus estilos se mantienen ...
});