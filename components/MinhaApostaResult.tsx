import React from "react";
import { View, Text } from "react-native";
import { Colors } from "@/styles/colors";

type PossibleBet = {
  id: string;
  house: string;
  sorting_at: string;
  result_numbers?: string[];
};

type Bet = {
  id: string;
  state: string;
  created_at: string;
  numbers: string;
  amount_in_cents: number;
};

interface BetResultCardProps {
  possible_bet: PossibleBet;
  bet: Bet;
}

const BetResultCard: React.FC<BetResultCardProps> = ({ possible_bet, bet }) => {
  const betDate = new Date(bet.created_at).toLocaleString("pt-BR");
  const numbers = bet.numbers.split(",");
  const resultNumbers = possible_bet.result_numbers || [];

  const sections = [
    {
      title: "Status:",
      subtitle: bet.state,
      color: Colors.amareloClaro,
    },
    {
      title: "Banca:",
      subtitle: possible_bet.house,
      color: Colors.amareloClaro,
    },
    {
      title: "Data da Aposta:",
      subtitle: betDate,
    color: Colors.amareloClaro,
    },
    {
      title: "Data do Sorteio:",
      subtitle: possible_bet.sorting_at,
      color: Colors.amareloClaro,
    },
    {
      title: "Sua aposta:",
      subtitle: numbers.join(", "),
      color: Colors.amareloClaro,
    },
    {
      title: "Sorteio da Banca:",
      subtitle: resultNumbers.length > 0 ? resultNumbers.join(", ") : "Aguardando Resultado...",
      color: Colors.verdeclaro,
    },
    {
      title: "Resultado:",
      subtitle: bet.amount_in_cents,
      color: Colors.verdeclaro,
    },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        borderWidth: 1,
        borderColor: Colors.cinzaClaro || "#ccc",
        borderRadius: 12,
        overflow: "hidden",
        marginVertical: 8,
        backgroundColor: Colors.cinzaClaro,
      }}
    >
      {sections.map((section, index) => (
        <View
          key={index}
          style={{
            flex: 1,
            padding: 8,
            alignItems: "center",
            justifyContent: "center",
            borderRightWidth: index < sections.length - 1 ? 1 : 0,
            borderRightColor: Colors.cinzaClaro || "#ccc",
          }}
        >
          <Text style={{ color: section.color, fontWeight: "700", textAlign: "center" }}>
            {section.title}
          </Text>
          {section.subtitle !== "" && (
            <Text style={{ color: Colors.branco, textAlign: "center" }}>
              {section.subtitle}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

export default BetResultCard;
