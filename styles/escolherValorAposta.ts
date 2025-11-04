import { StyleSheet } from "react-native";
import { Colors } from "@/styles/colors";

export default StyleSheet.create({
  wrap: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.bordaamarelotransparente,
    borderRadius: 12,
    backgroundColor: Colors.azulclarotransparente,
  },

  // saldo
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  balanceLabel: {
    color: Colors.cinzaClaro,
    fontSize: 12,
    fontWeight: "600",
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: "800",
  },

  // input + step
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: Colors.azulescuro,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    color: Colors.amarelo,
    fontSize: 20,
    fontWeight: "900",
  },
  inputBox: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.bordaamarelotransparente,
    backgroundColor: Colors.azulescuro,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    overflowX:'hidden'
  },
  currency: {
    color: Colors.cinzaClaro,
    fontWeight: "800",
    marginRight: 6,
  },
  input: {
    flex: 1,
    color: Colors.branco,
    fontSize: 16,
    fontWeight: "800",
    outline: "none"

  },

  // chips
  quickRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  quickChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.bordaamarelotransparente,
    backgroundColor: Colors.azulescuro,
  },
  quickText: {
    color: Colors.branco,
    fontWeight: "700",
    fontSize: 12,
  },
  quickTextStrong: {
    color: Colors.amarelo,
  },
  chipMax: {
    borderColor: Colors.amarelo,
    backgroundColor: Colors.amarelotransparente,
  },
  chipClear: {
    backgroundColor: "transparent",
  },
  quickTextClear: {
    color: Colors.cinzaClaro,
  },

  // MOCK: controles de saldo
  mockRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  mockBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.bordaamarelotransparente,
    backgroundColor: Colors.azulescuro,
  },
  mockBtnClear: {
    backgroundColor: "transparent",
  },
  mockText: {
    color: Colors.branco,
    fontWeight: "800",
    fontSize: 12,
  },
  mockTextClear: {
    color: Colors.cinzaClaro,
  },

  // helper
  helperWarn: {
    color: Colors.amarelo,
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
  },

  // confirmar
  confirmBtn: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.amarelo,
    backgroundColor: Colors.amarelotransparente,
    alignItems: "center",
  },
  confirmBtnDisabled: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.cinzaClaro,
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    alignItems: "center",
  },
  confirmBtnHover: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.amarelo,
    backgroundColor: Colors.amarelotransparente,
    alignItems: "center",
  },
  confirmText: {
    color: Colors.amarelo,
    fontWeight: "900",
  },
  confirmTextDisabled: {
    color: Colors.cinzaClaro,
    fontWeight: "900",
  },
  confirmTextHover: {
    color: Colors.amarelo,
    fontWeight: "900",
  },
});
