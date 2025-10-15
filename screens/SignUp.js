import React, { useState } from "react";

import {

    View,

    Text,

    TextInput,

    TouchableOpacity,

    StyleSheet,

    Alert,

    Image,

    ScrollView,

} from "react-native";

// Importamos TODOS los iconos necesarios para el diseño moderno

import { FontAwesome5, FontAwesome, Feather } from '@expo/vector-icons';

import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "../src/config/firebaseConfig";

// Importamos TODAS las funciones de validación de tu archivo

import { 

    validateEmail, 

    validatePassword, 

    validateConfirmPassword, 

    validateName 

} from '../utils/validation'; 

import { showAlert } from '../utils/showAlert';



export default function SignUp({ navigation }) {

    const [firstName, setFirstName] = useState("");

    const [lastName, setLastName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);



    // Las reglas de validación ya están en validatePassword, pero las mostramos en la UI

    const isMinLength = password.length >= 6;

    const hasUpperAndLower = /[A-Z]/.test(password) && /[a-z]/.test(password);

    const hasNumber = /\d/.test(password);

    

    // Mostramos las reglas si el usuario está escribiendo o si ya ha escrito algo

    const showRules = password.length > 0; 



    const handleSignUp = async () => {

        // 1. Validaciones usando las funciones importadas

        const errors = [

            validateName(firstName, "Nombre"),

            validateName(lastName, "Apellido"),

            validateEmail(email),

            validatePassword(password),

            validateConfirmPassword(password, confirmPassword),

        ].filter(msg => msg !== null); // Filtra solo los mensajes de error



        if (errors.length > 0) {

            showAlert("Validación", errors.join("\n"));

            return;

        }



        // 2. Ejecutar Firebase

        try {

            await createUserWithEmailAndPassword(auth, email, password);

            showAlert(

                "Registro exitoso",

                `Usuario ${email} registrado correctamente.`

            );

            // Redirigir al usuario al Login después del registro exitoso

            navigation.navigate("Login"); 

        } catch (error) {

            let errorMessage = "Hubo un problema al registrar el usuario.";

            if (error.code === 'auth/email-already-in-use') {

                errorMessage = "Este correo electrónico ya está registrado.";

            } else {

                 console.error("Error de Firebase:", error);

            }

            showAlert("Error", errorMessage);

        }

    };



    // La principal diferencia es que eliminamos la etiqueta <Text style={styles.label}>

    // y usamos el estilo inputContainerNew para replicar el diseño de la imagen.



    return (

        <View style={styles.pageContainer}> 

            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.card}>

                    <Image source={require("../assets/logo.png")} style={styles.logo} />

                    <Text style={styles.title}>Crear cuenta</Text>



                    {/* Nombre */}

                    {/* Input al estilo de 456.PNG */}

                    <View style={styles.inputContainerNew}>

                        <FontAwesome name="user-o" size={18} color="#888" style={styles.inputIcon} />

                        <TextInput

                            style={styles.inputNew}

                            placeholder="Nombre"

                            value={firstName}

                            onChangeText={setFirstName}

                        />

                    </View>



                    {/* Apellido */}

                    {/* Input al estilo de 456.PNG */}

                    <View style={styles.inputContainerNew}>

                        <FontAwesome name="user-o" size={18} color="#888" style={styles.inputIcon} />

                        <TextInput

                            style={styles.inputNew}

                            placeholder="Apellido"

                            value={lastName}

                            onChangeText={setLastName}

                        />

                    </View>



                    {/* Correo */}

                    {/* Input al estilo de 456.PNG */}

                    <View style={styles.inputContainerNew}>

                        <Feather name="mail" size={18} color="#888" style={styles.inputIcon} />

                        <TextInput

                            style={styles.inputNew}

                            placeholder="Correo electrónico"

                            value={email}

                            onChangeText={setEmail}

                            keyboardType="email-address"

                            autoCapitalize="none"

                        />

                    </View>



                    {/* Contraseña */}

                    {/* Input al estilo de 456.PNG */}

                    <View style={styles.inputContainerNew}>

                        <FontAwesome5 name="lock" size={16} color="#888" style={styles.inputIcon} />

                        <TextInput

                            style={styles.inputNew}

                            placeholder="Contraseña"

                            value={password}

                            onChangeText={setPassword}

                            secureTextEntry={!showPassword}

                        />

                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>

                            <FontAwesome

                                name={showPassword ? "eye-slash" : "eye"}

                                size={18}

                                color="#888"

                            />

                        </TouchableOpacity>

                    </View>



                    {/* Reglas de Contraseña Dinámicas (MANTENIDAS) */}

                    {showRules && (

                        <View style={styles.rulesContainer}>

                            <Text style={styles.ruleTitle}>Requisitos de Contraseña:</Text>

                            <Text style={[styles.rule, isMinLength ? styles.valid : styles.invalid]}>

                                - Mínimo 6 caracteres

                            </Text>

                            <Text style={[styles.rule, hasUpperAndLower ? styles.valid : styles.invalid]}>

                                - Al menos una Mayúscula y una minúscula

                            </Text>

                            <Text style={[styles.rule, hasNumber ? styles.valid : styles.invalid]}>

                                - Incluir al menos un número

                            </Text>

                        </View>

                    )}



                    {/* Confirmar Contraseña */}

                    {/* Input al estilo de 456.PNG */}

                    <View style={styles.inputContainerNew}>

                        <FontAwesome5 name="lock" size={16} color="#888" style={styles.inputIcon} />

                        <TextInput

                            style={styles.inputNew}

                            placeholder="Confirmar contraseña"

                            value={confirmPassword}

                            onChangeText={setConfirmPassword}

                            secureTextEntry={!showConfirmPassword}

                        />

                        <TouchableOpacity

                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}

                        >

                            <FontAwesome

                                name={showConfirmPassword ? "eye-slash" : "eye"}

                                size={18}

                                color="#888"

                            />

                        </TouchableOpacity>

                    </View>



                    <TouchableOpacity style={styles.buttonPrimary} onPress={handleSignUp}>

                        <Text style={styles.buttonText}>Registrarse</Text>

                    </TouchableOpacity>



                    {/* Enlace de Login (ajustado para que luzca como la imagen 456.PNG) */}

                    <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.linkLogin}>

                        <Text style={styles.linkTextFooter}>¿Ya tienes una cuenta? <Text style={styles.linkBold}>Iniciar sesión</Text></Text>

                    </TouchableOpacity>

                    

                    {/* Footer / Derechos de autor (MANTENIDO) */}

                    <Text style={styles.footerText}>

                        © 2025 - Instituto Superior Del Milagro. Todos los derechos reservados.

                    </Text>

                </View>

            </ScrollView>

        </View>

    );

}



// --- ESTILOS ADAPTADOS AL DISEÑO DE LA IMAGEN 456.PNG ---



const COLOR_PRIMARY = '#8D1E2A'; 

const COLOR_BACKGROUND = '#F0F2F5'; 

const INPUT_BACKGROUND_COLOR = '#F5F5F5'; // Nuevo color de fondo para los inputs



const styles = StyleSheet.create({

    pageContainer: {

        flex: 1,

        backgroundColor: COLOR_BACKGROUND, 

    },

    scrollContent: {

        flexGrow: 1,

        justifyContent: 'center',

        alignItems: 'center',

        padding: 20,

    },

    card: {

        width: '100%',

        maxWidth: 400, 

        backgroundColor: '#fff',

        borderRadius: 8,

        padding: 30,

        // Eliminamos la sombra para que se parezca más a 456.PNG, que no tiene una sombra visible.

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

        marginBottom: 30,

        color: '#333',

    },

    

    // --- NUEVOS ESTILOS DE INPUT (para replicar 456.PNG) ---

    inputContainerNew: {

        flexDirection: 'row',

        alignItems: 'center',

        backgroundColor: INPUT_BACKGROUND_COLOR, // Fondo gris claro

        borderRadius: 5,

        paddingHorizontal: 12,

        height: 50,

        marginBottom: 15, // Espaciado entre inputs

        width: '100%',

        borderWidth: 1, // Borde sutil

        borderColor: INPUT_BACKGROUND_COLOR, 

    },

    inputIcon: {

        marginRight: 10,

    },

    inputNew: {

        flex: 1,

        height: '100%',

        fontSize: 16,

        color: '#333',

        paddingVertical: 0, // Asegura que el texto esté centrado verticalmente

    },

    // --- FIN NUEVOS ESTILOS DE INPUT ---



    // --- Reglas de Contraseña Dinámicas (MANTENIDAS) ---

    rulesContainer: {

        alignSelf: "flex-start",

        width: '100%',

        marginBottom: 20,

        paddingLeft: 12,

    },

    ruleTitle: {

        fontWeight: 'bold',

        fontSize: 14,

        marginBottom: 3,

        color: '#333',

    },

    rule: {

        fontSize: 13,

    },

    valid: {

        color: 'green',

    },

    invalid: {

        color: '#888',

    },

    // --- Estilos de Botón Primario ---

    buttonPrimary: {

        backgroundColor: COLOR_PRIMARY,

        paddingVertical: 15,

        borderRadius: 5,

        width: '100%', 

        alignItems: 'center',

        marginTop: 15,

        marginBottom: 10, // Menos espacio antes del enlace

    },

    buttonText: {

        color: '#fff',

        fontSize: 18,

        fontWeight: 'bold',

    },

    // --- Estilos de Enlaces del Footer ---

    linkTextFooter: {

        color: '#666', // Un gris más suave para el texto regular del footer

        fontSize: 14,

        textAlign: 'center',

    },

    linkBold: {

        fontWeight: 'bold',

        color: COLOR_PRIMARY, // Rojo para el enlace principal

    },

    linkLogin: {

        alignSelf: 'center',

        marginBottom: 10,

    },

    // --- Estilo de Footer ---

    footerText: {

        marginTop: 40,

        fontSize: 12,

        color: '#888',

        textAlign: 'center',

    },

});