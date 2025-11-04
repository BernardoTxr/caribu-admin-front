import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, Text } from "react-native";
import MinhaApostaResult from "@/components/MinhaApostaResult";
import { getUserBets } from "@/app/services/minhas_apostas";
import { Colors } from "@/styles/colors";

const MinhasApostas: React.FC = () => {
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBets = async () => {
      const token = localStorage.getItem('access_token');
      setLoading(true);
      if (token) {
        const data = await getUserBets(token);
        setBets(data);
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
        bets.map((bet, i) => (
          <MinhaApostaResult
            key={i}
            bet={bet.bet}
            possible_bet={bet.possible_bet}
          />
        ))
      )}
    </ScrollView>
  );
};

export default MinhasApostas;
