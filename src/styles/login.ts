import { StyleSheet, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const logoSize = screenWidth > 400 ? screenWidth * 0.10 : 150;
const formWidth = screenWidth > 400 ? "20%" : "80%";

const loginStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1e3a8a',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: logoSize,
    height: logoSize,
    marginBottom: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  formContainer: {
    width: formWidth,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
  },
  label: {
    color: '#fff',
    fontWeight: '500',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderWidth: 0,
    borderColor: 'transparent',
    color: '#fff',
    minWidth: 0,
  },
  icon: {
    marginRight: 8,
  },
  eyeIcon: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#facc15',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#1e3a8a',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  forgotText: {
    color: '#a0c4ff',
  },
  registerButton: {
    borderWidth: 2,
    borderColor: '#facc15',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    width: formWidth,
    marginBottom: 16,
  },
  registerText: {
    color: '#facc15',
    fontWeight: 'bold',
    fontSize: 16,
  },
  terms: {
    textAlign: 'center',
    color: '#a0c4ff',
    fontSize: 12,
  },
  termsHighlight: {
    color: '#facc15',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e3a8a',
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#a0c4ff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#1e3a8a',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalCancelButton: {
    backgroundColor: '#aaa',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default loginStyles;
