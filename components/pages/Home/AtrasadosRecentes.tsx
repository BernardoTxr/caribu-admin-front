import React, { useRef, useEffect } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import AtrasadoCard from '@/components/pages/Home/AtrasadoCard';

const { width } = Dimensions.get('window');

interface AtrasadosRecentesProps {
  dados: {
    grupo: string;
    animal: string;
    tempoAtrasado: string;
    dataUltimaSaida: string;
  }[];
}

const AtrasadosRecentes: React.FC<AtrasadosRecentesProps> = ({ dados }) => {
  const dataLoop = [...dados, ...dados]; 
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    let position = 0;
    const totalWidth = dataLoop.length * 180; // 180px por card o tamamho do carad
    const interval = setInterval(() => {
      position += 1; 
      if (position >= totalWidth / 2) {
        position = 0;
        scrollViewRef.current?.scrollTo({ x: 0, animated: false });
      } else {
        scrollViewRef.current?.scrollTo({ x: position, animated: false });
      }
    }, 16); 

    return () => clearInterval(interval);
  }, [dataLoop]);

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16} // 16 referente a 60fps
      style={{ flex: 1}} // ocupa 70% da tela
    >
      {dataLoop.map((item, index) => (
        <View key={index} style={{ marginHorizontal: 5 }}>
          <AtrasadoCard
            grupo={item.grupo}
            animal={item.animal}
            tempoAtrasado={item.tempoAtrasado}
            dataUltimaSaida={item.dataUltimaSaida}
            onPress={() => {}}
          />
        </View>
      ))}
    </Animated.ScrollView>
  );
};

export default AtrasadosRecentes;
