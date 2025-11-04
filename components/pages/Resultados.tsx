import React, { useEffect, useState, } from "react";
import { View, Text, ScrollView, TouchableOpacity,useWindowDimensions } from "react-native";
import { ResultCard } from "@/components/Components";
import Styles from "@/styles/resultados";
import { Colors } from "@/styles/colors";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const Resultados = () => {
  const { width,height } = useWindowDimensions();
  const isMobile = width < 768;
  const [dataSelecionada, setDataSelecionada] = useState(new Date('2025-01-01'));
  const [bancaSelecionada, setBancaSelecionada] = useState('');
  const [bancas, setBancas] = useState(['Banca 1', 'Banca 2', 'Banca 3']);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [resultados, setResultados] = useState<Record<string, any>>({});
  const [minDate, setMinDate] = useState('2025-01-01');
  const [maxDate, setMaxDate] = useState('2025-01-01');

  useEffect(() => {
    const listarBancas = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/scrapping/loterias`);
        const data = await response.json();
        const nomes = Object.keys(data.data);
        setBancas(nomes);
        sessionStorage.setItem('bancas', JSON.stringify(data.data));
      } catch (error) {
        console.error('Erro ao buscar bancas:', error);
      }
    };
    listarBancas();
  }, []);

  const handleBancaChange = async (banca: string, data: Date) => {
    setBancaSelecionada(banca);
    setMostrarResultados(false);

    try {
      const url = `${API_BASE_URL}/scrapping/dias_resultados?loteria=${encodeURIComponent(banca)}`;
      const response = await fetch(url);
      const result = await response.json();

      const dataFormatada = (() => {
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
      })();

      const link = result.data[dataFormatada];
      if (!link) {
        setResultados({});
        return;
      }

      const response2 = await fetch(`${API_BASE_URL}/scrapping/resultados?link_loteria_dia=${encodeURIComponent(link)}`);
      const result2 = await response2.json();
      console.log('Resultados recebidos:', result2.data);
      setResultados(result2.data);
      setMostrarResultados(true);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
    }
  };

  function parseDateAsLocal(dateStr: string): Date {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const handleBancaChange2 = async (banca: string) => {
    setBancaSelecionada(banca);
    setMostrarResultados(false);
    try {
      const url = `${API_BASE_URL}/scrapping/dias_resultados?loteria=${encodeURIComponent(banca)}`;
      const response = await fetch(url);
      const result = await response.json();
      const datas = Object.keys(result.data).filter(key => key.includes('/'));
      
      // Converte para objetos Date
      const datasConvertidas: Date[] = datas.map((d) => {
        const [dia, mes, ano] = d.split('/').map(Number);
        return new Date(ano, mes - 1, dia); // JS: meses são base 0
      });

      // Converte para timestamps
      const timestamps = datasConvertidas.map(d => d.getTime());

      // Encontra menor e maior data
      const menorData = new Date(Math.min(...timestamps));
      const maiorData = new Date(Math.max(...timestamps));

      // Formata para ISO (yyyy-MM-dd)
      const menorISO = menorData.toISOString().split('T')[0];
      const maiorISO = maiorData.toISOString().split('T')[0];

      setMaxDate(maiorISO);
      setMinDate(menorISO);
      setDataSelecionada(new Date(menorISO));
    } 
    catch (error) {
      console.error('Erro ao buscar dias de resultados:', error);
    }
  };


  return (
    <View style={{ flex: 1, padding: 16, overflowY: 'auto', minHeight: height }}>
      {/* Filtros */}
      <View style={{ flexDirection: 'row', gap: 50, justifyContent: 'center' }}>
        <View style={{ flexDirection: 'column', gap: 10, width: '40%' }}>
          <Text style={isMobile ? [Styles.text, { fontSize: 18}] : Styles.text}>Selecione a Banca</Text>
          <select
            style={Styles.input}
            value={bancaSelecionada}
            onChange={(e) => handleBancaChange2(e.target.value)}
          >
            <option value="">Selecione uma banca</option>
            {bancas.map((banca, index) => (
              <option key={index} value={banca}>{banca}</option>
            ))}
          </select>
        </View>

        <View style={{ flexDirection: 'column', gap: 10, width: '40%' }}>
          <Text style={isMobile ? [Styles.text, { fontSize: 18}] : Styles.text}>Selecione a Data</Text>
          <input
            style={Styles.input}
            type="date"
            min={minDate}
            max={maxDate}
            value={dataSelecionada.toISOString().split('T')[0]}
            onChange={(e) => {
              const dataCorrigida = parseDateAsLocal(e.target.value);
              setDataSelecionada(dataCorrigida);
            }}
          />
        </View>
      </View>

      {/* Botão de Buscar */}
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.azulescuro,
            paddingHorizontal: 32,
            paddingVertical: 12,
            borderRadius: 8,
            minWidth: 120,
          }}
          onPress={() => {
            if (bancaSelecionada) {
              handleBancaChange(bancaSelecionada, dataSelecionada);
            }
          }}
          disabled={!bancaSelecionada}
        >
          <Text style={{
            color: Colors.branco,
            fontWeight: 'bold',
            fontSize: 16,
            textAlign: 'center'
          }}>
            Buscar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Resultados abaixo dos filtros */}
      {mostrarResultados && (
        <ScrollView style={{ marginTop: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              padding: 8,
              alignItems: 'flex-start', 
            }}
          >
            {Object.entries(resultados).map(([horario, resultado], index) => (
              <View
                key={index}
                style={{
                  width: isMobile ? '100%' : '48%',
                  marginBottom: 20,
                }}
              >
                <ResultCard horario={horario} resultados={resultado} />
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Resultados;
