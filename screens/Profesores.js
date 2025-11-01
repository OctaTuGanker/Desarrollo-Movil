import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { getFirestore, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundWrapper from "../src/components/BackgroundWrapper";

export default function Profesores() {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("role", "==", "Profesor"),
          orderBy("email", "asc") // o "desc"
        );

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProfesores(data);
      } catch (error) {
        console.error("Error al obtener profesores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfesores();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#922b21" />
        <Text style={styles.loadingText}>Cargando profesores...</Text>
      </View>
    );
  }

  if (profesores.length === 0) {
    return (
      <BackgroundWrapper>
        <SafeAreaView style={styles.container}>
          <Text style={styles.emptyText}>No hay profesores registrados.</Text>
        </SafeAreaView>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Profesores registrados</Text>
        <FlatList
          data={profesores}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Ionicons name="person-circle-outline" size={40} color="#922b21" />
              <View style={styles.info}>
                <Text style={styles.name}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.email}>{item.email}</Text>
                {item.createdAt ? (
                  <Text style={styles.date}>
                    Registrado el{" "}
                    {new Date(item.createdAt.seconds * 1000).toLocaleDateString()}
                  </Text>
                ) : (
                  <Text style={styles.date}>Fecha no disponible</Text>
                )}
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#922b21",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  info: {
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  email: {
    color: "#555",
  },
  date: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    color: "#555",
    fontSize: 16,
    marginTop: 50,
  },
});