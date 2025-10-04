import React, { useState } from "react";
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

export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRules, setShowRules] = useState(false);

  // Validaciones de contraseña
  const isMinLength = password.length >= 6;
  const hasUpperAndLower = /[A-Z]/.test(password) && /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    // Validación de reglas de contraseña
    if (!isMinLength || !hasUpperAndLower || !hasNumber) {
      Alert.alert(
        "Error",
        "La contraseña no cumple con las reglas de seguridad."
      );
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert(
        "Registro exitoso",
        `Usuario ${email} registrado correctamente`
      );
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al registrar el usuario.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Regístrate</Text>

      <Text style={styles.label}>Nombre</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su nombre"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      <Text style={styles.label}>Apellido</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su apellido"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <Text style={styles.label}>Correo</Text>
      <View style={styles.inputContainer}>
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
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.label}>Contraseña</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          onFocus={() => setShowRules(true)}
          onBlur={() => setShowRules(false)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome
            name={showPassword ? "eye-slash" : "eye"}
            size={20}
            color="#ccc"
          />
        </TouchableOpacity>
      </View>

      {showRules && (
        <View style={styles.rulesContainer}>
          <Text style={[styles.rule, isMinLength ? styles.valid : styles.invalid]}>
            - Mínimo 6 caracteres
          </Text>
          <Text style={[styles.rule, hasUpperAndLower ? styles.valid : styles.invalid]}>
            - Usar al menos una letra mayúscula y una minúscula
          </Text>
          <Text style={[styles.rule, hasNumber ? styles.valid : styles.invalid]}>
            - Incluir al menos un número
          </Text>
        </View>
      )}

      <Text style={styles.label}>Confirmar Contraseña</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirme su contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
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
    borderBottomWidth: 1,
    borderColor: "#b9770e",
    marginBottom: 20,
    width: "100%",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  rulesContainer: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  rule: {
    fontSize: 14,
  },
  valid: {
    color: "yellow",
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
});

