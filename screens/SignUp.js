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
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../src/config/firebaseConfig";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  validateEmail,
  validatePassword,
} from "../utils/validation";
import { useAuth } from "../contexts/AuthContext";
import BackgroundWrapper from '../src/components/BackgroundWrapper';

const COLOR_PRIMARY = "#8D1E2A";
const INPUT_BACKGROUND_COLOR = "#F5F5F5";

export default function SignUp({ navigation }) {
  const { user, role } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("Alumno");

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

  // Reglas visuales de contraseña
  const isMinLength = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "firstName":
        if (!value.trim()) error = "El nombre es obligatorio.";
        else if (/[0-9]/.test(value)) error = "El nombre no puede llevar números.";
        else if (value.trim().length < 2) error = "Mínimo 2 caracteres.";
        break;
      case "lastName":
        if (!value.trim()) error = "El apellido es obligatorio.";
        else if (/[0-9]/.test(value)) error = "El apellido no puede llevar números.";
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
    let cleanValue = value;
    if (field === 'firstName' || field === 'lastName') {
      cleanValue = value.replace(/[0-9]/g, '');
    }
    switch (field) {
      case "firstName": setFirstName(cleanValue); break;
      case "lastName": setLastName(cleanValue); break;
      case "email": setEmail(value); break;
      case "password": setPassword(value); break;
      case "confirmPassword": setConfirmPassword(value); break;
      default: break;
    }
    if (touched[field]) validateField(field, cleanValue);
  };

  // CORREGIDO: Crea usuario SIN cambiar sesión
  const handleSignUp = async () => {
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const firstNameOk = validateField("firstName", firstName);
    const lastNameOk = validateField("lastName", lastName);
    const emailOk = validateField("email", email);
    const passwordOk = validateField("password", password);
    const confirmPasswordOk = validateField("confirmPassword", confirmPassword);

    if (!firstNameOk || !lastNameOk || !emailOk || !passwordOk || !confirmPasswordOk) return;

    try {
      // 1. Crea el usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      const db = getFirestore();

      // 2. Guarda los datos en Firestore
      await setDoc(doc(db, "users", newUser.uid), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        role: newUserRole,
        createdAt: serverTimestamp(),
        createdBy: user?.uid || null,
      });

      // 3. SI ES ADMIN O PROFESOR: vuelve atrás (NO cierra sesión)
      if (user && (role === "Admin" || role === "Profesor")) {
        Alert.alert(
          "Éxito",
          `${firstName} ha sido creado como ${newUserRole}.`,
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } 
      // 4. SI ES REGISTRO PÚBLICO: cierra sesión del nuevo usuario y va a Login
      else {
        await signOut(auth); // Cierra sesión del usuario recién creado
        Alert.alert("Registro exitoso", `Bienvenido, ${firstName}!`);
        navigation.replace("Login");
      }
    } catch (error) {
      let errorMessage = "Hubo un problema al registrar el usuario.";
      switch (error.code) {
        case "auth/email-already-in-use": errorMessage = "Este correo ya está registrado."; break;
        case "auth/invalid-email": errorMessage = "El formato del correo no es válido."; break;
        case "auth/weak-password": errorMessage = "La contraseña es muy débil."; break;
        default:
          console.log("Error completo:", error);
          errorMessage = error.message;
          break;
      }
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <Text style={styles.title}>Crear cuenta</Text>

          {/* Nombre */}
          <View style={[styles.inputContainerNew, touched.firstName && errors.firstName ? styles.inputContainerError : null]}>
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
          {touched.firstName && errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}

          {/* Apellido */}
          <View style={[styles.inputContainerNew, touched.lastName && errors.lastName ? styles.inputContainerError : null]}>
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
          {touched.lastName && errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}

          {/* Email */}
          <View style={[styles.inputContainerNew, touched.email && errors.email ? styles.inputContainerError : null]}>
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
          {touched.email && errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          {/* SELECTOR DE ROL: Solo si es Admin o Profesor */}
          {user && (role === "Admin" || role === "Profesor") && (
            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>Tipo de usuario:</Text>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={[styles.roleButton, newUserRole === "Alumno" && styles.roleButtonActive]}
                  onPress={() => setNewUserRole("Alumno")}
                >
                  <FontAwesome5 name="user-graduate" size={20} color={newUserRole === "Alumno" ? "#fff" : COLOR_PRIMARY} />
                  <Text style={[styles.roleButtonText, newUserRole === "Alumno" && styles.roleButtonTextActive]}>
                    Alumno
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleButton, newUserRole === "Profesor" && styles.roleButtonActive]}
                  onPress={() => setNewUserRole("Profesor")}
                >
                  <FontAwesome5 name="chalkboard-teacher" size={20} color={newUserRole === "Profesor" ? "#fff" : COLOR_PRIMARY} />
                  <Text style={[styles.roleButtonText, newUserRole === "Profesor" && styles.roleButtonTextActive]}>
                    Profesor
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Password */}
          <View style={[styles.inputContainerNew, touched.password && errors.password ? styles.inputContainerError : null]}>
            <FontAwesome5 name="lock" size={16} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.inputNew}
              placeholder="Contraseña"
              value={password}
              onChangeText={(v) => handleChange("password", v)}
              onFocus={() => setShowRules(true)}
              onBlur={() => { setShowRules(false); handleBlur("password"); }}
              secureTextEntry={!showPassword}
              returnKeyType="next"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={18} color="#888" />
            </TouchableOpacity>
          </View>
          {touched.password && errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          {showRules && (
            <View style={styles.rulesContainer}>
              <Text style={styles.ruleTitle}>Requisitos de Contraseña:</Text>
              <Text style={[styles.rule, isMinLength ? styles.valid : styles.invalid]}>- Mínimo 6 caracteres</Text>
              <Text style={[styles.rule, hasUpper ? styles.valid : styles.invalid]}>- Al menos una mayúscula</Text>
              <Text style={[styles.rule, hasLower ? styles.valid : styles.invalid]}>- Al menos una minúscula</Text>
              <Text style={[styles.rule, hasNumber ? styles.valid : styles.invalid]}>- Al menos un número</Text>
            </View>
          )}

          {/* Confirm Password */}
          <View style={[styles.inputContainerNew, touched.confirmPassword && errors.confirmPassword ? styles.inputContainerError : null]}>
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
          {touched.confirmPassword && errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

          {/* Botón */}
          <TouchableOpacity style={styles.buttonPrimary} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          {/* Login */}
          {!user && (
            <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.linkLogin}>
              <Text style={styles.linkTextFooter}>
                ¿Ya tienes una cuenta? <Text style={styles.linkBold}>Iniciar sesión</Text>
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.footerText}>
            © 2025 - Instituto Superior Del Milagro. Todos los derechos reservados.
          </Text>
        </View>
      </ScrollView>
    </BackgroundWrapper>
  );
}

// === ESTILOS (sin cambios) ===
const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: 'transparent' },
  card: { width: "100%", maxWidth: 400, backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: 8, padding: 30, alignItems: "center", shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  logo: { width: 100, height: 100, marginBottom: 25, resizeMode: "contain" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 30, color: "#333" },
  inputContainerNew: { flexDirection: "row", alignItems: "center", backgroundColor: INPUT_BACKGROUND_COLOR, borderRadius: 5, paddingHorizontal: 12, height: 50, marginBottom: 8, width: "100%", borderWidth: 1, borderColor: INPUT_BACKGROUND_COLOR },
  inputContainerError: { borderColor: "#ff6b6b" },
  inputIcon: { marginRight: 10 },
  inputNew: { flex: 1, height: "100%", fontSize: 16, color: "#333", paddingVertical: 0 },
  roleContainer: { width: "100%", marginBottom: 16 },
  roleLabel: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  roleButtons: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  roleButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 5, borderWidth: 2, borderColor: COLOR_PRIMARY, backgroundColor: "#fff", gap: 8 },
  roleButtonActive: { backgroundColor: COLOR_PRIMARY },
  roleButtonText: { fontSize: 15, fontWeight: "600", color: COLOR_PRIMARY },
  roleButtonTextActive: { color: "#fff" },
  rulesContainer: { alignSelf: "flex-start", width: "100%", marginBottom: 12, paddingLeft: 12 },
  ruleTitle: { fontWeight: "bold", fontSize: 14, marginBottom: 3, color: "#333" },
  rule: { fontSize: 13 },
  valid: { color: "green" },
  invalid: { color: "#888" },
  errorText: { alignSelf: "flex-start", color: "#ff6b6b", fontSize: 12, marginBottom: 6, paddingLeft: 4 },
  buttonPrimary: { backgroundColor: COLOR_PRIMARY, paddingVertical: 15, borderRadius: 5, width: "100%", alignItems: "center", marginTop: 12, marginBottom: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  linkTextFooter: { color: "#666", fontSize: 14, textAlign: "center" },
  linkBold: { fontWeight: "bold", color: COLOR_PRIMARY },
  linkLogin: { alignSelf: "center", marginBottom: 10 },
  footerText: { marginTop: 24, fontSize: 12, color: "#888", textAlign: "center" },
});