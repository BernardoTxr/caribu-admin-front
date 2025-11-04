import { StyleSheet } from "react-native";
import { Colors } from "@/styles/colors";

export default StyleSheet.create({
  wrap: {
    width: "100%",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: Colors.azulEscuro,          // ✅ use a chave que existe no seu Colors
    borderTopWidth: 1,
    borderTopColor: Colors.bordaamarelotransparente,
    flexShrink: 0,                                // ✅ não deixa o footer ocupar o miolo
    alignItems: "center",
    justifyContent: "center",
  },

  // grid 4 colunas no web (empilha no mobile)
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",                     // alinha ao topo
    textAlign: "center",                             // alinha o texto à esquerda
  },
  col: {
    paddingRight: 16,
    marginBottom: 16,                             // substitui 'gap'
  },

  // marca
  brandRow: { flexDirection: "row", alignItems: "center" },
  brandLogo: { width: 28, height: 28, borderRadius: 6, marginRight: 8 },
  brandName: { color: Colors.branco, fontWeight: "900", fontSize: 18, letterSpacing: 0.5 },
  brandDesc: { color: Colors.branco, opacity: 0.85, lineHeight: 20, marginTop: 8 },

  // redes
  socialRow: { flexDirection: "row", marginTop: 10 },
  socialBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(147, 197, 253, 0.12)",
    borderWidth: 1, borderColor: Colors.bordaamarelotransparente,
    marginRight: 12,                              // substitui 'gap'
  },
  socialIcon: { width: 20, height: 20, resizeMode: "contain", color: Colors.branco },

  // links
  colTitle: { color: Colors.branco, fontWeight: "900", letterSpacing: 1, marginBottom: 6 },
  link: { color: Colors.branco, opacity: 0.9, marginVertical: 4 },

  // responsabilidade
  respWrap: { marginTop: 8 },
  respText: { color: Colors.branco, lineHeight: 22, opacity: 0.95 },
  badge18: {
    alignSelf: "center",
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "#44515c",
    borderWidth: 1, borderColor: Colors.bordaamarelotransparente,
    alignItems: "center", justifyContent: "center",
    marginVertical: 12,
  },
  badge18Text: { color: Colors.branco, fontWeight: "900" },
  aboutText: { color: Colors.branco, opacity: 0.9, lineHeight: 22 },

  // divisor + direitos
  hr: { height: 1, backgroundColor: Colors.bordaamarelotransparente, marginTop: 12, opacity: 0.4 },
  copy: { color: Colors.branco, opacity: 0.85, textAlign: "center", marginTop: 10 },
});
