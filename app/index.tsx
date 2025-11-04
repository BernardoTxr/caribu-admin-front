import Main from '@/app/main';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';
import {setCustomText} from 'react-native-global-props';

const Index = () => {
  const [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
  });
  setCustomText({ style: { fontFamily: 'Inter,sans-serif' } });

  return <Main />;
};


export default Index;
