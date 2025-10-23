// screens/Login.js

import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Image, 
    Alert, 
    ScrollView,
} from 'react-native'; 
import { FontAwesome5, FontAwesome, Feather } from '@expo/vector-icons'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { validateEmail, validatePassword } from '../utils/validation';
import { showAlert } from '../utils/showAlert';

import BackgroundWrapper from '../src/components/BackgroundWrapper'; 


const COLOR_PRIMARY = '#8D1E2A';

export default function Login({ navigation }) {
    // ... (Tus estados se mantienen sin cambios)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [touched, setTouched] = useState({ email: false, password: false });

    const validateField = (field, value) => {
        let error = '';
        if (field === 'email') error = validateEmail(value) || '';
        // Se asegura que validatePassword exista y sea una función antes de llamarla
        if (field === 'password') error = validatePassword && typeof validatePassword === 'function' ? (validatePassword(value) || '') : (!value ? 'Debe ingresar su contraseña.' : '');
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
    
    // 🛑 FUNCIÓN CORREGIDA: Lógica y Navegación
    const handleLogin = async () => {
        // 1. Ejecutar validaciones y marcar como tocados
        const emailOk = validateField('email', email);
        const passOk = validateField('password', password);
        setTouched({ email: true, password: true });

        // Si la validación falla (incluso la básica de campo vacío), sale.
        if (!emailOk || !passOk) {
            // Si hay errores, no intenta autenticar y la función termina aquí.
            return;
        }

        // 2. Lógica de Autenticación de Firebase
        try {
            await signInWithEmailAndPassword(auth, email, password);
            
            // 🛑 CORRECCIÓN CLAVE: Navegar después del éxito
            // Asumo que tu pantalla principal es 'Home' o 'MainTabs'.
            // Usamos reset para que el usuario no pueda volver a la pantalla de Login con el botón de retroceso.
            // Asegúrate que 'MainTabs' sea el nombre correcto de tu pantalla principal.
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }], // O 'MainTabs' si ese es el nombre de tu pantalla principal
            });

        } catch (error) {
            let errorMessage = "Hubo un problema al iniciar sesión.";
            switch (error.code) {
                case 'auth/invalid-email':
                case 'auth/user-not-found':
                    errorMessage = "Credenciales incorrectas o usuario no registrado."; 
                    break;
                case 'auth/wrong-password':
                    errorMessage = "La contraseña es incorrecta."; 
                    break;
                case 'auth/network-request-failed':
                    errorMessage = "Error de conexión, por favor intenta más tarde."; 
                    break;
                default: 
                    console.error("Error de Firebase:", error);
            }
            // Muestra una alerta con el error
            Alert.alert("Error de Acceso", errorMessage);
        }
    };


    return (
        <BackgroundWrapper>
            
            <ScrollView contentContainerStyle={styles.pageContainerContent} style={styles.pageContainer}> 
                
                <View style={styles.card}>
                    
                    <Image 
                        source={require('../assets/logo.png')} 
                        style={styles.logo} 
                    />
                    <Text style={styles.title}>Iniciar Sesión</Text>
                    
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
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.togglePassword}>
                            <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#888" />
                        </TouchableOpacity>
                    </View>
                    {touched.password && errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                    
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.linkRegister}>
                        <Text style={styles.linkText}>¿No tienes cuenta? <Text style={styles.linkBold}>Registrarse.</Text></Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.linkForgotPassword}>
                        <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.footerText}>
                        © 2025 - Instituto Superior Del Milagro. Todos los derechos reservados.
                    </Text>
                    
                </View>
            </ScrollView>
            
        </BackgroundWrapper>
    );
}

// --- ESTILOS CORREGIDOS (Se mantienen igual que en la versión anterior para mantener la estética) ---

const styles = StyleSheet.create({
    errorText: { alignSelf: 'flex-start', color: '#ff6b6b', fontSize: 12, marginBottom: 12 },
    pageContainer: {
        flex: 1,
        backgroundColor: 'transparent', 
    },
    pageContainerContent: { 
        flexGrow: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        borderRadius: 8,
        padding: 30,
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
        backgroundColor: '#FFFFFF', 
        borderRadius: 50,
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
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1, 
        borderColor: '#E0E0E0', 
        borderRadius: 5,
        paddingHorizontal: 12,
        height: 50,
        marginBottom: 20,
        width: '100%',
        backgroundColor: '#FFFFFF', 
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
    linkText: {
        color: COLOR_PRIMARY,
        fontSize: 14,
        textAlign: 'center',
    },
    linkBold: {
        fontWeight: 'bold',
    },
    linkRegister: {
        alignSelf: 'center',
        marginBottom: 5,
    },
    linkForgotPassword: {
        marginTop: 10,
        marginBottom: 30,
    },
    footerText: {
        marginTop: 40,
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
    },
});