import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';

// --- Cores do Tema (Importadas de Login/Dashboard) ---
const PRIMARY_COLOR = '#1e3a8a'; // Azul escuro dominante
const SECONDARY_COLOR = '#facc15'; // Amarelo/Ouro de destaque
const LIGHT_TEXT_COLOR = '#fff'; // Texto claro
const ERROR_COLOR = '#dc3545'; // Vermelho para erros

// --- Definição de Tipos ---
interface ImageItem {
  id: number;
  url: string;
  description: string;
  active: boolean;
}

interface NewImageForm {
    url: string;
    description: string;
}

// --- Funções de Simulação da API (Mock) ---
// Em um ambiente real, você faria um 'fetch' para seus endpoints FastAPI
const API_BASE_URL = 'http://localhost:8000'; // Substitua pelo seu backend real

const simulateApiCall = async (method: string, endpoint: string, data?: any): Promise<any> => {
    // Atraso para simular o tempo de rede
    await new Promise(resolve => setTimeout(resolve, 800)); 

    // Simulação do GET /images
    if (method === 'GET' && endpoint === '/images') {
        // Dados mockados de exemplo
        return [
            { id: 1, url: 'https://cdn.example.com/banner-1.jpg', description: 'Banner Promocional Verão', active: true },
            { id: 2, url: 'https://cdn.example.com/banner-2.jpg', description: 'Banner de Boas-vindas', active: true },
            { id: 3, url: 'https://cdn.example.com/banner-antigo.jpg', description: 'Banner Desativado', active: false },
        ];
    }
    
    // Simulação de POST /images (Upload)
    if (method === 'POST' && endpoint === '/images') {
        const newId = Math.floor(Math.random() * 1000) + 10;
        return { id: newId, ...data }; // Retorna o objeto criado com ID
    }

    // Simulação de PUT/PATCH (Atualização)
    if (method === 'PUT' && endpoint.startsWith('/images/update-status')) {
        return { message: 'Status das imagens atualizado com sucesso.' };
    }

    throw new Error('Endpoint ou método de API não mockado/encontrado.');
};


// --- Componente Principal ---

const UpdateParametersPage = () => {
    // Estado das imagens atualmente carregadas
    const [images, setImages] = useState<ImageItem[]>([]);
    // Estado dos dados da nova imagem
    const [newImage, setNewImage] = useState<NewImageForm>({ url: '', description: '' });
    // Estado de carregamento
    const [loading, setLoading] = useState(true);
    // Estado de requisição em andamento (para desabilitar botões)
    const [isUpdating, setIsUpdating] = useState(false);
    
    // ------------------------------------
    // 1. Lógica GET: Carregar Imagens
    // ------------------------------------
    const fetchImages = async () => {
        setLoading(true);
        try {
            // Requisição real: const response = await fetch(`${API_BASE_URL}/images`);
            const data: ImageItem[] = await simulateApiCall('GET', '/images');
            setImages(data.sort((a, b) => a.id - b.id)); // Ordena por ID
        } catch (error) {
            Alert.alert("Erro de API", "Não foi possível carregar as imagens.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    // ------------------------------------
    // 2. Lógica de Check/Uncheck
    // ------------------------------------
    const toggleImageActive = (id: number) => {
        setImages(prevImages => 
            prevImages.map(img => 
                img.id === id ? { ...img, active: !img.active } : img
            )
        );
    };

    // ------------------------------------
    // 3. Lógica POST: Upload de Nova Imagem
    // ------------------------------------
    const handleUploadNewImage = async () => {
        if (!newImage.url.trim() || !newImage.description.trim()) {
            Alert.alert("Campos Obrigatórios", "A URL e a descrição da imagem são necessárias.");
            return;
        }

        setIsUpdating(true);
        try {
            // Dados completos para o POST (o backend deve adicionar o ID)
            const dataToPost = { 
                ...newImage, 
                active: true, // Nova imagem é sempre ativa por padrão
            };
            
            // Requisição real: const response = await fetch(`${API_BASE_URL}/images`, { method: 'POST', body: JSON.stringify(dataToPost) });
            const result = await simulateApiCall('POST', '/images', dataToPost);
            
            // Adiciona a nova imagem à lista local e limpa o formulário
            setImages(prevImages => [...prevImages, { id: result.id, ...dataToPost }]);
            setNewImage({ url: '', description: '' });
            
            Alert.alert("Sucesso", "Nova imagem carregada com sucesso! (ID: " + result.id + ")");

        } catch (error) {
            Alert.alert("Erro de Upload", "Não foi possível carregar a nova imagem.");
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    // ------------------------------------
    // 4. Lógica PUT/PATCH: Atualizar no Banco de Dados
    // ------------------------------------
    const handleUpdateStatuses = async () => {
        setIsUpdating(true);
        
        // Prepara os dados: apenas o array de objetos com {id, active}
        const statusesToUpdate = images.map(img => ({ id: img.id, active: img.active }));

        try {
            // Nota: No seu backend FastAPI, você precisaria de um endpoint PATCH/PUT 
            // que receba este array e execute um UPDATE para cada ID.

            // Requisição real: const response = await fetch(`${API_BASE_URL}/images/update-status`, { method: 'PUT', body: JSON.stringify({ updates: statusesToUpdate }) });
            await simulateApiCall('PUT', '/images/update-status', { updates: statusesToUpdate });
            
            Alert.alert("Sucesso", "Status das imagens atualizado no banco de dados.");
        } catch (error) {
            Alert.alert("Erro de Atualização", "Não foi possível atualizar os status.");
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={SECONDARY_COLOR} />
                <Text style={styles.loadingText}>Carregando imagens...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>Gerenciamento de Imagens</Text>
            
            {/* Seção 1: Upload de Nova Imagem */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Carregar Nova Imagem</Text>
                
                <TextInput
                    style={styles.input}
                    placeholder="URL da Imagem (Ex: https://...)"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    value={newImage.url}
                    onChangeText={(text) => setNewImage(p => ({ ...p, url: text }))}
                    keyboardType="url"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Descrição"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    value={newImage.description}
                    onChangeText={(text) => setNewImage(p => ({ ...p, description: text }))}
                />

                <TouchableOpacity 
                    style={[styles.button, isUpdating && styles.buttonDisabled]}
                    onPress={handleUploadNewImage}
                    disabled={isUpdating}
                >
                    {isUpdating ? (
                        <ActivityIndicator color={PRIMARY_COLOR} />
                    ) : (
                        <Text style={styles.buttonText}>Fazer Upload</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Seção 2: Imagens Existentes e Atualização de Status */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Status das Imagens (Ativas/Inativas)</Text>
                
                {images.map((img) => (
                    <View key={img.id} style={styles.imageRow}>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => toggleImageActive(img.id)}
                        >
                            <View style={[styles.checkboxInner, img.active && styles.checkboxChecked]} />
                        </TouchableOpacity>
                        <View style={styles.imageTextContainer}>
                             <Text style={styles.imageDescriptionText}>{img.description} (ID: {img.id})</Text>
                             <Text style={[styles.imageUrlText, !img.active && { color: ERROR_COLOR }]}>
                                Status: {img.active ? 'Ativa' : 'Inativa'}
                            </Text>
                        </View>
                    </View>
                ))}

                <TouchableOpacity 
                    style={[styles.button, styles.updateButton, isUpdating && styles.buttonDisabled]}
                    onPress={handleUpdateStatuses}
                    disabled={isUpdating}
                >
                    {isUpdating ? (
                        <ActivityIndicator color={PRIMARY_COLOR} />
                    ) : (
                        <Text style={styles.buttonText}>Atualizar Status no BD</Text>
                    )}
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
};

// --- Estilos Coerentes com o Tema Escuro ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PRIMARY_COLOR, // Fundo dominante
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: SECONDARY_COLOR, // Título em amarelo/ouro
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PRIMARY_COLOR,
    },
    loadingText: {
        color: LIGHT_TEXT_COLOR,
        marginTop: 10,
    },
    sectionContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)', // Fundo semi-transparente
        padding: 15,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: LIGHT_TEXT_COLOR,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.2)',
        paddingBottom: 5,
    },
    input: {
        height: 45,
        borderColor: 'rgba(255,255,255,0.4)',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 10,
        backgroundColor: INPUT_BACKGROUND_COLOR,
        color: LIGHT_TEXT_COLOR,
    },
    button: {
        marginTop: 10,
        backgroundColor: SECONDARY_COLOR,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    updateButton: {
        marginTop: 20,
    },
    buttonText: {
        color: PRIMARY_COLOR,
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    // Estilos da Lista de Imagens
    imageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    imageTextContainer: {
        flex: 1,
        marginLeft: 10,
    },
    imageDescriptionText: {
        color: LIGHT_TEXT_COLOR,
        fontSize: 14,
        fontWeight: 'bold',
    },
    imageUrlText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },
    // Estilos do Checkbox
    checkbox: {
        width: 30,
        height: 30,
        borderWidth: 2,
        borderColor: LIGHT_TEXT_COLOR,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    checkboxInner: {
        width: 18,
        height: 18,
        backgroundColor: 'transparent',
    },
    checkboxChecked: {
        backgroundColor: SECONDARY_COLOR, // Fundo do check em amarelo
    },
});

export default UpdateParametersPage;