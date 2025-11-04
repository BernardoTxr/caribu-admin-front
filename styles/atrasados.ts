import { StyleSheet } from 'react-native';
import { Colors } from '@/styles/colors';

const atrasados = StyleSheet.create({
  atrasadosContainer: {
    marginBottom: 30,
  },
  atrasadosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  verTodosButton: {
    backgroundColor: Colors.amarelotransparente,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.amarelo,
  },
  verTodosText: {
    color: Colors.amarelo,
    fontSize: 12,
    fontWeight: 'bold',
  },
  atrasadosScroll: {
    paddingLeft: 20,
  },
  atrasadoCard: {
    width: 200,
    backgroundColor: Colors.azulclarotransparente,
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    borderWidth: 1,
    borderColor: Colors.bordaamarelotransparente,
  },
  atrasadoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  atrasadoGrupo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.amarelo,
  },
  atrasadoTempo: {
    fontSize: 12,
    color: Colors.azulClaro,
  },
  atrasadoAnimal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: `#facc15`,
    marginBottom: 5,
  },
  atrasadoData: {
    fontSize: 11,
    color: Colors.azulClaro,
    fontStyle: 'italic',
  },
});

export default atrasados;
