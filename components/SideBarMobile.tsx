import React, { useState,useEffect,useRef } from 'react';
import { View, Text, Pressable,Dimensions, Animated } from 'react-native';
import { useContent } from '@/components/contexts/ContentContext';
import { Resultados,Jogar,Home} from '@/components/Components';
import { Target, Dice6, House, User } from 'lucide-react-native';
import MinhasApostas from './pages/MinhasApostas';
import {Colors} from '@/styles/colors';

const screenWidth = Dimensions.get('window').width;


const SideBarMenuItem = ({ text, content,icon } : { text: string, content: React.ReactNode, icon: React.ReactNode }) => {
  const { setContent } = useContent();
  const [hovered, setHovered] = useState(false);
  const onPress = () => {
    setContent(content);
  };

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={{
        width:'22%',
        paddingTop:2,
        paddingBottom:2,
        backgroundColor: hovered ? 'rgb(0 33 127)' : 'transparent', // cor muda no hover
        borderRadius: 4,
      }}
    >
      <View style={{ flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        {icon}
        <Text style={{ color: Colors.branco, fontSize: 14 }}>{text}</Text>
      </View>
    </Pressable>
  );
}


const SideBarMobile = () => {

  return (
    <View
      style={{
        width: '100%',
        height: 'auto',
        backgroundColor: 'rgb(0 20 77)',
        padding: 0,
        flexDirection: 'column',
        gap: 8,
        overflow: 'hidden', // evita "vazamentos" visuais durante a animação
      }}
    >

      <View style={{ flex:1,flexDirection: 'row',alignItems: 'center',justifyContent:'space-between',gap: 8,padding: 8, height: 'auto',backgroundColor: 'rgb(0 20 77)'}}>
        <SideBarMenuItem text="Home" content={<Home />} icon={<House color="#ffffff" />} />
        <SideBarMenuItem text="Resultados" content={<Resultados />} icon={<Target color="#ffffff" />} />
        <SideBarMenuItem text="Jogar" content={<Jogar />} icon={<Dice6 color="#ffffff" />} />
        <SideBarMenuItem text="Apostas" content={<MinhasApostas />} icon={<User color="#ffffff" />} />
      </View>
      
    </View>
  );
};


export default SideBarMobile;
