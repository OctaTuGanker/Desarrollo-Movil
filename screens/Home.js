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

const TAB_HEIGHT = 65; // altura del Tab Navigator (60 + 5)

export default function Home({ navigation }) {
  const [showWelcome, setShowWelcome] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Oculta el menú inferior durante la bienvenida
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setShowWelcome(false);
        // Vuelve a mostrar el menú inferior
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 0.5,
            borderTopColor: "#ccc",
            height: 60,
            paddingBottom: 5,
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={[
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

        {/* Botones principales */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardText}>Nuestros Cursos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardText}>Admisiones</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardText}>Vida Estudiantil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoWelcome: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  titleWelcome: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#922b21",
    textAlign: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#922b21",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  menuIcon: {
    color: "#fff",
    fontSize: 24,
  },
  imageContainer: {
    marginTop: 15,
    alignSelf: "center",
    borderRadius: 10,
    overflow: "hidden",
    width: "90%",
  },
  banner: {
    width: "100%",
    height: 180,
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  bannerSubtitle: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  buttonsContainer: {
    marginTop: 25,
    alignItems: "center",
  },
  card: {
    width: "85%",
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});