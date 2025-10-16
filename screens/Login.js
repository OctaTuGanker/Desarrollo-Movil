import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { validateEmail, validatePassword } from '../utils/validation';

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

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // showAlert("Login exitoso", "Has iniciado sesión correctamente.");
      navigation.dispatch(  
        CommonActions.reset({  
          index: 0,  
          routes: [  
            { name: 'MainTabs' }
          ],  
        })  
      );
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
      }
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Iniciar sesión</Text>

      <Text style={styles.label}>Correo</Text>
      <View style={[styles.inputContainer, touched.email && errors.email ? styles.inputContainerError : null]}>
        <FontAwesome name="envelope" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su correo"
          value={email}
          onChangeText={(v) => handleChange('email', v)}
          onBlur={() => handleBlur('email')}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {touched.email && errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

      <Text style={styles.label}>Contraseña</Text>
      <View style={[styles.inputContainer, touched.password && errors.password ? styles.inputContainerError : null]}>
        <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su contraseña"
          value={password}
          onChangeText={(v) => handleChange('password', v)}
          onBlur={() => handleBlur('password')}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
        </TouchableOpacity>
      </View>
      {touched.password && errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>¿No tienes cuenta aún? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  logo: { width: 100, height: 100, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { alignSelf: 'flex-start', fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1.25, borderColor: '#b9770e', marginBottom: 6, width: '100%', paddingBottom: 4 },
  inputContainerError: { borderColor: '#ff6b6b' },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 40 },
  errorText: { alignSelf: 'flex-start', color: '#ff6b6b', fontSize: 12, marginBottom: 12 },
  button: { backgroundColor: '#922b21', paddingVertical: 10, paddingHorizontal: 40, borderRadius: 5, marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  signUpText: { marginTop: 20, color: '#007AFF' },
});
