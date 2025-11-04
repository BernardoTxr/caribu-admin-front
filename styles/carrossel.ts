import { StyleSheet } from 'react-native';
import { Colors } from '@/styles/colors';

const carrossel = StyleSheet.create({
  carroselContainer: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    borderWidth: 4,
    borderColor: Colors.amarelo,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  carroselPagination: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: '10%',
  },
  carroselPaginationDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  carroselPaginationDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.branco,
  },
});

export default carrossel;
