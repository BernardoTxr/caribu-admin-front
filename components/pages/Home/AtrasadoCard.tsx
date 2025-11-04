import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import homeStyles from '@/styles/home';
import { Colors } from '@/styles/colors';

interface AtrasadoCardProps {
  grupo: string;
  animal: string;
  tempoAtrasado: string;
  dataUltimaSaida: string;
  onPress: () => void;
}

const AtrasadoCard: React.FC<AtrasadoCardProps> = ({
  grupo,
  animal,
  tempoAtrasado,
  dataUltimaSaida,
  onPress
}) => {
  return (
    <TouchableOpacity style={[homeStyles.atrasadoCard, {backgroundColor:Colors.azulescuro}]} onPress={onPress}>
      <View style={homeStyles.atrasadoHeader}>
        <Text style={{fontSize: 14,fontWeight: 'bold',color: Colors.branco}}>Grupo {grupo}</Text>
        <Text style={homeStyles.atrasadoTempo}>{tempoAtrasado}</Text>
      </View>
      <Text style={{fontSize: 14,fontWeight: 'bold',color: Colors.branco}}>{animal}</Text>
      <Text style={homeStyles.atrasadoData}>{dataUltimaSaida}</Text>
    </TouchableOpacity>
  );
};

export default AtrasadoCard;
