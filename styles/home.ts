import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const homeStyles = StyleSheet.create({
  //Página
  container: {
    flex: 1,
    backgroundColor: '#ffffff', 
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  subContainer: {

  },

  //Carrossel
  carroselContainer: {
    width: '100%',
    height: 250,
    borderRadius: 15,
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
    backgroundColor: 'white',
  },

  //banner priqncipal
  bannerContainer: {
    height:'100%',
    width: '100%',
    borderRadius: 11,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 138, 0.8)',
  },
  bannerContent: {
    padding: 20,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#facc15', 
    textAlign: 'center',
    marginBottom: 10,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#a0c4ff', 
    textAlign: 'center',
    marginBottom: 20,
  },
  

  sectionTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  },

//Cards de feature
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 30,
  },
  featureCard: {
    width: '48%', 
    aspectRatio: 1, 
    borderRadius: 15,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },


  atrasadosContainer: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21)',
    marginBottom: 30,
  },

  atrasadosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },

  verTodosButton: {
    backgroundColor: 'rgba(250, 204, 21, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#facc15',
  },
  verTodosText: {
    color: '#facc15',
    fontSize: 12,
    fontWeight: 'bold',
  },
  atrasadosScroll: {
    paddingLeft: 20,
  },
  atrasadoCard: {
    width: 200,
    borderRadius: 12,
    padding: 15,
    marginRight: 0,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.3)',
  },
  atrasadoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  atrasadoGrupo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#facc15',
  },
  atrasadoTempo: {
    fontSize: 12,
    color: '#a0c4ff',
  },
  atrasadoAnimal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#facc15',
    marginBottom: 5,
  },
  atrasadoData: {
    fontSize: 11,
    color: '#a0c4ff',
    fontStyle: 'italic',
  },

  
});

export default homeStyles;
