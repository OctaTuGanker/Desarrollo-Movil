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
import { FontAwesome5, FontAwesome, Feather } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/config/firebaseConfig";
import {
  validateEmail,
  validatePassword,
} from "../utils/validation";

export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRules,           setShowRules]           = useState(false);

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

  // Reglas visuales de contraseña
  const isMinLength = password.length >= 6;
  const hasUpper    = /[A-Z]/.test(password);
  const hasLower    = /[a-z]/.test(password);
  const hasNumber   = /\d/.test(password);

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
      default:
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
      default:
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

    // Validar todos
    const firstNameOk       = validateField("firstName", firstName);
    const lastNameOk        = validateField("lastName", lastName);
    const emailOk           = validateField("email", email);
    const passwordOk        = validateField("password", password);
    const confirmPasswordOk = validateField("confirmPassword", confirmPassword);

    if (!firstNameOk || !lastNameOk || !emailOk || !passwordOk || !confirmPasswordOk) {
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Registro exitoso", `Usuario ${email} registrado correctamente`);
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
        default:
          break;
      }
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.pageContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <Text style={styles.title}>Crear cuenta</Text>

          {/* Nombre */}
          <View style={[
            styles.inputContainerNew,
            touched.firstName && errors.firstName ? styles.inputContainerError : null
          ]}>
            <FontAwesome name="user-o" size={18} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.inputNew}
              placeholder="Nombre"
              value={firstName}
              onChangeText={(v) => handleChange("firstName", v)}
              onBlur={() => handleBlur("firstName")}
              returnKeyType="next"
            />
          </View>
          {touched.firstName && errors.firstName ? (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          ) : null}

          {/* Apellido */}
          <View style={[
            styles.inputContainerNew,
            touched.lastName && errors.lastName ? styles.inputContainerError : null
          ]}>
            <FontAwesome name="user-o" size={18} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.inputNew}
              placeholder="Apellido"
              value={lastName}
              onChangeText={(v) => handleChange("lastName", v)}
              onBlur={() => handleBlur("lastName")}
              returnKeyType="next"
            />
          </View>
          {touched.lastName && errors.lastName ? (
            <Text style={styles.errorText}>{errors.lastName}</Text>
          ) : null}

          {/* Email */}
          <View style={[
            styles.inputContainerNew,
            touched.email && errors.email ? styles.inputContainerError : null
          ]}>
            <Feather name="mail" size={18} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.inputNew}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={(v) => handleChange("email", v)}
              onBlur={() => handleBlur("email")}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>
          {touched.email && errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}

          {/* Password */}
          <View style={[
            styles.inputContainerNew,
            touched.password && errors.password ? styles.inputContainerError : null
          ]}>
            <FontAwesome5 name="lock" size={16} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.inputNew}
              placeholder="Contraseña"
              value={password}
              onChangeText={(v) => handleChange("password", v)}
              onFocus={() => setShowRules(true)}
              onBlur={() => {
                setShowRules(false);
                handleBlur("password");
              }}
              secureTextEntry={!showPassword}
              returnKeyType="next"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={18} color="#888" />
            </TouchableOpacity>
          </View>
          {touched.password && errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}

          {/* Reglas visibles solo al enfocar */}
          {showRules && (
            <View style={styles.rulesContainer}>
              <Text style={styles.ruleTitle}>Requisitos de Contraseña:</Text>
              <Text style={[styles.rule, isMinLength ? styles.valid : styles.invalid]}>
                - Mínimo 6 caracteres
              </Text>
              <Text style={[styles.rule, hasUpper ? styles.valid : styles.invalid]}>
                - Usar al menos una letra mayúscula
              </Text>
              <Text style={[styles.rule, hasLower ? styles.valid : styles.invalid]}>
                - Usar al menos una letra minúscula
              </Text>
              <Text style={[styles.rule, hasNumber ? styles.valid : styles.invalid]}>
                - Incluir al menos un número
              </Text>
            </View>
          )}

          {/* Confirm Password */}
          <View style={[
            styles.inputContainerNew,
            touched.confirmPassword && errors.confirmPassword ? styles.inputContainerError : null
          ]}>
            <FontAwesome5 name="lock" size={16} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.inputNew}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={(v) => handleChange("confirmPassword", v)}
              onBlur={() => handleBlur("confirmPassword")}
              secureTextEntry={!showConfirmPassword}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <FontAwesome name={showConfirmPassword ? "eye-slash" : "eye"} size={18} color="#888" />
            </TouchableOpacity>
          </View>
          {touched.confirmPassword && errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}

          {/* Botón registrar */}
          <TouchableOpacity style={styles.buttonPrimary} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          {/* Ir a Login */}
          <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.linkLogin}>
            <Text style={styles.linkTextFooter}>
              ¿Ya tienes una cuenta? <Text style={styles.linkBold}>Iniciar sesión</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            © 2025 - Instituto Superior Del Milagro. Todos los derechos reservados.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const COLOR_PRIMARY = "#8D1E2A";
const COLOR_BACKGROUND = "#F0F2F5";
const INPUT_BACKGROUND_COLOR = "#F5F5F5";

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: COLOR_BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 30,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 25,
    resizeMode: "contain",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  inputContainerNew: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: INPUT_BACKGROUND_COLOR,
    borderRadius: 5,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 8,
    width: "100%",
    borderWidth: 1,
    borderColor: INPUT_BACKGROUND_COLOR,
  },
  inputContainerError: {
    borderColor: "#ff6b6b",
  },
  inputIcon: {
    marginRight: 10,
  },
  inputNew: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
  },
  rulesContainer: {
    alignSelf: "flex-start",
    width: "100%",
    marginBottom: 12,
    paddingLeft: 12,
  },
  ruleTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 3,
    color: "#333",
  },
  rule: {
    fontSize: 13,
  },
  valid: {
    color: "green",
  },
  invalid: {
    color: "#888",
  },
  errorText: {
    alignSelf: "flex-start",
    color: "#ff6b6b",
    fontSize: 12,
    marginBottom: 6,
    paddingLeft: 4,
  },
  buttonPrimary: {
    backgroundColor: COLOR_PRIMARY,
    paddingVertical: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkTextFooter: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
  linkBold: {
    fontWeight: "bold",
    color: COLOR_PRIMARY,
  },
  linkLogin: {
    alignSelf: "center",
    marginBottom: 10,
  },
  footerText: {
    marginTop: 24,
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
});