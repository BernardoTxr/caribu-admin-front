import { Pressable, Text, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import Styles from '@/styles/buttons';

const ButtonPrimary= ({ onClick , size, text}: { onClick: () => void , size?: number , text: string }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onPress={onClick}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
    >
      <Text style={[hovered ? Styles.ButtonPrimaryHover : Styles.ButtonPrimary ,{fontSize: size|| 14}]}>
        {text}
      </Text>
    </Pressable>
  );
};

const ButtonSecundary= ({ onClick , size, text}: { onClick: () => void , size?: number , text: string }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onPress={onClick}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
    >
      <Text style={[hovered ? Styles.ButtonSecundaryHover : Styles.ButtonSecundary ,{fontSize: size|| 14}]}>
        {text}
      </Text>
    </Pressable>
  );
};

export { ButtonPrimary, ButtonSecundary };
