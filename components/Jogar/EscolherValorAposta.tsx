// EscolherValorAposta — simples + seletor Todos/Cada
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Pressable } from "react-native";
import s from "@/styles/escolherValorAposta";
import { Colors } from "@/styles/colors";
import { useUserData } from "../Components";

type ApplyMode = "todos" | "cada";

type Props = {
  // saldo (mock ou controlado)
  balance?: number | null;
  initialBalance?: number;
  initialValue?: number;

  // modo de aplicar o valor nas apostas (opcional, controlado)
  applyMode?: ApplyMode;                 // "todos" | "cada"
  onApplyModeChange?: (m: ApplyMode) => void;
  showApplyModeSwitch?: boolean;         // esconder/mostrar (default true)

  onConfirm?: (v: number) => void;
};

const STORAGE_KEY = "saldo_mock_escolher_valor_simples";

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const parseLoose = (txt: string) => {
  const clean = txt.replace(/[^\d,.\-]/g, "").replace(",", ".");
  const v = parseFloat(clean);
  return Number.isFinite(v) ? v : 0;
};

const EscolherValorAposta: React.FC<Props> = ({
  balance,
  initialBalance = 150,
  initialValue = 5,
  applyMode,
  onApplyModeChange,
  showApplyModeSwitch = true,
  onConfirm,
}) => {
  const { userData } = useUserData();
  const [saldo, setSaldo] = useState<number>(0);

  useEffect(() => {
    if (userData && userData.balance_in_cents) {
      setSaldo(userData.balance_in_cents);
    }
  }, [userData]);
  
  useEffect(() => {
    if (typeof balance === "number") setSaldo(balance);
  }, [balance]);

  useEffect(() => {
    if (typeof balance !== "number" && typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, String(saldo));
    }
  }, [balance, saldo]);

  // valor
  const [valor, setValor] = useState<number>(initialValue);
  const [txt, setTxt] = useState<string>(String(initialValue).replace(".", ","));
  const [isFocused, setIsFocused] = useState<boolean>(false);
  useEffect(() => setTxt(String(valor).replace(".", ",")), [valor]);

  const commitFromText = () => setValor(Math.max(0, parseLoose(txt)));
  const dec = () => setValor((v) => Math.max(0, v - 1));
  const inc = () => setValor((v) => v + 1);

  const excedeSaldo = valor > saldo;
  const canMock = typeof balance !== "number";

  // modo Todos/Cada 
  const isModeControlled = typeof applyMode === "string";
  const [innerMode, setInnerMode] = useState<ApplyMode>("todos");
  const mode = isModeControlled ? (applyMode as ApplyMode) : innerMode;

  const setMode = (m: ApplyMode) => {
    if (!isModeControlled) setInnerMode(m);
    onApplyModeChange?.(m);
  };


  

  return (
    <View style={s.wrap}>
      {/* saldo */}
      <View style={s.balanceRow}>
        <Text style={s.balanceLabel}>Saldo disponível</Text>
        <Text
          style={[
            s.balanceValue,
            { color: excedeSaldo ? (Colors as any).vermelho ?? "#ef4444" : Colors.verdeclaro },
          ]}
        >
          {fmt(Math.max(saldo, 0))}
        </Text>
      </View>

      {/* linha do valor */}
      <View style={s.inputRow}>
        <TouchableOpacity
          style={[s.stepBtn, { borderColor: Colors.bordaamarelotransparente }]}
          onPress={dec}
          activeOpacity={0.85}
        >
          <Text style={s.stepText}>−</Text>
        </TouchableOpacity>

        <View style={s.inputBox}>
          <Text style={s.currency}>R$</Text>
          <TextInput
            style={[
              s.input,
              isFocused && { 
                outlineWidth: 0, 
                outlineColor: 'transparent',
                borderWidth: 0 
              }
            ]}
            value={txt}
            onChangeText={setTxt}
            onBlur={() => {
              commitFromText();
              setIsFocused(false);
            }}
            onFocus={() => setIsFocused(true)}
            placeholder="0,00"
            placeholderTextColor={Colors.cinzaClaro}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={[s.stepBtn, { borderColor: Colors.bordaamarelotransparente }]}
          onPress={inc}
          activeOpacity={0.85}
        >
          <Text style={s.stepText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* seletor TODOS / CADA */}
      {showApplyModeSwitch && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 18,
            marginTop: 10,
            marginBottom: 6,
          }}
        >
          {/* Todos */}
          <TouchableOpacity
            onPress={() => setMode("todos")}
            activeOpacity={0.9}
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                borderWidth: 2,
                borderColor: mode === "todos" ? Colors.amareloClaro : Colors.cinzaClaro,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {mode === "todos" && (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: Colors.amareloClaro,
                  }}
                />
              )}
            </View>
            <Text style={{ color: Colors.branco, fontWeight: "800" }}>Todos</Text>
          </TouchableOpacity>

          {/* Cada */}
          <TouchableOpacity
            onPress={() => setMode("cada")}
            activeOpacity={0.9}
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                borderWidth: 2,
                borderColor: mode === "cada" ? Colors.amareloClaro : Colors.cinzaClaro,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {mode === "cada" && (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: Colors.amareloClaro,
                  }}
                />
              )}
            </View>
            <Text style={{ color: Colors.branco, fontWeight: "800" }}>Cada</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* chips rápidos */}
      <View style={s.quickRow}>
        {[1, 5, 10, 25, 50].map((q) => (
          <TouchableOpacity
            key={q}
            style={s.quickChip}
            onPress={() => setValor((v) => v + q)}
            activeOpacity={0.85}
          >
            <Text style={s.quickText}>{fmt(q)}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[s.quickChip, s.chipMax]}
          onPress={() => setValor(saldo)}
          activeOpacity={0.85}
        >
          <Text style={[s.quickText, s.quickTextStrong]}>Usar saldo</Text>
        </TouchableOpacity>

        
      </View>


      {/* confirmar */}
      {onConfirm && (
        <Pressable
          style={({ hovered }) => [
            valor <= 0 || !userData || excedeSaldo 
              ? s.confirmBtnDisabled
              : hovered 
                ? s.confirmBtnHover 
                : s.confirmBtn
          ]}
          onPress={() => onConfirm(valor)}
          disabled={valor <= 0 || !userData || excedeSaldo}
        >
          {({ hovered }) => (
            <Text style={[
              valor <= 0 || !userData || excedeSaldo 
                ? s.confirmTextDisabled
                : hovered 
                  ? s.confirmTextHover 
                  : s.confirmText
            ]}>
              Confirmar aposta
            </Text>
          )}
        </Pressable>
      )}
    </View>
  );
};

export default EscolherValorAposta;
