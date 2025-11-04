//Importação de Dependências
import React, { useState, useCallback } from 'react';
import { Modal } from 'react-native';
import {View,Text,TextInput,TouchableOpacity,Image,ActivityIndicator,Alert,ScrollView,Platform} from 'react-native';
// Adicionar a importação do useNavigation e remover useRouter
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native'; 
import loginStyles from '../../styles/login';
import { Eye, EyeOff, User, Lock } from 'lucide-react-native';
import { loginUser } from '../../services/auth';
import { forgotPassword } from '../../services/auth';


// Lógicas de Validação (Mantidas inalteradas)
const validateEmail = (input: string): boolean => {
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(input);
};

const validateCPF = (input: string): boolean => {
  const numericCpf = input.replace(/[^\d]/g, '');
  if (numericCpf.length !== 11) return false;

  // CPF com todos os dígitos iguais é inválido
  if (/^(\d)\1{10}$/.test(numericCpf)) return false;

  const calcCheckDigit = (cpf: string, factor: number): number => {
    let total = 0;
    for (let i = 0; i < factor - 1; i++) {
      total += parseInt(cpf[i]) * (factor - i);
    }
    const remainder = (total * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const digit1 = calcCheckDigit(numericCpf, 10);
  const digit2 = calcCheckDigit(numericCpf, 11);

  return digit1 === parseInt(numericCpf[9]) &&
         digit2 === parseInt(numericCpf[10]);
};

const validateEmailOrCpf = (input: string): boolean => {
  return validateEmail(input) || validateCPF(input);
};



const validatePassword = (password: string): { isValid: boolean; error: string } => {
  if (password.length < 7) {
    return {
      isValid: false,
      error: 'A senha deve ter no mínimo 7 caracteres.',
    };
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter) {
    return {
      isValid: false,
      error: 'A senha deve conter pelo menos uma letra e um número.',
    };
  }

  if (!hasNumber) {
    return {
      isValid: false,
      error: 'A senha deve conter pelo menos uma letra e um número.',
    };
  }

  return { isValid: true, error: '' };
};

const validateTelefone = (input: string): boolean => {
  const numericPhone = input.replace(/[^\d]/g, '');
  console.log(numericPhone)
  // Válido se tiver 10 (fixo) ou 11 (celular) dígitos e começar com DDD entre 11 e 99
  if (numericPhone.length !== 10 && numericPhone.length !== 11) {

    return false;
  }

  const ddd = parseInt(numericPhone.slice(0, 2));
  if (ddd < 11 || ddd > 99) {
    return false;
  }

  // Se for celular (11 dígitos), o terceiro dígito deve ser 9
  if (numericPhone.length === 11 && numericPhone[2] !== '9') {
    return false;
  }

  return true;
};

const validatePixKey = (tipo: 'cpf' | 'email' | 'telefone' | 'aleatoria', chave: string): boolean => {
  switch (tipo) {
    case 'cpf':
      return validateCPF(chave);
    case 'email':
      return validateEmail(chave);
    case 'telefone':
      return validateTelefone(chave);
    case 'aleatoria':
      return chave.length > 0; // ou outro critério
    default:
      return false;
  }
};


export { validateEmailOrCpf, validatePassword, validateTelefone, validatePixKey, validateCPF, validateEmail };

//Componente de Login
const Login = () => {
    // Hook para usar a navegação da Stack
    const navigation = useNavigation();

    {/*Hook para Atualização do Título apenas na Web*/}
    useFocusEffect(
        useCallback(() => {
            if (Platform.OS === 'web') {
                document.title = 'Caribú Loterias | Login';
            }
        }, [])
    );

    {/*Objeto para Controle de Estado*/}
    const [emailOrCpf, setEmailOrCpf] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState('');

    {/*Funções*/}
    const handleLogin = async () => {
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
                    console.log('Token para mobile:', token.token);
                }
                
                console.log('Redirecionando para página principal...');
                navigation.navigate('App'); 
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
  

    {/*Estilos do Componente*/}
    const styles = loginStyles;
    const focusStyle = Platform.OS === 'web'? {/*outlineStyle: 'none',*/outlineWidth: 0,outlineColor: 'transparent',}: {};
    
    {/*Objeto Retornado*/}
    return (
        <View style={{ height: '100%' }}>

            {/*Formulário de Login */}
            <ScrollView contentContainerStyle={styles.container}>

                {/*Logo e Título*/}
                <View id="logo-container" style={styles.logoContainer}>
                    <Text style={styles.title}>Tela de Administração</Text>
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
                     
                </View>
            </ScrollView>
        </View>
    );
};


//Exportação do Componente
export default Login;