// utils/validation.js

// Validar email con regex
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "El correo es obligatorio.";
  if (!emailRegex.test(email)) return "El formato del correo electrónico no es válido.";
  return null; // null = sin errores
};

// Validar contraseña (mínimo 6 caracteres, mayúscula, minúscula y número)
export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (!password) return "La contraseña es obligatoria.";
  if (!passwordRegex.test(password)) {
    return "La contraseña debe tener al menos 6 caracteres, incluyendo una letra mayúscula, una minúscula y un número.";
  }
  return null;
};

// Confirmar contraseña
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Debe confirmar la contraseña.";
  if (password !== confirmPassword) return "Las contraseñas no coinciden.";
  return null;
};

// Validar nombre/apellido
export const validateName = (name, fieldName = "Campo") => {
  if (!name) return `${fieldName} es obligatorio.`;
  if (name.length < 2) return `${fieldName} debe tener al menos 2 caracteres.`;
  return null;
};
