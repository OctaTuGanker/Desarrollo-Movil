import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    Image, 
    TouchableOpacity, 
    SafeAreaView,
    Platform,
    UIManager,
    LayoutAnimation,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 🛑 IMPORTAR EL BACKGROUND WRAPPER
import BackgroundWrapper from '../src/components/BackgroundWrapper'; 


if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const cursosData = [
    // ... (Tus datos de cursos se mantienen sin cambios)
    {
        id: '1',
        title: 'Profesorado de Matemática',
        description: 'Forma profesionales capaces de enseñar matemática con pedagogía moderna y un profundo conocimiento de la materia, preparando a los futuros educadores para los desafíos del aula y fomentando el pensamiento crítico y la resolución de problemas en los estudiantes.',
        duration: '4 años',
        totalHours: '2800 horas reloj',
        modality: 'Presencial',
        image: require('../assets/matematica.jpg'),
        planDeEstudio: ['Álgebra y Geometría Analítica', 'Análisis Matemático I', 'Didáctica General', 'Pedagogía', 'Física Aplicada', 'Estadística y Probabilidad', 'Práctica Docente I, II, III y IV'],
    },
    {
        id: '2',
        title: 'Profesorado de Inglés',
        description: 'Desarrolla competencias lingüísticas y pedagógicas para la enseñanza del inglés como lengua extranjera en todos los niveles educativos. Foco en la comunicación, la cultura anglosajona y las nuevas tecnologías aplicadas a la enseñanza de idiomas.',
        duration: '4 años',
        totalHours: '2750 horas reloj',
        modality: 'Presencial',
        image: require('../assets/ingles.jpg'),
        planDeEstudio: ['Lengua Inglesa I, II, III y IV', 'Fonética y Fonología Inglesa', 'Gramática Inglesa', 'Didáctica del Inglés', 'Literatura en Lengua Inglesa', 'Lingüística General', 'Práctica Docente y Residencia'],
    },
    {
        id: '3',
        title: 'Analista de Sistemas',
        description: 'Una carrera con gran salida laboral que te prepara para diseñar, desarrollar...',
        duration: '3 años',
        modality: 'Presencial / A distancia',
        image: require('../assets/sistemas.jpg'),
        planDeEstudio: [
            'Algoritmos y Estructuras de Datos', 'Programación Orientada a Objetos', 'Bases de Datos',
            'Redes y Comunicaciones', 'Ingeniería de Software', 'Sistemas Operativos', 'Práctica Profesional Supervisada',
        ],
    },
    {
        id: '4',
        title: 'Psicología Social',
        description: 'Forma especialistas en la comprensión e intervención de los procesos grupales...',
        duration: '5 años',
        modality: 'Presencial',
        image: require('../assets/psicologia.jpg'),
        planDeEstudio: [
            'Teoría Psicoanalítica', 'Dinámica de Grupos', 'Epistemología de las Ciencias Sociales',
            'Psicología Comunitaria', 'Metodología de la Investigación', 'Intervención en Crisis', 'Prácticas Profesionales',
        ],
    },
];

const CursoCard = ({ curso, navigation }) => {
    // ... (La lógica de la tarjeta se mantiene igual)
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [isPlanExpanded, setIsPlanExpanded] = useState(false);

    const toggleDescription = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (isDescriptionExpanded) {
            setIsPlanExpanded(false);
        }
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };
    
    const togglePlan = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsPlanExpanded(!isPlanExpanded);
    };

    const truncatedDescription = `${curso.description.substring(0, 100)}...`;

    return (
        <View style={styles.card}>
            <Image source={curso.image} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{curso.title}</Text>
                
                <Text style={styles.cardDescription}>
                    {isDescriptionExpanded ? curso.description : truncatedDescription}
                </Text>

                <TouchableOpacity onPress={toggleDescription} style={styles.toggleDescriptionButton}>
                    <Text style={styles.toggleDescriptionButtonText}>
                        {isDescriptionExpanded ? 'Ver menos' : 'Ver más'}
                    </Text>
                </TouchableOpacity>

                {isDescriptionExpanded && (
                    <View style={styles.expandedContent}>
                        <View style={styles.cardInfoContainer}>
                            <View style={styles.infoBlock}><Text style={styles.infoLabel}>Duración</Text><Text style={styles.infoValue}>{curso.duration}</Text></View>
                            <View style={styles.infoBlock}><Text style={styles.infoLabel}>Modalidad</Text><Text style={styles.infoValue}>{curso.modality}</Text></View>
                        </View>

                        <TouchableOpacity style={styles.cardButton} onPress={togglePlan}>
                            <Text style={styles.cardButtonText}>Ver Plan de Estudios</Text>
                            <Ionicons name={isPlanExpanded ? "chevron-up" : "chevron-down"} size={20} color="#fff" />
                        </TouchableOpacity>

                        {isPlanExpanded && (
                            <View style={styles.planContainer}>
                                <Text style={styles.planTitle}>Materias Principales:</Text>
                                {curso.planDeEstudio.map((materia, index) => (
                                    <Text key={index} style={styles.planItem}>• {materia}</Text>
                                ))}
                                <TouchableOpacity
                                    style={styles.inscriptionButton}
                                    // Asegúrate de que 'Admisiones' sea el nombre correcto de tu ruta.
                                    onPress={() => navigation.jumpTo('Admisiones')} 
                                >
                                    <Text style={styles.inscriptionButtonText}>Inscribirse</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
};


export default function Cursos({ navigation }) {
    return (
        // 🛑 ENVOLVER TODO EL CONTENIDO CON EL BACKGROUND WRAPPER
        <BackgroundWrapper>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Oferta Académica</Text>
                        <Text style={styles.headerSubtitle}>Conoce las carreras que te prepararán para el futuro.</Text>
                    </View>
                    {cursosData.map((curso) => (
                        <CursoCard 
                            key={curso.id} 
                            curso={curso} 
                            navigation={navigation} 
                        />
                    ))}
                </ScrollView>
            </SafeAreaView>
        </BackgroundWrapper>
    );
}

// --- ESTILOS AJUSTADOS PARA EL FONDO DE PATRÓN ---
const COLOR_PRIMARY = '#922b21';
const COLOR_SUCCESS = '#28a745';

const styles = StyleSheet.create({
    // 🛑 AJUSTE: safeArea DEBE ser transparente para ver el wrapper
    safeArea: { flex: 1, backgroundColor: 'transparent' }, 
    // 🛑 AJUSTE: El ScrollView DEBE ser transparente
    container: { paddingVertical: 20, paddingHorizontal: 15, backgroundColor: 'transparent' }, 
    
    // 🛑 AJUSTE: Darle fondo blanco/claro al header para legibilidad
    header: { 
        marginBottom: 25, 
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 15,
        borderRadius: 8,
    },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLOR_PRIMARY },
    headerSubtitle: { fontSize: 16, color: '#555', marginTop: 5, textAlign: 'center' },
    
    // Las tarjetas ya tienen fondo blanco, por lo que se mantienen legibles.
    card: {
        backgroundColor: '#fff', borderRadius: 12, marginBottom: 20, overflow: 'hidden',
        elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 4,
    },
    // ... (El resto de estilos de la tarjeta se mantienen sin cambios)
    cardImage: { width: '100%', height: 180 },
    cardContent: { padding: 20 },
    cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    cardDescription: { fontSize: 15, color: '#666', lineHeight: 22 },
    toggleDescriptionButton: { alignSelf: 'flex-start', paddingVertical: 5 },
    toggleDescriptionButtonText: { color: COLOR_PRIMARY, fontWeight: 'bold', fontSize: 15 },
    expandedContent: { marginTop: 15 },
    cardInfoContainer: {
        flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20,
        borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15,
    },
    infoBlock: { alignItems: 'center', flex: 1 },
    infoLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
    infoValue: { fontSize: 14, fontWeight: 'bold', color: COLOR_PRIMARY, textAlign: 'center' },
    cardButton: {
        backgroundColor: COLOR_PRIMARY, paddingVertical: 12, borderRadius: 8,
        alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
    },
    cardButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginRight: 10 },
    planContainer: { marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#eee' },
    planTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    planItem: { fontSize: 15, color: '#666', marginBottom: 8, lineHeight: 22 },
    inscriptionButton: {
        backgroundColor: COLOR_SUCCESS, paddingVertical: 10, paddingHorizontal: 20,
        borderRadius: 6, alignSelf: 'flex-end', marginTop: 15,
    },
    inscriptionButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});