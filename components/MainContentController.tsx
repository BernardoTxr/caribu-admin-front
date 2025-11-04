import React from 'react';
import { Animated, View, Text,useWindowDimensions } from 'react-native';
import { useContent } from '@/components/contexts/ContentContext';
import { Home, Footer } from './Components';

const MainContentController = () => {
  const { content } = useContent();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  return (
    <Animated.View
      style={{
        backgroundColor: '#ffffff',
        flex: 1,
        flexDirection: 'row',
        maxWidth: isMobile ? '100%' : 1200,
        marginLeft: isMobile ? 0 : 'auto',
        marginRight: isMobile ? 0 : 'auto',

      }}
    >
      
      <View style={{ flex: 1 }}>
        {content ? (
          <View style={{ flex: 1 ,height:'100%'}}>
            {content}
          </View>
        ) : (
          <Home />
        )}
      </View>
    </Animated.View>
  );
};

export default MainContentController;
