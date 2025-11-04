import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform
} from 'react-native';
import loginStyles from '@/styles/login';
import { useFocusEffect, useRouter } from 'expo-router';
import { User, Mail, Phone, Key, Lock, Eye, EyeOff } from 'lucide-react-native';
import { registerUser } from './services/auth';
import { Picker } from '@react-native-picker/picker';
import { validateCPF, validateEmail, validateTelefone, validatePixKey, validatePassword } from '@/utils/validate_auth_inputs'; 

const Registro = () => {
  {/*Hook para Atualização do Título apenas na Web*/}
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'web') {
        document.title = 'Caribú Loterias | Cadastro';
      }
    }, [])
  );

  {/*Objetos*/}
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [tipoChavePix, setTipoChavePix] = useState<'cpf' | 'email' | 'telefone' | 'aleatoria'>('cpf');
  const [chavePix, setChavePix] = useState('');
  const [telefone, setTelefone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const focusStyle =
    Platform.OS === 'web'
      ? {
          outlineWidth: 0,
          outlineColor: 'transparent'
        }
      : {};

  {/*Funções*/}
  const handleRegister = async () => {
  {/*TODO: 1. Trocar Window.alert por componente em Tela 
  */}
    if (!cpf || !email || !chavePix || !tipoChavePix || !password || !telefone) {
      window.alert('Erro - Preencha todos os campos.');
      return;
    }
    if (!validateCPF(cpf)) {
      window.alert('Erro - CPF inválido.');
      return;
    }
    if (!validateEmail(email)) {
      window.alert('Erro - E-mail inválido.');
      return;
    }
    if (!validateTelefone(telefone)) {
      window.alert('Erro - Telefone inválido.');
      return;
    }
    const { isValid, error } = validatePassword(password);
    if (!isValid) {
      window.alert('Erro - ' + error);
      return;
    }
    if (!validatePixKey(tipoChavePix, chavePix)) {
      window.alert('Erro - Chave Pix inválida para o tipo selecionado.');
      return;
    }
    setIsLoading(true);
    try {
      await registerUser({
        password,
        email,
        cpf,
        telefone: telefone,
        tipo_chave_pix: tipoChavePix,
        chave_pix: chavePix,
      });

      window.alert('Sucesso - Cadastro realizado com sucesso!');
      router.push('/login');
    } catch (error) {
      window.alert('Erro - Não foi possível completar o cadastro.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*Logo e Título*/}
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/favicon-removebg.png')} style={styles.logo} />
        <Text style={styles.title}>Cadastro</Text>
      </View>

      <View style={styles.formContainer}>

        {/* CPF */}
        <Text style={styles.label}>CPF</Text>
        <View style={styles.inputWrapper}>
          <User color="#a0c4ff" size={20} style={styles.icon} />
          <TextInput
            value={cpf}
            onChangeText={setCpf}
            placeholder="000.000.000-00"
            placeholderTextColor="#a0c4ff"
            keyboardType="numeric"
            style={[styles.input, focusStyle]}
          />
        </View>

        {/* E-mail */}
        <Text style={styles.label}>E-mail</Text>
        <View style={styles.inputWrapper}>
          <Mail color="#a0c4ff" size={20} style={styles.icon} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor="#a0c4ff"
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, focusStyle]}
          />
        </View>

        {/* Senha */}
        <Text style={styles.label}>Senha</Text>
        <View style={styles.inputWrapper}>
          <Lock color="#a0c4ff" size={20} style={styles.icon} />
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

        {/* Telefone*/}
        <Text style={styles.label}>Telefone</Text>
        <View style={styles.inputWrapper}>
          <Phone color="#a0c4ff" size={20} style={styles.icon} />
          <TextInput
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(00) 00000-0000"
            placeholderTextColor="#a0c4ff"
            keyboardType="phone-pad"
            style={[styles.input, focusStyle]}
          />
        </View>


        {/* Tipo de Chave Pix */}
        <Text style={styles.label}>Tipo da Chave Pix</Text>
        <View style={[styles.inputWrapper, { paddingHorizontal: 10 }]}>
          <Picker
            selectedValue={tipoChavePix}
            onValueChange={(itemValue) => setTipoChavePix(itemValue)}
            style={[styles.input, { color: '#a0c4ff', backgroundColor: 'transparent' }]}
            dropdownIconColor="#a0c4ff"
          >
            <Picker.Item label="CPF" value="cpf" color="#1e3a8a" style={{backgroundColor: '#a0c4ff'}} />
            <Picker.Item label="E-mail" value="email" color="#1e3a8a" style={{backgroundColor: '#a0c4ff'}} />
            <Picker.Item label="Telefone" value="telefone" color="#1e3a8a" style={{backgroundColor: '#a0c4ff'}} />
            <Picker.Item label="Chave Aleatória" value="aleatoria" color="#1e3a8a" style={{backgroundColor: '#a0c4ff'}} />
          </Picker>
        </View>

        {/* Chave Pix */}
        <Text style={[styles.label]}>Chave Pix</Text>
        <View style={styles.inputWrapper}>
          <Key color="#a0c4ff" size={20} style={styles.icon} />
          <TextInput
            value={chavePix}
            onChangeText={setChavePix}
            placeholder={
              tipoChavePix === 'cpf'
                ? '000.000.000-00'
                : tipoChavePix === 'email'
                ? 'seu@email.com'
                : tipoChavePix === 'telefone'
                ? '(00) 00000-0000'
                : 'chave aleatória'
            }
            placeholderTextColor="#a0c4ff"
            keyboardType={
              tipoChavePix === 'cpf' || tipoChavePix === 'telefone'
                ? 'numeric'
                : 'default'
            }
            autoCapitalize="none"
            style={[styles.input, focusStyle]}
          />
        </View>

        {/* Botão cadastrar */}
        <TouchableOpacity
          onPress={handleRegister}
          style={[styles.button, isLoading && styles.buttonDisabled]}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <ActivityIndicator size="small" color="#1e3a8a" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Cadastrando...</Text>
            </>
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        {/*Já tem uma conta? */}
        <TouchableOpacity onPress={() => router.push('/login')} style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={{ color: '#a0c4ff', textDecorationLine: 'underline' }}>
                Já tem uma conta? Logar 
            </Text>
        </TouchableOpacity>

      </View>

      {/*Termos de Uso*/}
      <Text style={styles.terms}>
        Ao continuar, você concorda com nossos{' '}
        <Text style={styles.termsHighlight}>Termos de Uso</Text>
      </Text>
    </ScrollView>
  );
};

const styles = loginStyles;

export default Registro;
