import { Platform, StyleSheet } from "react-native";
import { Colors } from "@/styles/colors";

const mainStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cinzaMuitoClaro,
    flexDirection: "column",
    flex: 1,                // ocupa a tela no iOS/Android
    // no web vamos complementar com minHeight dinamicamente (ver Main.tsx)
    width: "100%",
  },
  topBar: {
    width: "100%",
    height: 64,
    backgroundColor: Colors.azulEscuro,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  logo: { width: 40, height: 40 },
});

export default mainStyles;
