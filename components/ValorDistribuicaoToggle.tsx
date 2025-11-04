import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors } from "@/styles/colors";

export type Distribuicao = "todos" | "cada";

type Props = {
  value: Distribuicao;
  onChange: (v: Distribuicao) => void;
};

const ValorDistribuicaoToggle: React.FC<Props> = ({ value, onChange }) => {
  const Item = ({ label, v }: { label: string; v: Distribuicao }) => {
    const active = value === v;
    return (
      <Pressable onPress={() => onChange(v)} style={s.item}>
        <View style={[s.radio, active && s.radioOn]} />
        <Text style={[s.txt, active && s.txtOn]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={s.row}>
      <Item label="Todos" v="todos" />
      <Item label="Cada" v="cada" />
    </View>
  );
};

const s = StyleSheet.create({
  row: { flexDirection: "row", gap: 18 as any, alignItems: "center", marginTop: 8 },
  item: { flexDirection: "row", alignItems: "center", gap: 8 as any },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: Colors.bordaamarelotransparente,
  },
  radioOn: { backgroundColor: Colors.verdeclaro, borderColor: Colors.verdeclaro },
  txt: { color: Colors.branco, fontWeight: "700" as const },
  txtOn: { color: Colors.verdeclaro },
});

export default ValorDistribuicaoToggle;
