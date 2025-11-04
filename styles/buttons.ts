import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
  ButtonPrimary: {
    fontFamily: 'Segoe UI',
    fontWeight: 'bold',
    color: '#fde047', // amareloClaro
    padding: 10,
    borderColor: '#fde047',
    borderWidth: 1,
    borderRadius: 8,
  },
  ButtonPrimaryHover: {
    fontFamily: 'Segoe UI',
    fontWeight: 'bold',
    color: '#fef9c3', // amareloMuitoClaro
    padding: 10,
    borderColor: '#fef9c3',
    backgroundColor: 'rgba(254, 249, 195, 0.1)', // amareloMuitoClaroTransparente
    borderWidth: 1,
    borderRadius: 8,
  },
  ButtonSecundary: {
    fontFamily: 'Segoe UI',
    fontWeight: 'bold',
    backgroundColor: '#fde047', // amareloClaro
    color: '#1e3a8a', // azulEscuro
    padding: 10,
    borderColor: '#fde047',
    borderWidth: 1,
    borderRadius: 8,
  },
  ButtonSecundaryHover: {
    fontFamily: 'Segoe UI',
    fontWeight: 'bold',
    backgroundColor: '#facc15', 
    color: '#3b5998', 
    padding: 10,
    borderColor: '#facc15',
    borderWidth: 1,
    borderRadius: 8,
  },
});

export default Styles;
