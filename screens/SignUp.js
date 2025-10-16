import React, { useState } from "react";
<<<<<<< HEAD
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { auth } from "../src/config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { validateEmail, validatePassword } from "../utils/validation";

export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Validaciones de contraseña para las reglas visuales
  const isMinLength = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "firstName":
        if (!value.trim()) error = "El nombre es obligatorio.";
        else if (value.trim().length < 2) error = "Mínimo 2 caracteres.";
        break;
      case "lastName":
        if (!value.trim()) error = "El apellido es obligatorio.";
        else if (value.trim().length < 2) error = "Mínimo 2 caracteres.";
        break;
      case "email":
        error = validateEmail(value) || "";
        break;
      case "password":
        error = validatePassword(value) || "";
        break;
      case "confirmPassword":
        if (!value) error = "Debe confirmar su contraseña.";
        else if (value !== password) error = "Las contraseñas no coinciden.";
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const values = { firstName, lastName, email, password, confirmPassword };
    validateField(field, values[field]);
  };

  const handleChange = (field, value) => {
    switch (field) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
    }
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleSignUp = async () => {
    // Marcar todos como tocados
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validar todos los campos
    const firstNameOk = validateField("firstName", firstName);
    const lastNameOk = validateField("lastName", lastName);
    const emailOk = validateField("email", email);
    const passwordOk = validateField("password", password);
    const confirmPasswordOk = validateField("confirmPassword", confirmPassword);

    if (!firstNameOk || !lastNameOk || !emailOk || !passwordOk || !confirmPasswordOk) {
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert(
        "Registro exitoso",
        `Usuario ${email} registrado correctamente`
      );
      navigation.navigate("Login");
    } catch (error) {
      let errorMessage = "Hubo un problema al registrar el usuario.";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Este correo ya está registrado.";
          break;
        case "auth/invalid-email":
          errorMessage = "El formato del correo no es válido.";
          break;
        case "auth/weak-password":
          errorMessage = "La contraseña es muy débil.";
          break;
      }
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Regístrate</Text>

      <Text style={styles.label}>Nombre</Text>
      <View
        style={[
          styles.inputContainer,
          touched.firstName && errors.firstName
            ? styles.inputContainerError
            : null,
        ]}
      >
        <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su nombre"
          value={firstName}
          onChangeText={(v) => handleChange("firstName", v)}
          onBlur={() => handleBlur("firstName")}
        />
      </View>
      {touched.firstName && errors.firstName ? (
        <Text style={styles.errorText}>{errors.firstName}</Text>
      ) : null}

      <Text style={styles.label}>Apellido</Text>
      <View
        style={[
          styles.inputContainer,
          touched.lastName && errors.lastName
            ? styles.inputContainerError
            : null,
        ]}
      >
        <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su apellido"
          value={lastName}
          onChangeText={(v) => handleChange("lastName", v)}
          onBlur={() => handleBlur("lastName")}
        />
      </View>
      {touched.lastName && errors.lastName ? (
        <Text style={styles.errorText}>{errors.lastName}</Text>
      ) : null}

      <Text style={styles.label}>Correo</Text>
      <View
        style={[
          styles.inputContainer,
          touched.email && errors.email ? styles.inputContainerError : null,
        ]}
      >
        <FontAwesome
          name="envelope"
          size={20}
          color="#ccc"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su correo"
          value={email}
          onChangeText={(v) => handleChange("email", v)}
          onBlur={() => handleBlur("email")}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {touched.email && errors.email ? (
        <Text style={styles.errorText}>{errors.email}</Text>
      ) : null}

      <Text style={styles.label}>Contraseña</Text>
      <View
        style={[
          styles.inputContainer,
          touched.password && errors.password
            ? styles.inputContainerError
            : null,
        ]}
      >
        <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su contraseña"
          value={password}
          onChangeText={(v) => handleChange("password", v)}
          onFocus={() => setShowRules(true)}
          onBlur={() => {
            setShowRules(false);
            handleBlur("password");
          }}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome
            name={showPassword ? "eye-slash" : "eye"}
            size={20}
            color="#ccc"
          />
        </TouchableOpacity>
      </View>
      {touched.password && errors.password ? (
        <Text style={styles.errorText}>{errors.password}</Text>
      ) : null}

      {showRules && (
        <View style={styles.rulesContainer}>
          <Text
            style={[styles.rule, isMinLength ? styles.valid : styles.invalid]}
          >
            - Mínimo 6 caracteres
          </Text>
          <Text
            style={[
              styles.rule,
              hasUpper ? styles.valid : styles.invalid,
            ]}
          >
            - Usar al menos una letra mayúscula
          </Text>
          <Text
            style={[
              styles.rule,
              hasLower ? styles.valid : styles.invalid,
            ]}
          >
            - Usar al menos una letra minúscula
          </Text>
          <Text
            style={[styles.rule, hasNumber ? styles.valid : styles.invalid]}
          >
            - Incluir al menos un número
          </Text>
        </View>
      )}

      <Text style={styles.label}>Confirmar Contraseña</Text>
      <View
        style={[
          styles.inputContainer,
          touched.confirmPassword && errors.confirmPassword
            ? styles.inputContainerError
            : null,
        ]}
      >
        <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirme su contraseña"
          value={confirmPassword}
          onChangeText={(v) => handleChange("confirmPassword", v)}
          onBlur={() => handleBlur("confirmPassword")}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <FontAwesome
            name={showConfirmPassword ? "eye-slash" : "eye"}
            size={20}
            color="#ccc"
          />
        </TouchableOpacity>
      </View>
      {touched.confirmPassword && errors.confirmPassword ? (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.signUpText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1.25,
    borderColor: "#b9770e",
    marginBottom: 6,
    width: "100%",
    paddingBottom: 4,
  },
  inputContainerError: {
    borderColor: "#ff6b6b",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  errorText: {
    alignSelf: "flex-start",
    color: "#ff6b6b",
    fontSize: 12,
    marginBottom: 12,
  },
  rulesContainer: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  rule: {
    fontSize: 14,
  },
  valid: {
    color: "#4caf50",
  },
  invalid: {
    color: "#aaa",
  },
  button: {
    backgroundColor: "#922b21",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  signUpText: {
    marginTop: 20,
    color: "#007AFF",
  },
=======

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

>>>>>>> f06b223 (feat(auth): Estilos finales y correcciones de login.)
});