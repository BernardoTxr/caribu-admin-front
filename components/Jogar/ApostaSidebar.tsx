import React, { useState } from "react";
import { View, Text } from "react-native";
import EscolherValorAposta from "@/components/Jogar/EscolherValorAposta";
import apostaSidebar from "@/styles/apostaSidebar";

type Numbers = {
  milhar?: string;
  centena?: string;
  dezena?: string;
  dezenas?: string[];
};

type ModoValor = "todos" | "cada";

type Props = {
  saldo: number | null;

  applyMode: ModoValor;                 
  setApplyMode: (m: ModoValor) => void;  

  // seleção de grupos
  gruposSelecionados: number[];
  maxGrupos?: number;
  requiredGroups?: number; // 2/3/4/5 p/ Dupla/Terno/Quadra/Quina de Grupo

  // categoria/números
  categoria?: string; // "Grupo", "Dupla de Grupo", "Milhar", etc
  numbers?: Numbers;

  // opcional para forçar
  isGroupBet?: boolean;

  banca?: string;
  data?: string;
  horario?: string;

  onConfirm: (payload: {
    valor: number;
    grupos: number[];
    banca?: string;
    data?: string;
    horario?: string;
    modoValor?: ModoValor; // novo: "todos" | "cada"
  }) => void;
};

const fmtDateBR = (d?: Date) => {
  if (!d) return "-";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// normaliza e checa "grupo"
const hasGrupoWord = (s?: string) =>
  !!String(s ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .includes("grupo");

const ApostaSidebar: React.FC<Props> = ({
  saldo,
  gruposSelecionados,
  maxGrupos = 10,
  requiredGroups,
  categoria,
  numbers,
  isGroupBet,
  banca,
  data,
  horario,
  applyMode,
  setApplyMode,
  onConfirm,
}) => {
  //const [applyMode, setApplyMode] = useState<ModoValor>("todos");

  // --- detecção robusta do tipo de aposta ---
  const isGroup =
    typeof isGroupBet === "boolean"
      ? isGroupBet
      : typeof requiredGroups === "number"
      ? true
      : gruposSelecionados.length > 0
      ? true
      : hasGrupoWord(categoria);

  const groupOk = !isGroup
    ? true
    : typeof requiredGroups === "number"
    ? gruposSelecionados.length === requiredGroups
    : gruposSelecionados.length > 0;

  const gruposOrdered = [...gruposSelecionados].sort((a, b) => a - b);

  const middleTitle = isGroup
    ? `Grupos selecionados (${gruposSelecionados.length}/${requiredGroups ?? maxGrupos})`
    : "Número selecionado";

  const handleConfirm = (valor: number) => {
    onConfirm({
      valor,
      grupos: gruposSelecionados,
      banca,
      data,
      modoValor: applyMode, // "todos" | "cada"
    });
  };

  return (
    <View style={apostaSidebar.wrap}>
      <Text style={apostaSidebar.title}>Sua aposta</Text>

      {/* card com banca/data e selecionados */}
      <View style={apostaSidebar.card}>
        <View style={apostaSidebar.row}>
          <Text style={apostaSidebar.label}>Banca</Text>
          <Text style={apostaSidebar.value}>{banca || "-"}</Text>
        </View>

        <View style={apostaSidebar.row}>
          <Text style={apostaSidebar.label}>Data</Text>
          <Text style={apostaSidebar.value}>{data}</Text>
        </View>

        <View style={apostaSidebar.row}>
          <Text style={apostaSidebar.label}>Horário</Text>
          <Text style={apostaSidebar.value}>{horario}</Text>
        </View>

        <View style={{ height: 10 }} />

        <Text style={apostaSidebar.label}>{middleTitle}</Text>

        {isGroup ? (
          <View style={apostaSidebar.tagsWrap}>
            {gruposSelecionados.length === 0 ? (
              <Text style={apostaSidebar.hint}>
                {typeof requiredGroups === "number"
                  ? `Selecione exatamente ${requiredGroups} grupo(s)`
                  : "Selecione pelo menos 1 grupo"}
              </Text>
            ) : (
              gruposOrdered.map((g) => (
                <View key={g} style={apostaSidebar.tag}>
                  <Text style={apostaSidebar.tagText}>
                    G{String(g).padStart(2, "0")}
                  </Text>
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={{ gap: 6, marginTop: 6 }}>
            {!numbers?.milhar &&
            !numbers?.centena &&
            !numbers?.dezena &&
            !(numbers?.dezenas?.length) ? (
              <Text style={apostaSidebar.hint}>
                Informe os números da aposta
              </Text>
            ) : (
              <>
                {numbers?.milhar ? (
                  <Text style={apostaSidebar.value}>
                    Milhar: {numbers.milhar}
                  </Text>
                ) : null}
                {numbers?.centena ? (
                  <Text style={apostaSidebar.value}>
                    Centena: {numbers.centena}
                  </Text>
                ) : null}
                {numbers?.dezena ? (
                  <Text style={apostaSidebar.value}>
                    Dezena: {numbers.dezena}
                  </Text>
                ) : null}
                {numbers?.dezenas && numbers.dezenas.length > 0 ? (
                  <Text style={apostaSidebar.value}>
                    Dezenas: {numbers.dezenas.filter(Boolean).join(", ")}
                  </Text>
                ) : null}
              </>
            )}
          </View>
        )}
      </View>

      <View style={{ height: 12 }} />

      {/* componente de valor com seletor TODOS/CADA */}
      <EscolherValorAposta
        balance={saldo}
        initialValue={5}
        applyMode={applyMode}
        onApplyModeChange={(mode) => {
          setApplyMode(mode ? mode : "todos");
          console.log(mode);
        }}
        showApplyModeSwitch={true}
        onConfirm={handleConfirm}
      />

      {!groupOk && isGroup && (
        <Text style={apostaSidebar.helper}>
          Dica: selecione{" "}
          {typeof requiredGroups === "number"
            ? `exatamente ${requiredGroups}`
            : "pelo menos 1"}{" "}
          grupo para confirmar.
        </Text>
      )}
    </View>
  );
};

export default ApostaSidebar;
