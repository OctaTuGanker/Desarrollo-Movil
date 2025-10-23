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
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../src/config/firebaseConfig";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext"; // Ajusta la ruta según tu estructura

const TAB_HEIGHT = 65;

export default function Home({ navigation }) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();
  
  const { user, role, userData } = useAuth();

  useEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setShowWelcome(false);
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
    setMenuVisible(false);
    try {
      await signOut(auth);
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al cerrar sesión.");
    }
  };

  const handleCreateUser = () => {
    setMenuVisible(false);
    navigation.navigate("SignUp");
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
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
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

      {/* Modal del menú desplegable */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuContainer}>
                {/* Información del usuario */}
                <View style={styles.userInfo}>
                  <FontAwesome5
                    name={role === "Profesor" ? "chalkboard-teacher" : "user-graduate"}
                    size={24}
                    color="#922b21"
                  />
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>
                      {userData?.firstName} {userData?.lastName}
                    </Text>
                    <Text style={styles.userRole}>{role}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Opción: Crear usuario (solo para Profesores) */}
                {(role === "Admin" || role === "Profesor") && (
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleCreateUser}
                  >
                    <FontAwesome5 name="user-plus" size={18} color="#333" />
                    <Text style={styles.menuText}>Crear usuario</Text>
                  </TouchableOpacity>
                )}

                {/* Opción: Cerrar sesión */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleLogOut}
                >
                  <FontAwesome5 name="sign-out-alt" size={18} color="#d32f2f" />
                  <Text style={[styles.menuText, styles.logoutText]}>
                    Cerrar sesión
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  // Estilos del menú desplegable
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 60,
    marginRight: 15,
    minWidth: 250,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  userRole: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  logoutText: {
    color: "#d32f2f",
    fontWeight: "500",
  },
});