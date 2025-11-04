import { StyleSheet } from "react-native";
import { Colors } from "@/styles/colors";

export default StyleSheet.create({
  card: {
    height: 128,                // ↓ um pouco mais fino
    borderRadius: 14,
    backgroundColor: Colors.azulescuro,
    borderWidth: 1,
    borderColor: Colors.bordaamarelotransparente,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cardSelected: {
    backgroundColor: Colors.amarelotransparente,
    borderColor: Colors.amarelo,
  },

  topOverlay: {
    position: "absolute",
    top: 6,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  badge: {
    backgroundColor: "rgba(250,204,21,0.12)",
    borderWidth: 1,
    borderColor: Colors.amarelo,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  badgeText: {
    color: Colors.amarelo,
    fontSize: 10,
    fontWeight: "800",
  },

  numbersCol: { alignItems: "flex-end" },
  numberText: {
    fontSize: 10,
    color: Colors.cinzaClaro,
    fontWeight: "600",
    lineHeight: 12,
  },

  centerArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: "70%", height: 48 },   // ↓

  fallbackCircle: {
    width: 50,                 // ↓
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.amarelo,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.amarelo,
  },
  fallbackLetter: {
    color: Colors.branco,
    fontSize: 20,              // ↓
    fontWeight: "900",
  },

  name: {
    textAlign: "center",
    color: Colors.amarelo,
    fontSize: 12,              // ↓
    fontWeight: "800",
    marginTop: 4,              // ↓
  },
});
