import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Colors } from "@/styles/colors";
import type { BetCategory } from "@/components/Jogar/BetCategorySelector";

// ⬇️ exporta os tipos para o Jogar.tsx poder usar no type guard
export type Mode =
  | "Milhar"
  | "Milhar Invertida"
  | "Centena"
  | "Centena Invertida"
  | "Dezena"
  | "Duque de Dezena"
  | "Terno de Dezena"
  | "Milhar com Centena"
  | "Milhar com Centena Invertida";

export type Value = {
  milhar?: string;
  centena?: string;
  dezena?: string;
  dezenas?: string[]; // para Duque/Terno de Dezena
};

type Props = {
  mode: Mode | BetCategory;    // <- aceita tanto Mode quanto BetCategory
  value: Value;
  onChange: (v: Value) => void;
};

const onlyDigits = (s: string) => s.replace(/\D+/g, "");

const NumberEntry: React.FC<Props> = ({ mode, value, onChange }) => {
  const renderMilhar =
    mode === "Milhar" ||
    mode === "Milhar Invertida" ||
    mode === "Milhar com Centena" ||
    mode === "Milhar com Centena Invertida";

  const renderCentena =
    mode === "Centena" ||
    mode === "Centena Invertida" ||
    mode === "Milhar com Centena" ||
    mode === "Milhar com Centena Invertida";

  const singleDezena = mode === "Dezena";
  const dezenasCount =
    mode === "Duque de Dezena" ? 2 : mode === "Terno de Dezena" ? 3 : 0;

  const dozens = dezenasCount
    ? (value.dezenas ?? Array(dezenasCount).fill("")).slice(0, dezenasCount)
    : [];

  return (
    <View style={s.wrap}>
      <Text style={s.title}>Escolha os números</Text>

      {renderMilhar && (
        <View style={s.field}>
          <Text style={s.label}>Milhar (4 dígitos)</Text>
          <TextInput
            style={s.input}
            value={value.milhar ?? ""}
            onChangeText={(t) =>
              onChange({ ...value, milhar: onlyDigits(t).slice(0, 4) })
            }
            keyboardType="numeric"
            placeholder="0000"
            placeholderTextColor={Colors.cinzaClaro}
          />
        </View>
      )}

      {renderCentena && (
        <View style={s.field}>
          <Text style={s.label}>Centena (3 dígitos)</Text>
          <TextInput
            style={s.input}
            value={value.centena ?? ""}
            onChangeText={(t) =>
              onChange({ ...value, centena: onlyDigits(t).slice(0, 3) })
            }
            keyboardType="numeric"
            placeholder="000"
            placeholderTextColor={Colors.cinzaClaro}
          />
        </View>
      )}

      {singleDezena && (
        <View style={s.field}>
          <Text style={s.label}>Dezena (2 dígitos)</Text>
          <TextInput
            style={s.input}
            value={value.dezena ?? ""}
            onChangeText={(t) =>
              onChange({ ...value, dezena: onlyDigits(t).slice(0, 2) })
            }
            keyboardType="numeric"
            placeholder="00"
            placeholderTextColor={Colors.cinzaClaro}
          />
        </View>
      )}

      {dezenasCount > 0 && (
        <View style={s.field}>
          <Text style={s.label}>
            {mode} ({dezenasCount}× 2 dígitos)
          </Text>
          <View style={s.row}>
            {Array.from({ length: dezenasCount }).map((_, idx) => (
              <TextInput
                key={idx}
                style={[s.input, s.inputHalf]}
                value={dozens[idx] ?? ""}
                onChangeText={(t) => {
                  const next = [...dozens];
                  next[idx] = onlyDigits(t).slice(0, 2);
                  onChange({ ...value, dezenas: next });
                }}
                keyboardType="numeric"
                placeholder="00"
                placeholderTextColor={Colors.cinzaClaro}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  wrap: { width: "100%", marginTop: 6, marginBottom: 16 },

  title: { color: Colors.azulEscuro, fontWeight: "900", marginBottom: 10 },
  field: { marginBottom: 10 },
  label: { color: Colors.azulEscuro, marginBottom: 6, fontWeight: "700" },
  row: { flexDirection: "row", gap: 12 as any },
  input: {
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: Colors.azulclarotransparente,
    borderWidth: 1,
    borderColor: Colors.bordaamarelotransparente,
    color: Colors.azulEscuro,
    fontWeight: "900" as const,
    fontSize: 16,
  },
  inputHalf: { flex: 1, minWidth: 96 },
});

export default NumberEntry;
