import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, Text } from "react-native";
import BetTable from "@/components/pages/MinhasApostas/MinhaApostaResult";
import { Colors } from "@/styles/colors";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const getUserBets = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bets/my_bets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Pega do backend diretamente
      const message = errorData.message || errorData.detail || 'Erro desconhecido';
      throw new Error(message);
    }

    return await response.json();
  } catch (err: any) {
    console.error('Erro na chamada da API:', err);
    throw err;
  }
};

const MinhasApostas: React.FC = () => {
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBets = async () => {
      const token = localStorage.getItem('access_token');
      setLoading(true);
      if (token) {
        const data = await getUserBets(token);
        console.log(data);
        setBets(data.bets || []);
        setLoading(false);
      }
      
    };
    fetchBets();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.amarelo || "gold"} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.branco}} contentContainerStyle={{ padding: 16 }}>
      {bets.length === 0 ? (
        <Text style={{ color: Colors.branco }}>Você ainda não fez apostas.</Text>
      ) : (       
          <BetTable
            bets={bets}
          />
      )}
    </ScrollView>
  );
};

export default MinhasApostas;
