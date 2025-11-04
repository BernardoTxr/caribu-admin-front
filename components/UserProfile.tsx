import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface UserProfileProps {
  email?: string;
  balance?: number;
  onClick?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  email = '', 
  balance = 0, 
  onClick 
}) => {
  // Pegar primeira letra do email
  const firstLetter = email.charAt(0).toUpperCase();
  
  // Formatar saldo (dividir por 100 para converter de centavos para reais)
  const formatBalance = (cents: number) => {
    const reais = cents;
    return String(reais).replace('.', ',');
  };

  return (
    <TouchableOpacity 
      onPress={onClick}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#facc15',
        borderRadius: 8,
        paddingVertical: 3,
        paddingHorizontal: 12,
        gap: 8,
      }}
    >

       <View style={{ flexDirection: 'column' }}>
        <Text
          style={{
            color: '#1e3a8a',
            fontSize: 12,
            fontWeight: '500',
          }}
        >
          Saldo
        </Text>
        <Text
          style={{
            color: '#1e3a8a',
            fontSize: 14,
            fontWeight: 'bold',
          }}
        >
          R$ {formatBalance(balance)}
        </Text>
      </View>
      
      {/* Avatar com primeira letra */}
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: '#1e3a8a',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          {firstLetter}
        </Text>
      </View>

      {/* Saldo */}
     
    </TouchableOpacity>
  );
};

export default UserProfile;
