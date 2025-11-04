import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions, StyleSheet, ActivityIndicator, Image } from 'react-native';
import homeStyles from '@/styles/home';
import { Carrossel, FeatureCard, ApostasRecentes, AtrasadosRecentes } from '@/components/Components';
import { Colors } from "@/styles/colors";
import { Trophy } from 'lucide-react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL; 
interface ImageItem {
  image_base64: string;
  href: string;
  active: boolean;
  type: string;
  image_url: string;
}


const Home: React.FC = () => {
  const { width } = useWindowDimensions();
  const [cardImages, setCardImages] = useState<{ href: string; image_url: string }[]>([]);
  const [bannerImages, setBannerImages] = useState<{ href: string; image_url: string }[]>([]);
  const [loading, setLoading] = useState(true);
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
    const loadImages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/images/images`);
        const data = await response.json();

        const formatted: ImageItem[] = data.map((item: ImageItem) => ({
          active: item.active,
          type: item.type,
          href: item.href,
          image_url: `data:image/jpeg;base64,${item.image_base64}`,
        }));

        const cards = formatted.filter(item => item.type === "card" && item.active);
        const banners = formatted.filter(item => item.type === "banner" && item.active);


        // Pré-carrega todas as imagens
        await Promise.all([
          ...cards.map(card => Image.prefetch(card.image_url)),
          ...banners.map(banner => Image.prefetch(banner.image_url)),
        ]);

        setCardImages(cards);
        setBannerImages(banners);
      } catch (error) {
        console.error("Erro ao buscar imagens:", error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  if (loading) {
    // Mostrar um loader enquanto as imagens carregam
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.azulescuro} />
        <Text style={{ marginTop: 10, color: Colors.azulescuro }}>Carregando conteúdo...</Text>
      </View>
    );
  }

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

        {/* Resultados Atrasados */}
        <View style={[homeStyles.atrasadosContainer,{display:'flex',flexDirection:'row', gap:0}]}>    
          <View style={{width:'20%', maxWidth:60, backgroundColor:Colors.azulescuro,borderRadius:7,alignItems:'center', justifyContent:'center'}}>
            <Trophy size={40} color={Colors.branco} fill={Colors.branco}/>
            <Text style={{color:Colors.branco,fontWeight:'bold'}}>Prêmios</Text>
          </View>
          <AtrasadosRecentes dados={atrasadosData} />
        </View>

        {/* TODO: Cotações */}

        {/* TODO: Dúvidas Frequentes */}

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

export default Home;
