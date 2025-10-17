import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
// Usamos Feather para el email y FontAwesome5 para el candado (mejoramos los imports)
import { FontAwesome5, FontAwesome, Feather } from '@expo/vector-icons'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { validateEmail, validatePassword } from '../utils/validation';
import { showAlert } from '../utils/showAlert';

// --- COMPONENTE DE PANTALLA DE LOGIN MEJORADO ---

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState({ email: '', password: '' });
    const [touched, setTouched] = useState({ email: false, password: false });

    const validateField = (field, value) => {
        let error = '';
        if (field === 'email') error = validateEmail(value) || '';
        if (field === 'password') error = validatePassword ? (validatePassword(value) || '') : (!value ? 'Debe ingresar su contraseña.' : '');
        setErrors(prev => ({ ...prev, [field]: error }));
        return !error;
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field, field === 'email' ? email : password);
    };

    const handleChange = (field, value) => {
        if (field === 'email') setEmail(value);
        if (field === 'password') setPassword(value);
        if (touched[field]) validateField(field, value);
    };

    const handleLogin = async () => {
        const emailOk = validateField('email', email);
        const passOk = validateField('password', password);
        setTouched({ email: true, password: true });
        if (!emailOk || !passOk) return;

        const emailError = validateEmail(email);
        if (emailError) { showAlert("Error", emailError); return; }

        if (!password) { showAlert("Error", "Debe ingresar su contraseña."); return; }

        // --- Lógica de Autenticación de Firebase (MANTENIDA) ---
        try {
            await signInWithEmailAndPassword(auth, email, password);
            //showAlert("Login exitoso", "Has iniciado sesión correctamente.");
            // Redirección exitosa a la pantalla 'Home'
            //navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        } catch (error) {
            let errorMessage = "Hubo un problema al iniciar sesión.";
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = "El formato del correo electrónico no es válido.";
                    break;
                case 'auth/wrong-password':
                    errorMessage = "La contraseña es incorrecta.";
                    break;
                case 'auth/user-not-found':
                    errorMessage = "No se encontró un usuario con este correo.";
                    break;
                case 'auth/network-request-failed':
                    errorMessage = "Error de conexión, por favor intenta más tarde.";
                    break;
                default:
                    console.error("Error de Firebase:", error);
            }
            Alert.alert("Error", errorMessage);
        }
    };

    return (
        // Contenedor que establece el fondo gris claro
        <View style={styles.pageContainer}> 
            <View style={styles.card}>{/* La tarjeta blanca central */}
                {/* Logo */}
                <Image 
                    source={require('../assets/logo.png')} 
                    style={styles.logo} 
                />
                <Text style={styles.title}>Iniciar Sesión</Text>
                {/* Campo Correo Electrónico */}
                <Text style={styles.label}>Correo Electrónico</Text> 
                <View style={[styles.inputWrapper, touched.email && errors.email ? styles.inputContainerError : null]}>
                    <Feather name="mail" size={20} color="#888" style={styles.inputIcon}/>
                    <TextInput
                        style={styles.input}
                        placeholder="tu.correo@ejemplo.com"
                        value={email}
                        onChangeText={(v) => handleChange('email', v)}
                        onBlur={() => handleBlur('email')}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                {touched.email && errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                {/* Campo Contraseña */}
                <Text style={styles.label}>Contraseña</Text>
                <View style={[styles.inputWrapper, touched.password && errors.password ? styles.inputContainerError : null]}>
                    <FontAwesome5 name="lock" size={18} color="#888" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="**********"
                        value={password}
                        onChangeText={(v) => handleChange('password', v)}
                        onBlur={() => handleBlur('password')}
                        secureTextEntry={!showPassword}
                    />
                    {/* Botón Ocultar/Mostrar Contraseña */}
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.togglePassword}>
                        <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#888" />
                    </TouchableOpacity>
                </View>
                {touched.password && errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                
                {/* Enlace: ¿No tienes cuenta? Registrarse */}
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.linkRegister}>
                    <Text style={styles.linkText}>¿No tienes cuenta? <Text style={styles.linkBold}>Registrarse.</Text></Text>
                </TouchableOpacity>

                {/* Botón Iniciar Sesión */}
                <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>

                {/* Enlace: ¿Olvidaste tu contraseña? */}
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.linkForgotPassword}>
                    <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
                
                {/* Footer / Derechos de autor */}
                <Text style={styles.footerText}>
                    © 2025 - Instituto Superior Del Milagro. Todos los derechos reservados.
                </Text>
            </View>
        </View>
    );
}

// --- ESTILOS MEJORADOS (COINCIDE CON EL DISEÑO DE TARJETA) ---

const COLOR_PRIMARY = '#8D1E2A'; // El color vino/rojo oscuro del diseño
const COLOR_BACKGROUND = '#F0F2F5'; // Fondo gris claro

const styles = StyleSheet.create({
    errorText: { alignSelf: 'flex-start', color: '#ff6b6b', fontSize: 12, marginBottom: 12 },
    pageContainer: {
        flex: 1,
        backgroundColor: COLOR_BACKGROUND, 
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        maxWidth: 400, // Limita el ancho de la tarjeta
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 30,
        // Añade una sombra sutil para el efecto de tarjeta
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, 
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 25,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 35,
        color: '#333',
    },
    label: {
        alignSelf: 'flex-start',
        marginBottom: 10,
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    // Contenedor que simula el borde externo del input
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1, 
        borderColor: '#E0E0E0', // Borde gris claro
        borderRadius: 5,
        paddingHorizontal: 12,
        height: 50,
        marginBottom: 20,
        width: '100%',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#333',
    },
    togglePassword: {
        paddingLeft: 10,
    },

    // --- Estilos de Botón Primario ---
    buttonPrimary: {
        backgroundColor: COLOR_PRIMARY,
        paddingVertical: 15,
        borderRadius: 5,
        width: '100%', 
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    
    // --- Estilos de Enlaces ---
    linkText: {
        color: COLOR_PRIMARY, // Usa el color vino para los enlaces
        fontSize: 14,
        textAlign: 'center',
    },
    linkBold: {
        fontWeight: 'bold',
    },
    linkRegister: {
        alignSelf: 'center', // Centrado horizontal
        marginBottom: 5,
    },
    linkForgotPassword: {
        marginTop: 10,
        marginBottom: 30,
    },
    
    // --- Estilo de Footer ---
    footerText: {
        marginTop: 40,
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
    },
});