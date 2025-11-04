import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors } from "@/styles/colors";

export type BetCategory =
  | "Grupo" | "Milhar" | "Milhar Invertida" | "Centena" | "Centena Invertida"
  | "Milhar com Centena" | "Milhar com Centena Invertida" | "Dezena"
  | "Dupla de Grupo" | "Terno de Grupo" | "Quadra de Grupo" | "Quina de Grupo"
  | "Duque de Dezena" | "Terno de Dezena";

const ALL: BetCategory[] = [
  "Grupo","Milhar","Milhar Invertida","Centena","Centena Invertida",
  "Milhar com Centena","Milhar com Centena Invertida","Dezena",
  "Dupla de Grupo","Terno de Grupo","Quadra de Grupo","Quina de Grupo",
  "Duque de Dezena","Terno de Dezena",
];

type Props = { value: BetCategory; onChange: (c: BetCategory) => void };

const BetCategorySelector: React.FC<Props> = ({ value, onChange }) => {
  return (
    <View style={s.wrap}>
      {ALL.map((c) => {
        const active = c === value;
        return (
          <Pressable
            key={c}
            onPress={() => onChange(c)}
            style={[s.chip, active && s.chipActive]}
          >
            <Text style={[s.chipText, active && s.chipTextActive]}>{c}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const s = StyleSheet.create({
  wrap: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12 as any,
    marginBottom: 14,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.azulescuro,
    borderWidth: 1,
    borderColor: Colors.bordaamarelotransparente,
  },
  chipActive: {
    backgroundColor: Colors.amarelo,
    borderColor: Colors.amarelo,
  },
  chipText: { color: Colors.branco, fontWeight: "800" as const },
  chipTextActive: { color: Colors.azulEscuro, fontWeight: "900" as const },
});

export default BetCategorySelector;
