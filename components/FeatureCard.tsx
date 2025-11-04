import React, { useActionState } from 'react';
import { View, Text, TouchableOpacity, Image,useWindowDimensions, ImageBackground} from 'react-native';
import homeStyles from '@/styles/home';

interface FeatureCardProps {
  image?: any;
  href?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({image, href}) => {
  const {width} = useWindowDimensions();
  const isMobile = width < 768;
  
  return (
    <TouchableOpacity
      style={[
        homeStyles.featureCard,
        { width: isMobile ? '48%' : '24%' }
      ]}
      onPress={() => {
        if (href) {
          window.open(href, '_blank');
        }
      }}
      activeOpacity={0.8}
    >
      {image ? (
        <ImageBackground
          source={{ uri: image }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 15,
            overflow: 'hidden',
          }}
          imageStyle={{ borderRadius: 15 }}
          resizeMode="cover"
        >
          {/* Conteúdo opcional dentro da imagem */}
          <View style={{ flex: 1 }} />
        </ImageBackground>
      ) : (
        <View style={{ flex: 1 }} />
      )}
    </TouchableOpacity>
  );
};

export default FeatureCard;
