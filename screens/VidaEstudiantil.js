import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// IMPORTAMOS EL BACKGROUND WRAPPER
import BackgroundWrapper from '../src/components/BackgroundWrapper'; 

const COLOR_PRIMARY = '#922b21'; // Color principal para coherencia

// --- Datos de ejemplo para el contenido ---
const calendarioData = [
    { id: 1, date: '15/12', event: 'Fin del Ciclo Lectivo', icon: 'calendar-end' },
    { id: 2, date: '01/02', event: 'Inicio de Exámenes Finales', icon: 'file-document-outline' },
    { id: 3, date: '01/03', event: 'Inicio de Clases 1er Cuatrimestre', icon: 'school-outline' },
    { id: 4, date: '15/07', event: 'Receso Invernal (Vacaciones)', icon: 'weather-snowy' },
];

const noticiasData = [
    { id: 1, title: 'Inscripción a Talleres Extracurriculares', summary: 'Abiertas las inscripciones para talleres de robótica y oratoria. ¡Cupos limitados!' },
    { id: 2, title: 'Jornada de Orientación Vocacional', summary: 'Este viernes a las 18 hs en el SUM. Dirigido a ingresantes.' },
];


export default function VidaEstudiantil() {
    return (
        // ENVOLVEMOS TODO EL CONTENIDO CON EL BACKGROUND WRAPPER
        <BackgroundWrapper>
            <ScrollView contentContainerStyle={styles.container}>
                
                {/* --- 1. ENCABEZADO Y TÍTULO --- */}
                <View style={styles.header}>
                    <Ionicons name="calendar-outline" size={30} color={COLOR_PRIMARY} />
                    <Text style={styles.headerTitle}>Vida Estudiantil</Text>
                    <Text style={styles.headerSubtitle}>Cronograma, eventos y novedades de tu instituto.</Text>
                </View>

                {/* --- 2. CALENDARIO ACADÉMICO (CRONOGRAMA) --- */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>📅 Calendario Académico</Text>
                    {
                        calendarioData.map(item => (
                            <View key={item.id} style={styles.calendarItem}>
                                <MaterialCommunityIcons 
                                    name={item.icon} 
                                    size={20} 
                                    color={COLOR_PRIMARY} 
                                    style={styles.calendarIcon} 
                                />
                                <View style={styles.calendarTextContainer}>
                                    <Text style={styles.calendarDate}>{item.date}</Text>
                                    <Text style={styles.calendarEvent}>{item.event}</Text>
                                </View>
                            </View>
                        ))
                    }
                    <TouchableOpacity style={styles.fullCalendarButton}>
                        <Text style={styles.fullCalendarButtonText}>Ver Calendario Completo</Text>
                    </TouchableOpacity>
                </View>

                {/* --- 3. NOTICIAS Y EVENTOS --- */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>📢 Novedades y Eventos</Text>
                    {
                        noticiasData.map(item => (
                            <TouchableOpacity key={item.id} style={styles.newsItem} onPress={() => Alert.alert(item.title, item.summary)}>
                                <View style={styles.newsContent}>
                                    <Text style={styles.newsTitle}>{item.title}</Text>
                                    <Text style={styles.newsSummary}>{item.summary}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#ccc" />
                            </TouchableOpacity>
                        ))
                    }
                </View>

            </ScrollView>
        </BackgroundWrapper>
    );
}

const styles = StyleSheet.create({
    container: { 
        flexGrow: 1, 
        padding: 20, 
        backgroundColor: 'transparent'
    },
    
    // ESTILOS DEL ENCABEZADO
    header: {
        alignItems: 'center', 
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 20,
        borderRadius: 10,
    },
    headerTitle: { 
        fontSize: 26, 
        fontWeight: 'bold', 
        color: COLOR_PRIMARY,
        marginTop: 5,
    },
    headerSubtitle: { 
        fontSize: 16, 
        color: '#555', 
        textAlign: 'center', 
        marginTop: 5 
    },

    // ESTILOS DE LA TARJETA DE SECCIÓN
    sectionCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, 
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },

    // ESTILOS DEL CALENDARIO
    calendarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingVertical: 5,
    },
    calendarIcon: {
        marginRight: 15,
        width: 20,
        textAlign: 'center',
    },
    calendarTextContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f7f7f7',
    },
    calendarDate: {
        fontWeight: 'bold',
        color: COLOR_PRIMARY,
        fontSize: 16,
        width: 60,
    },
    calendarEvent: {
        fontSize: 16,
        color: '#555',
        flex: 1,
    },
    fullCalendarButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: COLOR_PRIMARY,
        borderRadius: 5,
        alignItems: 'center',
    },
    fullCalendarButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    // ESTILOS DE NOTICIAS
    newsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    newsContent: {
        flex: 1,
        marginRight: 10,
    },
    newsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLOR_PRIMARY,
        marginBottom: 2,
    },
    newsSummary: {
        fontSize: 14,
        color: '#666',
    }
});