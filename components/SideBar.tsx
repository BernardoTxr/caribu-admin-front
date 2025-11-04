import React, { useState,useEffect,useRef } from 'react';
import { View, Text, Pressable,Dimensions, Animated } from 'react-native';
import { useSideBar } from '@/components/contexts/SideBarContext';
import { useContent } from '@/components/contexts/ContentContext';
import { Resultados,Jogar,Home} from '@/components/Components';
import { Target, Dice6, House, User } from 'lucide-react-native';
import MinhasApostas from './pages/MinhasApostas';

const screenWidth = Dimensions.get('window').width;
const targetWidth = screenWidth * 0.2;

const SideBarHeader = () => {
  return (
    <Text style={{color: '#ffffff', fontSize: 20, marginBottom: 16, width: '100%', textAlign:'center', fontWeight: 'bold'}}>Menu</Text>
  );
}

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
        padding: 8,
        backgroundColor: hovered ? 'rgb(0 33 127)' : 'transparent', // cor muda no hover
        borderRadius: 4,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {icon}
        <Text style={{ color: '#ffffff', fontSize: 16 }}>{text}</Text>
      </View>
    </Pressable>
  );
}


const SideBar = () => {
  const { isOpen } = useSideBar();
  const sidebarWidthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(sidebarWidthAnim, {
      toValue: isOpen ? targetWidth : 0,
      duration: 250,
      useNativeDriver: false, // width não funciona com useNativeDriver: true
    }).start();
  }, [isOpen]);

  return (
    <Animated.View
      style={{
        width: sidebarWidthAnim,
        height: '100%',
        maxWidth: 256, // <- adicionado aqui
        backgroundColor: 'rgb(0 20 77)',
        padding: 0,
        flexDirection: 'column',
        gap: 8,
        overflow: 'hidden', // evita "vazamentos" visuais durante a animação
      }}
    >
      <View style={{ flex:1,flexDirection: 'column',gap: 8,padding: 16, height: '100%',backgroundColor: 'rgb(0 20 77)'}}>
        <SideBarHeader />
        <SideBarMenuItem text="Home" content={<Home />} icon={<House color="#ffffff" />} />
        <SideBarMenuItem text="Resultados" content={<Resultados />} icon={<Target color="#ffffff" />} />
        <SideBarMenuItem text="Jogar" content={<Jogar />} icon={<Dice6 color="#ffffff" />} />
        <SideBarMenuItem text="Minhas Apostas" content={<MinhasApostas />} icon={<User color="#ffffff" />} />
      </View>
      
    </Animated.View>
  );
};


export default SideBar;
