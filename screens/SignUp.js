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
});