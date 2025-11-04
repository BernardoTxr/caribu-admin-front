import React, { memo } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import s from "@/styles/animalCard"; 

// Define a estrutura base de um "animal" que pode ser exibido
export type AnimalItem = {
  group: number;          // numero do grupo (1..25)
  name: string;           // nome do animal
  numbers?: number[];     // 4 dezenas associadas ao grupo (opcional)
  image?: any;            // imagem opcional do animal
};

// As props do card sao os campos do AnimalItem + estados/comportamentos do card
type Props = AnimalItem & {
  selected?: boolean;                // se o card esta selecionado (p/ estilizar)
  onPress?: (group: number) => void; // callback quando o card e tocado
};

// Utilitario: transforma 7 -> "07", 23 -> "23"
const pad2 = (n: number) => String(n).padStart(2, "0");

// Utilitario: calcula as 4 dezenas padrao de um grupo
// Formula: a cada grupo, soma 4. Ex.: g=1 -> [1..4], g=2 -> [5..8], ...
const groupNumbers = (g: number) => {
  const start = (g - 1) * 4 + 1; // inicio do intervalo para o grupo g
  return [start, start + 1, start + 2, start + 3];
};

// Componente visual do card
const AnimalCard: React.FC<Props> = ({ group, name, numbers, image, selected, onPress }) => {
  // usa as dezenas passadas via props ou calcula as padrao
  const nums = numbers?.length === 4 ? numbers : groupNumbers(group);

  // Primeira letra do nome em maiuscula, usada no fallback quando nao ha imagem
  const letter = name?.[0]?.toUpperCase() ?? "A";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress?.(group)}              // dispara o callback com o numero do grupo
      style={[s.card, selected && s.cardSelected]}  // aplica estilo "selecionado" 
    >
      {/* Faixa superior: badge com numero do grupo + coluna com as 4 dezenas */}
      <View style={s.topOverlay}>
        <View style={s.badge}>
          <Text style={s.badgeText}>{pad2(group)}</Text> {/* exibe "01", "02", ... */}
        </View>

        <View style={s.numbersCol}>
          {nums.map((n) => (
            <Text key={n} style={s.numberText}>{pad2(n)}</Text> // lista "01", "02", "03", "04" etc.
          ))}
        </View>
      </View>

      {/* Area central: mostra a imagem se existir; senao, um circulo com a inicial */}
      <View style={s.centerArea}>
        {image ? (
          <Image source={image} style={s.image} resizeMode="contain" />
        ) : (
          <View style={s.fallbackCircle}>
            <Text style={s.fallbackLetter}>{letter}</Text>
          </View>
        )}
      </View>

      {/* Nome do animal (uma linha so, com corte se for muito longo) */}
      <Text numberOfLines={1} style={s.name}>{name}</Text>
    </TouchableOpacity>
  );
};

// memoriza o componente pra evitar re-render desnecessario
export default memo(AnimalCard);
