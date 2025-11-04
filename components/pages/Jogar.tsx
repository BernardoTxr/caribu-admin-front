import React, { useEffect, useState } from "react"; 
import { View, Text, ScrollView, Pressable ,Modal,TouchableOpacity,useWindowDimensions} from "react-native"; 
import AnimalsGrid from "@/components/Jogar/AnimalsGrid";
import ResultCard from "@/components/ResultCard"; 
import ApostaSidebar from "@/components/Jogar/ApostaSidebar"; 
import BetCategorySelector, { BetCategory } from "@/components/Jogar/BetCategorySelector"; 
import SorteioSelector from "@/components/Jogar/SorteioSelector"; 
import NumberEntry, { Mode } from "@/components/Jogar/NumberEntry";
import { getUserDetails } from "@/app/services/utils";
import { createNewBet } from "@/app/services/new_bet";
import Styles from "@/styles/resultados"; 
import { Colors } from "@/styles/colors"; 
import { Picker } from '@react-native-picker/picker'; 
import { router } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { ArrowDown, Calendar, ChevronDown, Clock, Cross, X } from "lucide-react-native";
import Collapsible from 'react-native-collapsible';




const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// categorias de grupo (usam AnimalsGrid)
const GROUP_CATEGORIES: BetCategory[] = [
  "Grupo",
  "Dupla de Grupo",
  "Terno de Grupo",
  "Quadra de Grupo",
  "Quina de Grupo",
];

// categorias que pedem numero digitado (usam NumberEntry)
const NUMBER_INPUT_CATEGORIES: BetCategory[] = [
  "Milhar",
  "Milhar Invertida",
  "Centena",
  "Centena Invertida",
  "Dezena",
  "Milhar com Centena",
  "Milhar com Centena Invertida",
  "Duque de Dezena",
  "Terno de Dezena",
];

// para algumas categorias de grupo exigimos uma quantidade fixa
const REQUIRED_BY_CATEGORY: Partial<Record<BetCategory, number>> = {
  "Dupla de Grupo": 2,
  "Terno de Grupo": 3,
  "Quadra de Grupo": 4,
  "Quina de Grupo": 5,
};

const Horario: React.FC<{ horario: string; active: boolean; onPress: () => void }> = ({ horario, active, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 5,
          paddingHorizontal: 8,
          borderRadius: 10,
          backgroundColor: active ? Colors.azulClaro : Colors.azulescuro,
          width: '100%',
          marginBottom: 8,
        }}
      >
        <Clock color={Colors.branco} style={{ marginRight: 5 }} />
        <Text style={{ color: Colors.branco, fontSize: RFValue(12), fontWeight: 'bold' }}>
          {horario}
        </Text>
      </View>
    </Pressable>
  );
};
const Accordion: React.FC<{ banca: string; horarios: string[]; horariosSelecionados: string[]; onHorarioPress: (horario: string) => void }> = ({ banca, horarios, horariosSelecionados, onHorarioPress }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View >
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={{
          backgroundColor: 'transparent',
          padding: 10,
          borderBottomWidth:1,
          borderColor:Colors.branco,
          display:'flex',
          flexDirection:'row',
          justifyContent:'space-between',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{banca}</Text>
        <ChevronDown color={Colors.branco} />

      </TouchableOpacity>

      <Collapsible collapsed={!expanded}>
        <View style={{ marginTop: 10, padding: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {horarios.map((horario, index) => (
            <Horario key={index} horario={horario} active={horariosSelecionados.includes(horario)} onPress={() => onHorarioPress(horario)} />
          ))}
        </View>
      </Collapsible>

    </View>
  );
};

const Jogar: React.FC = () => { 
  

  const [gruposSelecionados, setGruposSelecionados] = useState<number[]>([]);  // estado de grupos selecionados (quando aposta for de grupo)
  const [categoria, setCategoria] = useState<BetCategory>("Grupo");  // categoria atual da aposta
  const [sorteios, setSorteios] = useState<number[]>([]);  // sorteios marcados (1..5)
  const [nums, setNums] = useState<{ milhar?: string; centena?: string; dezena?: string; dezenas?: string[] }>({});  // numeros digitados quando a categoria pede (milhar/centena/dezena/dezenas[])
  const [saldo, setSaldo] = useState<number | null>(null);
  const [loadingSaldo, setLoadingSaldo] = useState(true);
  const [applyMode, setApplyMode] = useState<"todos" | "cada">("todos"); // modo de aplicar valor: todos ou cada
  const isGroupBet = GROUP_CATEGORIES.includes(categoria); // se e aposta de grupo
  const needsNumber = NUMBER_INPUT_CATEGORIES.includes(categoria); // se precisa digitar numero
  const requiredGroups = REQUIRED_BY_CATEGORY[categoria] ?? undefined; // quantidade fixa quando aplicavel por ex dupla de grupo


  const [extracoesModalVisibile,setExtracoesModalVisibile] = useState(false);
  const [diasExtracoes, setDiasExtracoes] = useState<Date[]>([new Date()]);
  const [diaSelecionado, setDiaSelecionado] = useState<Date>(new Date());
  const [bancas, setBancas] = useState(['Banca 1', 'Banca 2', 'Banca 3']);
  const [bancasHorarios, setBancasHorarios] = useState<Record<string, string[]>>({}); // horarios disponiveis por banca
  const [bancasHorariosSelecionados, setBancasHorariosSelecionados] = useState<Record<string,string[]>>({}); // horarios selecionados  
  const {width, height} = useWindowDimensions();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/scrapping/loterias`);
      const data = await response.json();
      const nomes = Object.keys(data.data);
      setBancas(nomes);
    };
    fetchData();
  }, []);

  const listBancasHorarios = async () => {
    const response = await fetch(`${API_BASE_URL}/scrapping/loterias`);
    const data = await response.json();
    const bancasHorarios = Object.values(data.data).reduce((acc: Record<string, string[]>, banca: any) => {
      if (banca.horarios.length > 0){
        acc[banca.nome] = banca.horarios;

      }
      return acc;
    }, {});
    setBancasHorarios(bancasHorarios);
  }

  return (
    <View style={{ flex: 1, flexDirection: "column",padding:20,minHeight:height - 125}}> {/* layout de 2 colunas: esquerda conteudo, direita sidebar */}

      {/*Extrações */}
      <View style={{borderWidth:1,borderColor:Colors.azulescuro,marginBottom:20,borderRadius:7,padding:10}}>
        <Text style={{fontWeight:'bold', fontSize:RFValue(16), marginBottom:12}}>1.📅 Extrações</Text>

        <View style={{borderWidth:1,borderStyle:'dashed', borderColor:Colors.azulescuro,padding:10, borderRadius:5}}>
          {Object.keys(bancasHorariosSelecionados).length > 0 ? (
            Object.entries(bancasHorariosSelecionados).map(([banca, horarios], i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <Text style={{fontSize:RFValue(12), color:Colors.azulescuro, textAlign:'center',fontWeight:'bold'}}>🎯 {banca}</Text>
                <Text style={{fontSize:RFValue(9), color:Colors.cinzaClaro, textAlign:'center'}}>{horarios.join(', ')}</Text>
              </View>
            ))
          ) : (
            <View style={{ marginBottom: 10 }}>
              <Text style={{fontSize:RFValue(12), color:Colors.azulescuro, textAlign:'center',fontWeight:'bold'}}>🎯 Nenhuma extração selecionada</Text>
              <Text style={{fontSize:RFValue(9), color:Colors.cinzaClaro, textAlign:'center'}}>Selecione pelo menos uma extração para começar</Text>
            </View>
          )}
        </View>

        <Pressable
          onPress={() => [listBancasHorarios(), setExtracoesModalVisibile(true)]}
          style={({ pressed }) => [
            {
              borderWidth: 1,
              backgroundColor: pressed ? Colors.azulEscuro : Colors.azulescuro,
              padding: 8,
              borderRadius: 5,
              marginTop: 10,
            },
          ]}
        >
          <Text style={{color:Colors.branco,fontWeight:'bold', textAlign:'center'}}>Selecionar extrações</Text>
        </Pressable>

        <Modal
          visible={extracoesModalVisibile}
          transparent={true} 
          animationType="slide"
          onRequestClose={() => setExtracoesModalVisibile(false)} 
        >
          <View style={{ 
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding:15,
            alignItems:'center',
          }}>
            <View style={{maxWidth:1200, width:'100%', backgroundColor:'rgba(22, 26, 29,0.0)', borderRadius:10,paddingVertical:4, gap:0}}>
              <Pressable
                onPress={() => setExtracoesModalVisibile(false)}
                style = {{backgroundColor:Colors.azulMedio, alignSelf:'flex-end', padding:5, borderRadius:20, width:35}}
              >
                <X color={Colors.branco} />
              </Pressable>

              <View style={{maxWidth:1200, width:'100%'}}>
                <View style={{backgroundColor:Colors.azulEscuro, borderColor:Colors.azulClaro,borderWidth:1,borderRadius:7,padding:15, marginBottom:10}}>
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:10, marginBottom:15}}>
                    <Calendar  color={Colors.branco}/>
                    <Text style={{color:Colors.branco, fontSize:RFValue(14), fontWeight:'bold'}}>Selecione o dia da extração</Text>
                  </View>

                  <ScrollView 
                    horizontal={true}
                  >
                    {diasExtracoes.map((dia,i) => (
                      <View 
                        key={i} 
                        style={{
                          paddingVertical:5,
                          paddingHorizontal:15, 
                          backgroundColor: dia==diaSelecionado ? Colors.azulClaro : Colors.azulescuro,
                          borderRadius:10,alignItems:'center', 
                          marginRight:10
                        }}
                        onTouchEnd={() => [setDiaSelecionado(dia),console.log(diaSelecionado)]}
                      >
                        <Text style={{color:Colors.branco,fontWeight:'bold',fontSize:RFValue(10),marginBottom:8}}>{dia.toLocaleDateString('pt-BR', { weekday: 'long' }).toUpperCase().split('-')[0]}</Text>
                        <Text style={{color:Colors.branco,fontWeight:'bold',fontSize:RFValue(14)}}>{dia.getDate()}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>

                <ScrollView style={{backgroundColor:Colors.azulEscuro, borderColor:Colors.azulClaro,borderWidth:1,borderRadius:7,maxHeight:'60%'}}>
                  {
                    Object.entries(bancasHorarios).map(([banca, horarios],i) => (
                      <Accordion key={i} banca={banca} horarios={horarios} horariosSelecionados={bancasHorariosSelecionados[banca] || []} onHorarioPress={(horario) => {
                        //Adicionar Horario e Banca Selecionados
                        setBancasHorariosSelecionados((prev) => {
                          const updated = { ...prev };
                          if (!updated[banca]) updated[banca] = [];
                          //Verificar se o horário já foi adicionado
                          if (!updated[banca].includes(horario)) {
                            // adiciona
                            updated[banca].push(horario);
                          } else {
                            // remove
                            updated[banca] = updated[banca].filter(h => h !== horario);
                          }
                          return updated;
                        });
                      }} />                   
                    ))
                  }
                </ScrollView>
              </View>
            </View>
          </View>
        </Modal>

      </View> 

      {/*Pule*/}
      <View style={{borderWidth:1,borderColor:Colors.azulescuro,marginBottom:20,borderRadius:7,padding:10,paddingBottom:40}}>
        <Text style={{fontWeight:'bold', fontSize:RFValue(16), marginBottom:12}}>2. 🎮 Jogos</Text>
        <Pressable
          disabled={Object.keys(bancasHorariosSelecionados).length === 0} // desabilita se não houver seleção
          onPress={() => []}
          style={({ pressed }) => [
            {
              borderWidth: 1,
              backgroundColor: Object.keys(bancasHorariosSelecionados).length === 0 ? 'rgb(100,100,100)' : (pressed ? Colors.azulEscuro : Colors.azulescuro),
              padding: 8,
              borderRadius: 5,
              marginTop: 10,
            },
          ]}
        >
          <Text style={{color:Colors.branco,fontWeight:'bold', textAlign:'center'}}>Iniciar Nova Pule</Text>
        </Pressable>
      </View>   

      {/*Boletim de Apostas*/}     
      <View style={{borderWidth:1,borderColor:Colors.azulescuro,marginBottom:20,borderRadius:7,padding:10,paddingBottom:40}}>
        <Text style={{fontWeight:'bold', fontSize:RFValue(16), marginBottom:12}}>3. Boletim de Apostas</Text>
        <View style={{borderWidth:1,borderStyle:'dashed', borderColor:Colors.azulescuro,padding:10, borderRadius:5}}>
          <View style={{ marginBottom: 10 }}>
              <Text style={{fontSize:RFValue(12), color:Colors.azulescuro, textAlign:'center',fontWeight:'bold'}}>🎯 Nenhum Jogo Feito</Text>
          </View>
        </View>


      </View>
     
    </View>
  );
};

export default Jogar;
