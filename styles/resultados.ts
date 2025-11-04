import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "@/styles/colors";

const Styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.azulEscuro,
    color: Colors.branco,
    padding: 10,
    borderRadius: 8,
    minHeight: 46,
    fontWeight:'bold'
  },
  text: {
    color: Colors.azulescuro,
    fontWeight: "500",
    fontSize: 20,
  },
});

export default Styles;
