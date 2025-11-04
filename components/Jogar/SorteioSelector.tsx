import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors } from "@/styles/colors";

type Props = { selected: number[]; onChange: (arr: number[]) => void; showTodos?: boolean };
const BTN = [1, 2, 3, 4, 5];

const SorteioSelector: React.FC<Props> = ({ selected, onChange, showTodos = true }) => {
  const toggle = (n: number) =>
    selected.includes(n)
      ? onChange(selected.filter((x) => x !== n))
      : onChange([...selected, n].sort((a, b) => a - b));

  return (
    <View style={{ width: "100%", marginBottom: 14 }}>
      <View style={s.row}>
        {BTN.map((n) => {
          const active = selected.includes(n);
          return (
            <Pressable key={n} onPress={() => toggle(n)} style={[s.box, active && s.boxActive]}>
              <Text style={s.boxText}>{n}º</Text>
            </Pressable>
          );
        })}
      </View>

      {showTodos && (
        <Pressable onPress={() => onChange([...BTN])} style={s.todosBtn}>
          <Text style={s.todosTxt}>Selecionar todos</Text>
        </Pressable>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  row: { flexDirection: "row", gap: 12 as any, marginTop: 2 },
  box: {
    width: 76,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.azulclarotransparente,          // mesma base dos cards
    borderWidth: 1,
    borderColor: Colors.bordaamarelotransparente,
  },
  boxActive: {
    backgroundColor: Colors.amarelo,                        // ativo = amarelo
    borderColor: Colors.amarelo,
  },
  
  boxText: { color: Colors.azulEscuro, fontWeight: "800" as const, fontSize: 16 },
  todosBtn: { marginTop: 10, alignSelf: "flex-start", paddingHorizontal: 6, paddingVertical: 4 },
  todosTxt: { color: Colors.amarelo, fontWeight: "900" as const },
});

export default SorteioSelector;
