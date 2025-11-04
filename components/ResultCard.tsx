import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, useWindowDimensions } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Colors } from '@/styles/colors';

interface ResultData {
  premio: string;
  milhar: string;
  grupo: string;
  animal: string;
}

interface ResultCardProps {
  horario: string;
  resultados: string;
}

const grupoParaAnimal: Record<string, string> = {
  '1': 'Avestruz', '2': 'Águia', '3': 'Burro', '4': 'Borboleta', '5': 'Cachorro',
  '6': 'Cabra', '7': 'Carneiro', '8': 'Camelo', '9': 'Cobra', '10': 'Coelho',
  '11': 'Cavalo', '12': 'Elefante', '13': 'Galo', '14': 'Gato', '15': 'Jacaré',
  '16': 'Leão', '17': 'Macaco', '18': 'Porco', '19': 'Pavão', '20': 'Peru',
  '21': 'Touro', '22': 'Tigre', '23': 'Urso', '24': 'Veado', '25': 'Vaca',
};

const ResultCard: React.FC<ResultCardProps> = ({ horario, resultados }) => {
  const [expanded, setExpanded] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const {width} = useWindowDimensions();
  const isMobile = width < 768;

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;

    Animated.parallel([
      Animated.timing(animation, {
        toValue,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setExpanded(!expanded);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500],
  });

  const opacityInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const linhas = resultados.trim().split('\n');
  const dados: ResultData[] = linhas.slice(1).map((linha) => {
    const colunas = linha.split(',');
    const premio = colunas[0].replace(/[^0-9º]/g, '');
    const milhar = colunas[1].replace(/[^0-9]/g, '');
    const grupo = colunas[2].replace(/[^0-9]/g, '');
    const animal = grupoParaAnimal[grupo] || 'Desconhecido';
    return { premio, milhar, grupo, animal };
  });

  return (
    <View style={styles.card}>
      <Pressable
        onPress={toggleExpand}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={[
          styles.header,
          expanded && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
          isPressed && styles.headerPressed,
        ]}
      >
        <Text style={styles.headerText}>{horario}</Text>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <ChevronDown size={24} color={Colors.branco} />
        </Animated.View>
      </Pressable>

      <Animated.View style={{ height: heightInterpolate, overflow: 'hidden', opacity: opacityInterpolate }}>
        <View>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Prêmio</Text>
            <Text style={styles.tableHeaderText}>Milhar</Text>
            <Text style={styles.tableHeaderText}>Grupo</Text>
            <Text style={styles.tableHeaderText}>Animal</Text>
          </View>

          <View style={styles.content}>
            {dados.map((item, index) => {
              const isLast = index === dados.length - 1;
              return (
                <View key={index} style={styles.resultRow}>
                  <Text style={[styles.cell, isLast && styles.lastCellLeft,isMobile && { fontSize: 16 }]}>{item.premio}</Text>
                  <Text style={[styles.cell, isMobile && { fontSize: 16 }]}>{item.milhar}</Text>
                  <Text style={[styles.cell, isMobile && { fontSize: 16 }]}>{item.grupo}</Text>
                  <Text style={[styles.cell, isLast && styles.lastCellRight,isMobile && { fontSize: 16 }]}>{item.animal}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  headerPressed: {
    backgroundColor: '#334155', // cor ao pressionar (um azul acinzentado escuro)
  },
  headerText: {
    color: Colors.branco,
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    justifyContent: 'space-between',
  },
  tableHeaderText: {
    width: '25%',
    fontWeight: 'bold',
    color: '#1e3a8a',
    borderColor: 'rgb(30 58 138)',
    borderWidth: 1,
    textAlign: 'center',
    padding: 8,
  },
  content: {},
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    width: '25%',
    textAlign: 'center',
    color: 'rgb(30 58 138)',
    fontSize: 18,
    fontWeight: '500',
    borderColor: 'rgb(30 58 138)',
    borderWidth: 1,
    padding: 8,
  },
  lastCellLeft: {
    borderBottomLeftRadius: 12,
  },
  lastCellRight: {
    borderBottomRightRadius: 12,
  },
});

export default ResultCard;
