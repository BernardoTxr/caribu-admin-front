import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, ImageBackground, useWindowDimensions } from 'react-native';
import homeStyles from '@/styles/home';

type BannerProps = {
  href?: string;
  image_url?: string;
};

const Carrossel = ({ items }: { items: BannerProps[] }) => {
  const [bannerActiveIndex, setBannerActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const scrollToNext = () => {
    const nextActiveIndex = bannerActiveIndex >= items.length - 1 ? 0 : bannerActiveIndex + 1;
    setBannerActiveIndex(nextActiveIndex);
    scrollRef.current?.scrollTo({
      x: nextActiveIndex * width,
      animated: true,
    });
  };

  useEffect(() => {
    const interval = setInterval(scrollToNext, 7000);
    return () => clearInterval(interval);
  }, [bannerActiveIndex]);

  return (
    <View>
      <ScrollView
        style={[
          homeStyles.carroselContainer,
          { height: isMobile ? 130 : 300 },
        ]}
        contentContainerStyle={{ flex: 1 }}
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        {items.map((item, index) => (
          <ImageBackground
            key={index}
            source={
              item.image_url
                ? { uri: item.image_url }
                : require('@/assets/images/favicon.png')
            }
            style={{
              width,
              height: isMobile ? 130 : 300,
            }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      <View style={homeStyles.carroselPagination}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[
              homeStyles.carroselPaginationDot,
              index === bannerActiveIndex
                ? { backgroundColor: '#facc15' }
                : { backgroundColor: 'white' },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export { Carrossel };
