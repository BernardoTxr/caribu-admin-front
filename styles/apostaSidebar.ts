import { StyleSheet } from "react-native";
import { Colors } from "@/styles/colors";

export default StyleSheet.create({
  wrap: {
    width: 340, // largura fixa da sidebar
    padding: 16,
    borderLeftWidth: 1,
    borderLeftColor: Colors.bordaamarelotransparente,
    backgroundColor: Colors.azulescuro,
    gap: 8,
  },
  title: {
    color: Colors.branco,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.bordaamarelotransparente,
    borderRadius: 12,
    padding: 12,
    backgroundColor: Colors.azulclarotransparente,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    color: Colors.cinzaClaro,
    fontWeight: "700",
    fontSize: 12,
  },
  value: {
    color: Colors.branco,
    fontWeight: "800",
    fontSize: 12,
  },
  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.bordaamarelotransparente,
    backgroundColor: Colors.azulescuro,
  },
  tagText: {
    color: Colors.branco,
    fontWeight: "800",
    fontSize: 12,
  },
  hint: {
    color: Colors.cinzaClaro,
    fontSize: 12,
  },
  helper: {
    color: Colors.amarelo,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 8,
  },
});
