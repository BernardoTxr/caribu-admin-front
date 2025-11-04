import { StyleSheet } from 'react-native';
import { Colors } from '@/styles/colors';

const featureCards = StyleSheet.create({
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  featureCard: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: Colors.azulclarotransparente,
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.bordaamarelotransparente,
  },
  featureCardImage: {
    width: '80%',
    height: '60%',
    marginBottom: 10,
  },
  featureCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.amarelo,
    textAlign: 'center',
  },
});

export default featureCards;
