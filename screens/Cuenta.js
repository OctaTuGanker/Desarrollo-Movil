import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 

// Importamos el Background Wrapper y el sistema de autenticación
import BackgroundWrapper from '../src/components/BackgroundWrapper'; 
import { signOut } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { useAuth } from "../contexts/AuthContext"; 

const COLOR_PRIMARY = '#922b21'; // Color principal para coherencia

// Datos de ejemplo. En una aplicación real, obtendrías esto de Firebase/Estado
const mockUser = {
    displayName: auth.currentUser?.name || "Estudiante Ejemplo",
    email: auth.currentUser?.email || "usuario@instituto.edu.ar",
    carrera: "Desarrollo de Software",
    matricula: "2024-5001",
};

export default function Cuenta({ navigation }) {
    const { user, role, userData } = useAuth();
    mockUser.displayName = userData?.firstName + " " + userData?.lastName;
    mockUser.email = userData?.email;
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            Alert.alert("Error", "No se pudo cerrar la sesión correctamente.");
        }
    };

    const handleSettings = () => {
        Alert.alert("Configuración", "Funcionalidad para gestionar perfil (cambiar contraseña, etc.) en desarrollo.");
    };

    return (
        <BackgroundWrapper>
            <View style={styles.container}>
                
                {/* 1. SECCIÓN DE INFORMACIÓN DEL PERFIL */}
                <View style={styles.profileCard}>
                    <Ionicons name="person-circle-outline" size={80} color={COLOR_PRIMARY} />
                    
                    <Text style={styles.userName}>{mockUser.displayName}</Text>
                    <Text style={styles.userEmail}>{mockUser.email}</Text>
                    
                    <View style={styles.infoRow}>
                        <MaterialIcons name="computer" size={18} color="#666" />
                        <Text style={styles.infoText}>Carrera: {mockUser.carrera}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="credit-card" size={18} color="#666" />
                        <Text style={styles.infoText}>Matrícula: {mockUser.matricula}</Text>
                    </View>
                </View>

                {/* 2. SECCIÓN DE OPCIONES */}
                <View style={styles.optionsSection}>
                    <TouchableOpacity style={styles.optionButton} onPress={handleSettings}>
                        <Ionicons name="settings-outline" size={24} color={COLOR_PRIMARY} />
                        <Text style={styles.optionText}>Configuración del Perfil</Text>
                        <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color="red" />
                        <Text style={[styles.optionText, { color: 'red' }]}>Cerrar Sesión</Text>
                        <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
                    </TouchableOpacity>
                </View>
                
            </View>
        </BackgroundWrapper>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        alignItems: 'center',
        backgroundColor: 'transparent', 
        padding: 20,
    },
    
    // ESTILOS DE LA TARJETA PRINCIPAL DEL PERFIL
    profileCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 30,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, 
    },
    userName: {
        fontSize: 22, 
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333'
    },
    userEmail: {
        fontSize: 14,
        color: '#888',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    infoText: {
        fontSize: 16,
        color: '#555',
        marginLeft: 10,
    },

    // ESTILOS DE LA SECCIÓN DE OPCIONES
    optionsSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        width: '100%',
        maxWidth: 400,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, 
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        justifyContent: 'space-between',
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 15,
        color: '#333'
    }
});