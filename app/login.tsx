//Importação de Dependências
import React, { useState, useCallback } from 'react';
import { Modal } from 'react-native';
import {View,Text,TextInput,TouchableOpacity,Image,ActivityIndicator,Alert,ScrollView,Platform} from 'react-native';
import loginStyles from '@/styles/login'; // Adjust the import path as necessary
import { useFocusEffect, useRouter } from 'expo-router';
import { Eye, EyeOff, User, Lock } from 'lucide-react-native';
import { loginUser, forgotPassword} from './services/auth'; // Adjust the import path as necessary]
import { validateEmailOrCpf, validatePassword } from '@/utils/validate_auth_inputs'; // Adjust the import path as necessary

//Componente de Login
const Login = () => {
    {/*Hook para Atualização do Título apenas na Web*/}
    useFocusEffect(
        useCallback(() => {
            if (Platform.OS === 'web') {
                document.title = 'Caribú Loterias | Login';
            }
        }, [])
    );

    {/*Objeto para Controle entre Páginas*/}
    const router = useRouter();
    const [emailOrCpf, setEmailOrCpf] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState('');

    {/*Funções*/}
    const handleLogin = async () => {
        {/*
        TODO: 
        1. Implement feedback component instead of window.alert
        2. Verificar se localStorage funciona para MOBILE
        */}
        if (!validateEmailOrCpf(emailOrCpf)) {
            window.alert('Erro - Digite um e-mail ou CPF válido.');
            return;
        }
        const { isValid, error } = validatePassword(password);
            if (!isValid) {
            window.alert(`Erro - ${error}`);
            return;
            }
        setIsLoading(true);
        try {
            const token = await loginUser({ emailOrCpf, password });
            console.log('Resposta do login:', token);
            
            if (token?.message === "Login bem-sucedido" && token?.token) {
                // Armazenar token dependendo da plataforma
                if (Platform.OS === 'web') {
                    localStorage.setItem("access_token", token.token);
                } else {
                    // Para mobile, usar AsyncStorage ou SecureStore
                    // Por enquanto apenas console.log
                    console.log('Token para mobile:', token.token);
                }
                
                console.log('Redirecionando para página principal...');
                router.replace('/'); // Usar / (index.tsx) que deve redirecionar para main
            } else {
                throw new Error('Resposta de login inválida');
            }
        } catch (error) {
            window.alert('Login Inválido. Verifique seu usuário e senha.');
            console.error('Erro ao fazer login:', error);
        } finally {
            setIsLoading(false);
        }
        // Reset fields after login attempt
        setEmailOrCpf('');
        setPassword('');
        setIsLoading(false);
    };
    const handleRegister = () => {
        router.push('/registro');
    };
    const handleForgotPassword = () => {
        setIsModalVisible(true);
    };
    const sendRecoveryEmail = async () => {
        if (!recoveryEmail) {
            window.alert('Por favor, insira um email válido.');
            return;
        }
        try {
            const result = await forgotPassword({ email: recoveryEmail });
            window.alert(result.message);
        } catch (err: any) {
            window.alert(err.message);
        }
        setRecoveryEmail('');
        setIsModalVisible(false);
    };

    {/*Estilos do Componente*/}
    const styles = loginStyles;
    const focusStyle = Platform.OS === 'web'? {/*outlineStyle: 'none',*/outlineWidth: 0,outlineColor: 'transparent',}: {};
    
    {/*Objeto Retornado*/}
    return (
        <View style={{ height: '100%' }}>
            {/*Popup de Recuperação de Senha*/}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Recuperar Senha</Text>
                        <TextInput
                            value={recoveryEmail}
                            onChangeText={setRecoveryEmail}
                            placeholder="Digite seu email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.modalInput}
                            placeholderTextColor="#a0c4ff"
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={sendRecoveryEmail} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Enviar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={[styles.modalButton, styles.modalCancelButton]}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/*Formulário de Login */}
            <ScrollView contentContainerStyle={styles.container}>

                {/*Logo e Título*/}
                <View id="logo-container" style={styles.logoContainer}>
                    <Image source={require('@/assets/images/favicon-removebg.png')} style={styles.logo} />
                    <Text style={styles.title}>Seja Bem-Vindo</Text>
                </View>

                {/*Formulário de Login*/}
                <View style={styles.formContainer}>

                    {/*Campo de Email/CPF*/}
                    <Text style={styles.label}>Email/CPF</Text>
                    <View style={styles.inputWrapper}>
                        <User color="#a0c4ff" size={20} style={styles.icon} />
                        <TextInput
                        value={emailOrCpf}
                        onChangeText={setEmailOrCpf}
                        placeholder="Seu email ou CPF"
                        placeholderTextColor="#a0c4ff"
                        autoCapitalize="none"
                        style={[styles.input, focusStyle]}
                        />
                    </View>

                    {/*Campo de Senha*/}
                    <Text style={[styles.label, { marginTop: 20 }]}>Senha</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            placeholderTextColor="#a0c4ff"
                            secureTextEntry={!showPassword}
                            style={[styles.input, focusStyle]}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            {showPassword ? <EyeOff size={20} color="#a0c4ff" /> : <Eye size={20} color="#a0c4ff" />}
                        </TouchableOpacity>
                    </View>

                    {/*Botão de Acessar*/}
                    <TouchableOpacity
                    onPress={handleLogin}
                    style={[styles.button, (!emailOrCpf || !password || isLoading) && styles.buttonDisabled]}
                    disabled={!emailOrCpf || !password || isLoading}
                    >
                    {isLoading ? (
                        <>
                        <ActivityIndicator size="small" color="#1e3a8a" style={{ marginRight: 8 }} />
                        <Text style={styles.buttonText}>Entrando...</Text>
                        </>
                    ) : (
                        <Text style={styles.buttonText}>Acessar</Text>
                    )}
                    </TouchableOpacity>

                    {/*Botão de Esqueci a Senha*/}
                    <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotButton}>
                        <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
                     </TouchableOpacity>
                     
                </View>
            
                {/*Botão para Novo Cadastro*/}
                <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
                    <Text style={styles.registerText}>Novo Cadastro</Text>
                </TouchableOpacity>

                {/*Termos de Uso*/}
                <Text style={styles.terms}>
                    Ao continuar, você concorda com nossos{' '}
                    <Text style={styles.termsHighlight}>Termos de Uso</Text>
                </Text>
            </ScrollView>
        </View>
    );
};


//Exportação do Componente
export default Login;
