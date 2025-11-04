import React, { useRef, useEffect, useState } from "react";
import { View, Text, Animated } from "react-native";
import { Colors } from "@/styles/colors";

type Aposta = {
  id: string;
  loteria: string;
  jogo: string;
  palpite: string;
  valor: string;
};

export default function ApostasRecentes() {
  const rowHeight = 50;
  const visibleRows = 4;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [zebraParity, setZebraParity] = useState(0);

  const [apostas, setApostas] = useState<Aposta[]>([
    { id: "a1", loteria: "Lotece",  jogo: "Grupo 4",  palpite: "1234", valor: "R$ 10,00" },
    { id: "a2", loteria: "Federal", jogo: "Grupo 7",  palpite: "5678", valor: "R$ 25,00" },
    { id: "a3", loteria: "Federal", jogo: "Grupo 25", palpite: "9012", valor: "R$ 15,00" },
    { id: "a4", loteria: "Federal", jogo: "Grupo 6",  palpite: "3456", valor: "R$ 20,00" },
    { id: "a5", loteria: "Federal", jogo: "Grupo 10", palpite: "8888", valor: "R$ 30,00" },
  ]);

  const indexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(scrollY, {
        toValue: -rowHeight,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        scrollY.setValue(0);
        setApostas((prev) => {
          const novaAposta: Aposta = {
            id: `${Date.now()}-${Math.random()}`,
            loteria: "Federal",
            jogo: `Grupo ${(indexRef.current % 25) + 1}`,
            palpite: String(Math.floor(1000 + Math.random() * 9000)),
            valor: `R$ ${(10 + Math.floor(Math.random() * 50)).toFixed(2)}`,
          };
          indexRef.current += 1;
          return [...prev.slice(1), novaAposta];
        });
        setZebraParity((p) => (p === 0 ? 1 : 0));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View>
      {/* Cabeçalho */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: Colors.azulescuro,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderWidth: 1,
          borderColor: Colors.bordaamarelotransparente,
        }}
      >
        <Text style={headerStyle}>Loteria</Text>
        <Text style={headerStyle}>Jogo</Text>
        <Text style={headerStyle}>Palpite</Text>
        <Text style={headerStyle}>Valor</Text>
        <Text style={headerStyle}>Concluído</Text>
      </View>

      {/* Lista animada */}
      <View
        style={{
          overflow: "hidden",
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderColor: Colors.bordaamarelotransparente,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          height: rowHeight * visibleRows,
        }}
      >
        <Animated.View style={{ transform: [{ translateY: scrollY }] }}>
          {apostas.map((aposta, index) => {
            const isLight =
              ((zebraParity + index) % 2) === 0; // zebra estável
            return (
              <View
                key={aposta.id}
                style={{
                  flexDirection: "row",
                  backgroundColor: isLight
                    ? 'rgba(30,58,138,0.3)'
                    : 'rgba(255, 255, 255, 0.1)',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  height: rowHeight,
                }}
              >
                <Text style={cellStyle}>{aposta.loteria}</Text>
                <Text style={cellStyle}>{aposta.jogo}</Text>
                <Text style={cellStyle}>{aposta.palpite}</Text>
                <Text style={cellStyle}>{aposta.valor}</Text>
                <Text
                  style={{
                    flex: 1,
                    color: Colors.azulEscuro,
                    textAlign: "center",
                  }}
                >
                  Há {index * 3} segundos
                </Text>
              </View>
            );
          })}
        </Animated.View>
      </View>
    </View>
  );
}

const headerStyle = {
  flex: 1,
  fontWeight: "bold" as const,
  color: Colors.branco,
  textAlign: "center" as const,
};

const cellStyle = {
  flex: 1,
  color: Colors.azulEscuro,
  textAlign: "center" as const,
};
