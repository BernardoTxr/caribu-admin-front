import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity,useWindowDimensions,StyleSheet } from 'react-native';
import homeStyles from '@/styles/home';
import { Carrossel, FeatureCard, ApostasRecentes } from '@/components/Components';
import { Colors } from "@/styles/colors";
import { useContent } from '@/components/contexts/ContentContext';
import Resultados from '@/components/pages/Resultados';
import AtrasadosRecentes from '@/components/AtrasadosRecentes';
import { Trophy } from 'lucide-react-native';
import Collapsible from 'react-native-collapsible';


const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL; 


const Home: React.FC = () => {

  const { width } = useWindowDimensions();
  const [cardImages, setCardImages] = useState<{ href: string; image_url: string }[]>([]);
  const [bannerImages, setBannerImages] = useState<{ href: string; image_url: string }[]>([]);
  const [cotacoes, setCotacoes] = useState<{ nome: string; valor: string }[]>([]);
  const isMobile = width < 768;
  const atrasadosData = [
    { grupo: '4',  animal: 'Borboleta',  tempoAtrasado: 'Há 180 dias', dataUltimaSaida: '02/02 às 08:00' },
    { grupo: '7',  animal: 'Carneiro',   tempoAtrasado: 'Há 175 dias', dataUltimaSaida: '05/02 às 14:00' },
    { grupo: '25', animal: 'Vaca',       tempoAtrasado: 'Há 170 dias', dataUltimaSaida: '10/02 às 18:00' },
    { grupo: '6',  animal: 'Cabra',      tempoAtrasado: 'Há 160 dias', dataUltimaSaida: '15/02 às 10:00' },
    { grupo: '3',  animal: 'Burro',      tempoAtrasado: 'Há 150 dias', dataUltimaSaida: '20/02 às 20:00' },
    { grupo: '21', animal: 'Touro',      tempoAtrasado: 'Há 140 dias', dataUltimaSaida: '25/02 às 09:00' },
  ];

  useEffect(() => {
    fetch(`${API_BASE_URL}/images/images`)
      .then((response) => response.json())
      .then((data: { image_base64: string; href: string; active: boolean; type: string }[]) => {
        const formatted = data.map((item) => ({
          active: item.active,
          type: item.type,
          href: item.href,
          image_url: `data:image/jpeg;base64,${item.image_base64}`,
        }));

        const cards = formatted.filter((item) => item.type === "card" && item.active);
        const banners = formatted.filter((item) => item.type === "banner" && item.active);

        setBannerImages(banners);
        setCardImages(cards);
      })
      .catch((error) => {
        console.error("Erro ao buscar imagens:", error);
      });
  }, []);

  

  return (
    <ScrollView style={homeStyles.container}>
      <View style={homeStyles.subContainer}>
        
        {/* Banner Principal */}
        <Carrossel items={bannerImages} />

        {/* Destaques */}
        <View style={homeStyles.cardsContainer}>
          {cardImages.map((feature, index) => (
            <FeatureCard key={index} href={feature.href} image={feature.image_url} />
          ))}
        </View>

        {/* Resultados Atrasados
              TODO: Passar estilos para styles
        */}
        <View style={[homeStyles.atrasadosContainer,{display:'flex',flexDirection:'row', gap:0}]}>    
          <View style={{width:'20%', maxWidth:60, backgroundColor:Colors.azulescuro,borderRadius:7,alignItems:'center', justifyContent:'center'}}>
            <Trophy size={40} color={Colors.branco} fill={Colors.branco}/>
            <Text style={{color:Colors.branco,fontWeight:'bold'}}>Prêmios</Text>
          </View>
          <AtrasadosRecentes dados={atrasadosData} />
        </View>

        {/* TODO: Cotações*/}
        {/*<View style={[homeStyles.atrasadosContainer,{display:'flex',flexDirection:'column', gap:0}]}>  
          <View style={{display:'flex',flexDirection:'row',alignItems:'center', justifyContent:'space-between',marginBottom:15}}>
            <Text style={isMobile ? {}:{fontSize:24,fontWeight:'bold',color:Colors.azulescuro}}>A Maior Cotação do Mercado</Text>
            <TouchableOpacity style={[homeStyles.verTodosButton,{borderColor:Colors.azulescuro,backgroundColor:'rgba(59, 130, 246, 0.2)'}]}> 
              <Text style={[homeStyles.verTodosText,{color:Colors.azulescuro}]}>Ver todas cotações</Text>
            </TouchableOpacity>
          </View>

          <View>


          </View>
        </View>*/}



        {/*TODO: Dúvidas Frequentes*/}

        
        {/* Apostas Recentes */}
        <View style={homeStyles.atrasadosContainer}>
          <View style={[homeStyles.atrasadosHeader,{marginBottom:15}]}>
            <Text style={[homeStyles.sectionTitle,{color:Colors.azulescuro}]}>Apostas Recentes</Text>
            <TouchableOpacity style={[homeStyles.verTodosButton,{borderColor:Colors.azulescuro,backgroundColor:'rgba(59, 130, 246, 0.2)'}]}> 
              <Text style={[homeStyles.verTodosText,{color:Colors.azulescuro}]}>Ao vivo</Text>
            </TouchableOpacity>
          </View>
          <ApostasRecentes />
        </View>

      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  question: {
    padding: 10,
    backgroundColor: '#a0c4ff', // exemplo de cor
    borderRadius: 5,
    fontWeight: 'bold',
  },
  answerContainer: {
    padding: 10,
    backgroundColor: '#caf0f8',
    borderRadius: 5,
    marginTop: 5,
  },
  answer: {
    fontSize: 14,
    color: '#03045e',
  },
});

export default Home;
