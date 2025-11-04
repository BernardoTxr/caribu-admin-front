import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Colors } from "@/styles/colors";

type Bet = {
  id: string;
  state: string;
  created_at: string;
  number: string;
  amount_in_cents: number;
  banca: string;
  data: Date;
  category: string;
  sorteio: number;
};

type BetTableProps = {
  bets: Bet[];
};

const BetTable: React.FC<BetTableProps> = ({ bets }) => {
  return (
    <ScrollView style={{flex:1}} horizontal>
      <View style={styles.table}>
        {/* Cabeçalho */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell]}>Banca</Text>
          <Text style={[styles.cell, styles.headerCell]}>Valor</Text>
          <Text style={[styles.cell, styles.headerCell]}>Número</Text>
          <Text style={[styles.cell, styles.headerCell]}>Data Aposta</Text>
          <Text style={[styles.cell, styles.headerCell]}>Data Sorteio</Text>
          <Text style={[styles.cell, styles.headerCell]}>Categoria</Text>
          <Text style={[styles.cell, styles.headerCell]}>Sorteio</Text>
          <Text style={[styles.cell, styles.headerCell]}>Status</Text>
        </View>

        {/* Linhas de dados */}
        {bets.map((bet) => (
          <View key={bet.id} style={styles.row}>
            <Text style={styles.cell}>{bet.banca}</Text>
            <Text style={styles.cell}>R$ {(bet.amount_in_cents / 100).toFixed(2)}</Text>
            <Text style={styles.cell}>{bet.number}</Text>
            <Text style={styles.cell}>{new Date(bet.created_at).toLocaleDateString()}</Text>
            <Text style={styles.cell}>{new Date(bet.data).toLocaleDateString()}</Text>
            <Text style={styles.cell}>{bet.category}</Text>
            <Text style={styles.cell}>{bet.sorteio}</Text>
            <Text style={styles.cell}>{bet.state}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: Colors.cinzaClaro,
    borderRadius: 8,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.cinzaClaro,
  },
  headerRow: {
    backgroundColor: Colors.azulescuro,
    color: Colors.cinzaClaro,
    fontWeight: "700",
  },
  cell: {
    padding: 8,
    minWidth: 100,
    textAlign: "center",
    color: Colors.azulescuro,
  },
  headerCell: {
    color: Colors.cinzaClaro,
    fontWeight: "700",
  },
});

export default BetTable;
