import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    SafeAreaView,
    Linking,
    Alert
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

// 1. IMPORTAR EL BACKGROUND WRAPPER
import BackgroundWrapper from '../src/components/BackgroundWrapper'; 


// --- Funcion para determinar en que mes estamos y si podemos inscribirnos o no---
const getAdmissionStatus = () => {
    const now = new Date();
    // NOTA: Para propósitos de prueba en este momento (Octubre), la función
    // retornará 'Inscripciones Cerradas' (default).
    const currentMonth = now.getMonth(); // 0 = Enero, 11 = Diciembre

    let status = {
        title: '',
        message: '',
        icon: 'time-outline',
        color: '#6c757d' // Color por defectogris
    };

    switch (currentMonth) {
        case 11: // Diciembre
        case 0:  // Enero
        case 1:  // Febrero
            status = {
                title: 'Inscripciones Abiertas',
                message: 'El proceso de inscripción para el próximo ciclo lectivo ya está abierto. ¡Asegura tu lugar!',
                icon: 'checkmark-circle-outline',
                color: '#28a745' // Verde
            };
            break;
        case 2: // Marzo
            status = {
                title: '¡Últimos Lugares Disponibles!',
                message: 'Las inscripciones están por cerrar. Acércate al instituto para completar tu proceso.',
                icon: 'warning-outline',
                color: '#ffc107' // Amarillo
            };
            break;
        case 3: // Abril
        case 4: // Mayo
            status = {
                title: 'Inscripciones Tardías',
                message: 'Aún es posible inscribirse, pero sujeto a vacantes disponibles. Contacta a secretaría para más información.',
                icon: 'alert-circle-outline',
                color: '#fd7e14' // Naranja
            };
            break;
        default: // Junio a Noviembre
            status = {
                title: 'Inscripciones Cerradas',
                message: 'El período de inscripción ha finalizado. Las próximas inscripciones abrirán en Diciembre.',
                icon: 'close-circle-outline',
                color: '#dc3545' // Rojo
            };
            break;
    }
    return status;
};


export default function Admisiones() {

    const admissionStatus = getAdmissionStatus();

    const handleContact = (type) => {
        let url = '';
        if (type === 'whatsapp') {
            url = 'whatsapp://send?phone=+5493876305671&text=Hola,%20quisiera%20más%20información%20sobre%20las%20admisiones.';
        } else if (type === 'email') {
            url = 'mailto:gudio.octavio@gmail.com?subject=Consulta sobre Admisiones';
        }

        Linking.canOpenURL(url)
            .then(supported => {
                if (supported) {
                    return Linking.openURL(url);
                } else {
                    Alert.alert('Error', `No se pudo abrir la aplicación para contactar.`);
                }
            })
            .catch(err => console.error('Ocurrió un error', err));
    };

    return (
        // 2. ENVOLVER EL SAFEAREAVIEW CON EL BACKGROUND WRAPPER
        <BackgroundWrapper>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.header}>
                        <Ionicons name="school" size={40} color={COLOR_PRIMARY} />
                        <Text style={styles.headerTitle}>Proceso de Admisión</Text>
                        <Text style={styles.headerSubtitle}>Sé un estudiante del Instituto Superior del Milagro.</Text>
                    </View>

                    {/* --- Panel de estado de admision --- */}
                    <View style={[styles.statusBox, { backgroundColor: admissionStatus.color }]}>
                        <View style={styles.statusBoxContent}>
                            <Ionicons name={admissionStatus.icon} size={40} color="#fff" style={styles.statusIcon} />
                            <View style={styles.statusTextContainer}>
                                <Text style={styles.statusTitle}>{admissionStatus.title}</Text>
                                <Text style={styles.statusMessage}>{admissionStatus.message}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Sección de requisitos */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Requisitos de Inscripción</Text>
                        <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listItemText}>Título secundario (original y copia).</Text></View>
                        <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listItemText}>DNI actualizado (original y copia).</Text></View>
                        <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listItemText}>Certificado de buena salud.</Text></View>
                        <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listItemText}>Dos fotos tipo carnet (4x4).</Text></View>
                        <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listItemText}>Completar el formulario de pre-inscripción online.</Text></View>
                    </View>

                    {/* Sección de pasos */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Pasos a Seguir</Text>
                        <Text style={styles.stepText}><Text style={styles.stepNumber}>1. Pre-inscripción:</Text> Completa nuestro formulario online con tus datos personales y académicos.</Text>
                        <Text style={styles.stepText}><Text style={styles.stepNumber}>2. Presentación:</Text> Acércate a la secretaría del instituto con la documentación requerida.</Text>
                        <Text style={styles.stepText}><Text style={styles.stepNumber}>3. Entrevista:</Text> Participa en una entrevista personal con el coordinador de la carrera.</Text>
                        <Text style={styles.stepText}><Text style={styles.stepNumber}>4. Matriculación:</Text> Una vez aprobado el proceso, podrás abonar la matrícula para asegurar tu vacante.</Text>
                    </View>
                    
                    {/* Sección de contacto */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>¿Tienes Dudas?</Text>
                        <Text style={styles.contactText}>Nuestro equipo está listo para ayudarte en cada paso del proceso.</Text>
                        <TouchableOpacity style={[styles.button, styles.whatsappButton]} onPress={() => handleContact('whatsapp')}><FontAwesome name="whatsapp" size={20} color="#fff" /><Text style={styles.buttonText}>Contactar por WhatsApp</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.emailButton]} onPress={() => handleContact('email')}><Ionicons name="mail" size={20} color="#fff" /><Text style={styles.buttonText}>Enviar un Email</Text></TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </BackgroundWrapper>
    );
}

const COLOR_PRIMARY = '#922b21';

const styles = StyleSheet.create({
    // El fondo de safeArea DEBE ser transparente para ver el wrapper
    safeArea: { flex: 1, backgroundColor: 'transparent' }, 
    
    // El ScrollView DEBE ser transparente.
    container: { padding: 20, backgroundColor: 'transparent' }, 
    
    header: {
        alignItems: 'center', marginBottom: 30, borderBottomWidth: 1,
        borderBottomColor: '#eee', paddingBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fondo semi-transparente para legibilidad
        borderRadius: 8,
        paddingTop: 20,
    },
    headerTitle: { fontSize: 26, fontWeight: 'bold', color: COLOR_PRIMARY, marginTop: 10 },
    headerSubtitle: { fontSize: 16, color: '#555', textAlign: 'center', marginTop: 5 },

    // --- Estilos para el panel de estados (Se mantiene con color sólido) ---
    statusBox: {
        borderRadius: 12,
        padding: 15,
        marginBottom: 25,
        elevation: 5,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2, shadowRadius: 4,
    },
    statusBoxContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIcon: {
        marginRight: 15,
    },
    statusTextContainer: {
        flex: 1,
    },
    statusTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statusMessage: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
    },
    // --- Estilos para las Secciones de Contenido ---
    // Fondo blanco para las secciones de contenido para legibilidad
    section: { 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        borderRadius: 8, 
        padding: 20, 
        marginBottom: 20 
    },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 15 },
    listItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
    bullet: { fontSize: 16, color: COLOR_PRIMARY, marginRight: 10, lineHeight: 24 },
    listItemText: { fontSize: 16, color: '#555', flex: 1, lineHeight: 24 },
    stepText: { fontSize: 16, color: '#555', marginBottom: 12, lineHeight: 24 },
    stepNumber: { fontWeight: 'bold', color: COLOR_PRIMARY },
    contactText: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 20, lineHeight: 23 },
    button: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 15, borderRadius: 8, marginTop: 10,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
    whatsappButton: { backgroundColor: '#25D366' },
    emailButton: { backgroundColor: '#c4302b' },
});