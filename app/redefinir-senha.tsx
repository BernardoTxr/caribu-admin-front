import React, { useState, useCallback, useEffect } from 'react';
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
import { useFocusEffect, useRouter, useLocalSearchParams } from 'expo-router';
import { Lock, Eye, EyeOff, Mail } from 'lucide-react-native';
import { resetPassword } from './services/auth';
import { validatePassword } from '@/utils/validate_auth_inputs';

const RedefinirSenha = () => {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'web') {
        document.title = 'Caribú Loterias | Redefinir Senha';
      }
    }, [])
  );

  const router = useRouter();
  const { token } = useLocalSearchParams(); // Captura o token da URL

  const [isValidatedPassword, setIsValidatedPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const focusStyle = Platform.OS === 'web'
    ? { outlineWidth: 0, outlineColor: 'transparent' }
    : {};


  // verifica se as senhas são iguais
  useEffect(() => {
    if (newPassword && confirmPassword) {
      setPasswordsMatch(newPassword === confirmPassword);
    }
  }, [newPassword, confirmPassword]);

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      window.alert('Erro - Preencha todos os campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      window.alert('Erro - As senhas não coincidem.');
      return;
    }

    const { isValid, error } = validatePassword(newPassword);
    if (!isValid) {
      window.alert('Erro - ' + error);
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({new_password: newPassword, token: String(token)});
      window.alert('Senha redefinida com sucesso!');
      router.push('/login');
    } catch (error: any) {
      window.alert('Erro: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/favicon-removebg.png')} style={styles.logo} />
        <Text style={styles.title}>Redefinir Senha</Text>

      {/* Nova Senha */}
      <Text style={styles.label}>Nova Senha</Text>
      <View style={styles.inputWrapper}>
        <Lock color="#a0c4ff" size={20} style={styles.icon} />
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="••••••••"
          placeholderTextColor="#a0c4ff"
          secureTextEntry={!showPassword}
          style={[styles.input, focusStyle]}
        />
      </View>

      {/* Confirmar Senha */}
      <Text style={styles.label}>Confirmar Senha</Text>
      <View style={styles.inputWrapper}>
        <Lock color="#a0c4ff" size={20} style={styles.icon} />
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="••••••••"
          placeholderTextColor="#a0c4ff"
          secureTextEntry={!showPassword}
          style={[styles.input, focusStyle]}
        />
      </View>

      {!passwordsMatch && (
        <Text style={{ color: 'red', marginTop: 4 }}>As senhas não coincidem.</Text>
      )}

        <TouchableOpacity
          onPress={handleReset}
          style={[styles.button, isLoading && styles.buttonDisabled]}
          disabled={isLoading || !passwordsMatch}
        >
          {isLoading ? (
            <>
              <ActivityIndicator size="small" color="#1e3a8a" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Enviando...</Text>
            </>
          ) : (
            <Text style={styles.buttonText}>Redefinir Senha</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = loginStyles;

export default RedefinirSenha;
