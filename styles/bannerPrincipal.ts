import { StyleSheet } from 'react-native';
import { Colors } from '@/styles/colors';

const bannerPrincipal = StyleSheet.create({
  bannerContainer: {
    height: '100%',
    width: '100%',
    borderRadius: 11,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 138, 0.8)', // essa cor so eh usada aqui
  },
  bannerContent: {
    padding: 20,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.amarelo,
    textAlign: 'center',
    marginBottom: 10,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: Colors.azulClaro,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default bannerPrincipal;
