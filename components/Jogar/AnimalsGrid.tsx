import React, { useMemo, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import type { ViewStyle } from "react-native";
import AnimalCard, { AnimalItem } from "@/components/Jogar/AnimalCard";
import { Colors } from "@/styles/colors";

type Props = {
  items?: AnimalItem[];
  maxSelect?: number;
  onSelectionChange?: (groups: number[]) => void;
  columns?: number;
};

const DEFAULT: AnimalItem[] = [
  { group: 1, name: "Avestruz" }, { group: 2, name: "Águia" },
  { group: 3, name: "Burro" },    { group: 4, name: "Borboleta" },
  { group: 5, name: "Cachorro" }, { group: 6, name: "Cabra" },
  { group: 7, name: "Carneiro" }, { group: 8, name: "Camelo" },
  { group: 9, name: "Cobra" },    { group:10, name: "Coelho" },
  { group:11, name: "Cavalo" },   { group:12, name: "Elefante" },
  { group:13, name: "Galo" },     { group:14, name: "Gato" },
  { group:15, name: "Jacaré" },   { group:16, name: "Leão" },
];

const AnimalsGrid: React.FC<Props> = ({
  items,
  maxSelect = 10,
  onSelectionChange,
  columns = 5,
}) => {
  const data = useMemo(() => (items?.length ? items : DEFAULT), [items]);
  const [selected, setSelected] = useState<number[]>([]);

  const slotWidth: ViewStyle["width"] = `${(100 / columns) - 1.5}%`;

  const toggleSelect = useCallback((g: number) => {
    setSelected((curr) => {
      const exists = curr.includes(g);
      const next = exists
        ? curr.filter((x) => x !== g)
        : (curr.length < maxSelect ? [...curr, g] : curr);
      if (next !== curr) onSelectionChange?.(next);
      return next;
    });
  }, [maxSelect, onSelectionChange]);

  return (
    <View style={sg.container}>
      <Text style={sg.title}>Escolha até {maxSelect} grupos:</Text>

      {/* lista ÚNICA, sem animação, sem toggle */}
      <FlatList
        data={data}
        key={columns}
        numColumns={columns}
        keyExtractor={(item) => String(item.group)}
        contentContainerStyle={sg.listContent}
        columnWrapperStyle={sg.columnWrap}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={[sg.itemWrap, { width: slotWidth }]}>
            <AnimalCard
              {...item}
              selected={selected.includes(item.group)}
              onPress={toggleSelect}
            />
          </View>
        )}
      />
    </View>
  );
};

const sg = StyleSheet.create({
  container: { width: "100%", paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  title: { fontSize: 16, fontWeight: "700", color: Colors.branco, marginBottom: 12 },
  listContent: { paddingBottom: 8 },
  columnWrap: { justifyContent: "space-between", marginBottom: 10 },
  itemWrap: { marginHorizontal: 2, marginBottom: 10 },
});

export default AnimalsGrid;
