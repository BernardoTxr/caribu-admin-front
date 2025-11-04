import React, { use, useEffect, useState } from "react"; 
import { View, Text, ScrollView, Pressable ,Modal,TouchableOpacity,useWindowDimensions, FlatList, Alert} from "react-native"; 
import { Colors } from "@/styles/colors"; 
import { RFValue } from "react-native-responsive-fontsize";
import { Calendar, ChevronDown, Clock, X, Check, Gift, Divide} from "lucide-react-native";
import Collapsible from 'react-native-collapsible';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Componentes da Seção de Extrações
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
  const dataAgoraString = new Date().toLocaleString("en-US", { timeZone: "America/Fortaleza" });
  const agora: Date = new Date(dataAgoraString);

  const horarios_permitidos = horarios.filter((horario: string) => {
    const [hora, minuto] = horario.split(":").map(Number);

    const horarioDate: Date = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate(),
      hora,
      minuto
    );

    const diffMs: number = horarioDate.getTime() - agora.getTime(); // ✅ use getTime() para deixar explícito
    const diffMin: number = diffMs / (1000 * 60);

    return diffMin > 5;
  });

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
          {horarios_permitidos.map((horario, index) => (
            <Horario key={index} horario={horario} active={horariosSelecionados.includes(horario)} onPress={() => onHorarioPress(horario)} />
          ))}
        </View>
      </Collapsible>

    </View>
  );
};

//Componentes da Seção de Pule
type etapaPule = {
  titulo: string;
  feita: boolean;
  atual: boolean;
}
type Modalidade = {
  nome: string;
  premiacao: number;
  selecionada: boolean;
  digitos_necessarios: number;
}
type Extracao = {
  nome_banca: string;
  data: Date;
  horario: string;
}
type Apostas = {
  extracao: Extracao;
  modalidade: Modalidade;
  numeros_selecionados: string[];
  premios_selecionados: number[];
  valor: number;
  separacao: string;
}

const Modalidades: React.FC<{ modalidades: Modalidade[], setModalidades: React.Dispatch<React.SetStateAction<Modalidade[]>>}> = ({ modalidades, setModalidades }) => {
  return (
    <ScrollView style={{flex:1}}>
      {modalidades.map((modalidade, index) => (
        <Pressable 
          key={modalidade.nome} 
          style={{borderBottomWidth:1,borderColor:Colors.azulMedio, backgroundColor:modalidade.selecionada ? Colors.azulClaro : 'transparent',paddingHorizontal:10,paddingVertical:15}}
          onPress={() => setModalidades((prev) =>
            prev.map((m) => ({
              ...m,
              selecionada: m.nome === modalidade.nome, // apenas a selecionada = true
            }))
          )}
        >
          <Text style={{ color: modalidade.selecionada? Colors.azulescuro :Colors.branco, fontSize: RFValue(12), fontWeight: '600' ,marginBottom: 10}}>{modalidade.nome}</Text>
          <Text style={{ color: modalidade.selecionada? Colors.azulEscuro :Colors.cinzaClaro, fontSize: RFValue(10) }}>R$ 1,00x {modalidade.premiacao.toLocaleString('pt-BR', {minimumFractionDigits: 2,maximumFractionDigits: 2})}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const Jogo: React.FC<{modalidade: Modalidade , digitos: string[], numeros_selecionados: string[] , setNumerosSelecionados: React.Dispatch<React.SetStateAction<string[] >>}> = ({modalidade,digitos,numeros_selecionados,setNumerosSelecionados}) => {
 // Estado local para controlar os dígitos que estão sendo digitados
  const [digitosAtuais, setDigitosAtuais] = useState<string[]>([]);

  const handlePressNumero = (numero: string) => {
    // Adiciona o dígito
    const novosDigitos = [...digitosAtuais, numero];
    // Atualiza o painel de dígitos
    setDigitosAtuais(novosDigitos);
    // Quando tiver 4 dígitos, adiciona à lista de números selecionados
    if (novosDigitos.length === 4) {
      const novoNumero = novosDigitos.join('');
      setNumerosSelecionados((prev) => {
        if (!prev) return [novoNumero];
        return [...prev, novoNumero];
      });

      // Reseta o painel de dígitos
      setDigitosAtuais([]);
    }
  };

  useEffect(() => {
    // TODO:  Entender como manter os números selecionados ao manter a modalidade
    setNumerosSelecionados([]);
  }, [modalidade.nome]);

  return (
    <View style={{ flex: 1 }}>
      { true ? ( //TODO: Condição para renderizar o jogo apenas se modalidade numéricas forem selecionadas, criar painel de grupos
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          {/* Seção de Escolha do Número */}
          <View style={{
            height: '10%',
            width: '70%',
            marginTop: 20,
            borderColor: Colors.azulClaro,
            borderWidth: 2,
            borderRadius: 10,
            backgroundColor: Colors.azulEscuro,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            {/* Dígitos */}
            <View style={{
              width: '60%',
              marginHorizontal: 10,
              marginVertical: 5,
              backgroundColor: Colors.branco,
              borderRadius: 40
            }}>
              <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
                paddingHorizontal: 30
              }}>
                {Array.from({ length: modalidade.digitos_necessarios }).map((_, index) => (
                  <Text
                    key={index}
                    style={{
                      color: Colors.azulEscuro,
                      fontSize: RFValue(12),
                      textAlign: 'center'
                    }}
                  >
                    {digitosAtuais[index] || '-'}
                  </Text>
                ))}
              </View>
            </View>

            {/* Botão de Gerar Sorte */}
            <Pressable
              style={{
                backgroundColor: Colors.azulescuro,
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 5,
                marginRight: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                const random = String(Math.floor(Math.random() * Math.pow(10, modalidade.digitos_necessarios)))
                  .padStart(modalidade.digitos_necessarios, '0');
                setNumerosSelecionados((prev) => {
                  if (!prev) return [random];
                  return [...prev, random];
                });
              }}
            >
              <Gift color={Colors.branco} width={20} />
              <Text style={{
                color: Colors.branco,
                fontSize: RFValue(10),
                fontWeight: 'bold'
              }}>
                Sorte
              </Text>
            </Pressable>
          </View>

          {/* Seção de Números Selecionados */}
          <View style={{
            height: '30%',
            width: '85%',
            backgroundColor: Colors.azulEscuro,
            borderWidth: 2,
            borderColor: Colors.azulClaro,
            borderRadius: 10,
            alignItems: 'center'
          }}>
            <Text style={{
              color: Colors.branco,
              fontSize: RFValue(8),
              fontWeight: 'bold',
              marginTop: 10
            }}>
              {modalidade.nome} selecionados ({numeros_selecionados?.length || 0})
            </Text>
            <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              {numeros_selecionados?.map((n, i) => (
                <View style={{flexDirection:'row', alignItems:'center',  padding: 5, borderRadius:10, backgroundColor: Colors.azulescuro, marginHorizontal: 5,}} key={i}>
                  <Text style={{ alignItems:'center',color: Colors.branco, }}>{n}</Text>
                  <Pressable
                    onPress={() => setNumerosSelecionados((prev) => prev.filter((num) => num !== n))}
                  >
                    <X color={Colors.branco}/>
                  </Pressable>
                </View>
                
              ))}
            </View>
          </View>

          {/* Seção do Teclado Numérico */}
          <View style={{
            height: 'auto',
            width: '85%',
            backgroundColor: Colors.azulEscuro,
            borderWidth: 2,
            borderColor: Colors.azulClaro,
            borderRadius: 10,
            alignItems: 'center'
          }}>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              padding: 10,
              justifyContent: 'center',
              gap: 10
            }}>
              {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((numero) => (
                <Pressable
                  key={numero}
                  style={{
                    padding: 10,
                    width: '30%',
                    borderRadius: 5,
                    borderWidth: 2,
                    borderColor: Colors.branco,
                    alignItems: 'center'
                  }}
                  onPress={() => handlePressNumero(numero)}
                >
                  <Text style={{
                    color: Colors.branco,
                    fontSize: RFValue(12),
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    {numero}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const Premio : React.FC<{numerosSelecionados: string[], premiosSelecionados: number[], setPremiosSelecionados: React.Dispatch<React.SetStateAction<number[]>>}> = ({numerosSelecionados, premiosSelecionados, setPremiosSelecionados}) => {

  {/* Estados*/}
  const premios = Array.from({ length: 10 }, (_, i) => ({ premio: i + 1 }));
  const gruposDePremios = [
    { premios: [1]},
    { premios: [1, 2] },
    { premios: [1, 2, 3, 4, 5] },
    { premios: [6, 7, 8, 9, 10] },
    { premios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  ];

  {/* Funções*/}
  const togglePremio = (numero: number) => {
    setPremiosSelecionados((prev) =>
      prev.includes(numero)
        ? prev.filter((n) => n !== numero)
        : [...prev, numero]
    );
  };
  const toggleGrupo = (grupo: number[]) => {
    setPremiosSelecionados((prev) => {
      const todosSelecionados = grupo.every((n) => prev.includes(n));
      if (todosSelecionados) {
        // desmarca o grupo inteiro
        return prev.filter((n) => !grupo.includes(n));
      } else {
        // adiciona os que faltam
        const novos = grupo.filter((n) => !prev.includes(n));
        return [...prev, ...novos];
      }
    });
  };
  useEffect(() => {
    setPremiosSelecionados([]);
  }, [numerosSelecionados]);

  return (
    <View style={{flex: 1,paddingHorizontal: 20,alignItems: 'center',flexDirection: 'column',gap: 10,paddingTop: 20,paddingBottom: 100,}}>
      <Text style={{color: Colors.branco,fontSize: RFValue(14),fontWeight: 'bold',textAlign: 'center',}}>Selecione os Prêmios</Text>
      <Text style={{  color: Colors.cinzaClaro,  fontSize: RFValue(10),  textAlign: 'center',}}>Escolha um grupo ou marque prêmios individuais</Text>
      <View
        style={{
          width: '100%',
          borderWidth: 1,
          borderColor: Colors.azulClaro,
          borderRadius: 7,
          padding: 15,
          backgroundColor: Colors.azulEscuro,
          flexDirection: 'column',
        }}
      >
        {/* Grupos de Prêmios */}
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderBottomColor: Colors.azulescuro,
            borderBottomWidth: 2,
            paddingBottom: 15,
            marginBottom: 15,
          }}
        >
          {gruposDePremios.map((grupo, i) => {
            const todosSelecionados = grupo.premios.every((n) =>
              premiosSelecionados.includes(n)
            );
            return (
              <Pressable
                key={i}
                onPress={() => toggleGrupo(grupo.premios)}
                style={{
                  backgroundColor: todosSelecionados
                    ? Colors.azulMedio
                    : Colors.azulescuro,
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 10,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: Colors.branco,
                    fontSize: RFValue(12),
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  {`${grupo.premios[0]}° ao ${
                    grupo.premios[grupo.premios.length - 1]
                  }°`}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Prêmios Individuais */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {premios.map((premio) => {
            const selecionado = premiosSelecionados.includes(premio.premio);
            return (
              <Pressable
                key={premio.premio}
                onPress={() => togglePremio(premio.premio)}
                style={{
                  backgroundColor: selecionado
                    ? Colors.azulMedio
                    : Colors.azulescuro,
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 10,
                  alignItems: 'center',
                  width: '18%',
                }}
              >
                <Text
                  style={{
                    color: Colors.branco,
                    fontSize: RFValue(12),
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  {`${premio.premio}°`}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text
        style={{
          color: Colors.cinzaClaro,
          fontSize: RFValue(10),
          textAlign: 'center',
        }}
      >
        Dica: Você também pode escolher os prêmios selecionando os números
        acima.
      </Text>
    </View>
  );
};

const Valor: React.FC<{valorSelecionado: number, setValorSelecionado: React.Dispatch<React.SetStateAction<number>>, separacaoSelecionada:string, setSeparacaoSelecionada: React.Dispatch<React.SetStateAction<string>>}> = ({valorSelecionado, setValorSelecionado, separacaoSelecionada, setSeparacaoSelecionada}) => {
  const valoresSugeridos = [2, 5, 10, 20, 50, 100, 200, 500];
  const separacaoTipos = ["Todos", "Cada"];
  const [valorInput, setValorInput] = useState<string>(''); // valor em centavos (string de dígitos)

  // Função para converter centavos para reais formatados
  const formatarValor = (valorStr: string) => {
    const numero = Number(valorStr) / 100;
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleNumeroPress = (num: string) => {
    // Evita mais de 8 dígitos (R$ 999.999,99)
    if (valorInput.length >= 8) return;

    const novoValor = valorInput + num;
    setValorInput(novoValor);
    const valorEmReais = Number(novoValor) / 100;
    setValorSelecionado(valorEmReais);
  };

  const handleApagarUltimo = () => {
    const novoValor = valorInput.slice(0, -1);
    setValorInput(novoValor);
    const valorEmReais = Number(novoValor) / 100;
    setValorSelecionado(valorEmReais);
  };

  const handleLimparTudo = () => {
    setValorInput('');
    setValorSelecionado(0);
  };

  const handleValorSugerido = (v: number) => {
    const valorEmCentavos = String(Math.round(v * 100));
    setValorInput(valorEmCentavos);
    setValorSelecionado(v);
  };

  return (
    <View style={{flex:1, alignItems:'center', flexDirection:'column', gap:20,paddingHorizontal:20}}>
      
      {/* Botões de Valores Sugeridos */}
      <View style={{flexDirection:'row', flexWrap:'wrap', gap:6, justifyContent:'center',marginTop:20}}>
        {valoresSugeridos.map((v,i) => (
          <Pressable 
            key={i} 
            onPress={() => handleValorSugerido(v)}
            style={{
              paddingVertical: 10,
              backgroundColor: valorSelecionado === v ? Colors.azulMedio : Colors.azulescuro,
              borderRadius:5,
              width:'20%',
              borderColor:Colors.azulClaro,
              borderWidth:1,
              alignItems:'center'
            }}
          >
            <Text style={{color: Colors.branco, fontSize: RFValue(10), fontWeight: 'bold', textAlign: 'center'}}>{`R$ ${v},00`}</Text>
          </Pressable>
        ))}
      </View>

      {/* Valor atual */}
      <View style={{width:'100%', alignItems:'center', flexDirection:'column', gap:2}}>
        <Text style={{color: Colors.branco, fontSize: RFValue(12), fontWeight: 'bold', marginBottom:10, textAlign:'center'}}>
          Valor da Aposta
        </Text>
        <View style={{width:'80%', backgroundColor:Colors.azulEscuro, borderRadius:5, paddingHorizontal:10, paddingVertical:5}}>
          <Text style={{color: Colors.branco, fontSize: RFValue(12), textAlign: 'center', fontWeight: 'bold'}}>
            {valorInput ? formatarValor(valorInput) : 'R$ 0,00'}
          </Text>
        </View>
      </View>

      {/* Botões de Separação */}
      <View style={{flexDirection:'row', justifyContent:'center', width:'80%'}}>
        {separacaoTipos.map((tipo, i) => (
          <Pressable 
            key={i} 
            onPress={() => setSeparacaoSelecionada(tipo)}
            style={{
              paddingVertical:10,
              paddingHorizontal:15,
              backgroundColor: separacaoSelecionada === tipo ? Colors.azulMedio : Colors.azulescuro,
              borderRadius:5,
              borderColor:Colors.azulClaro,
              borderWidth:1,
              marginHorizontal:5,
              flexDirection:'row',
              alignItems:'center',
            }}
          >
            <Text style={{color: Colors.branco, fontSize: RFValue(10), textAlign: 'center', fontWeight: 'bold'}}>{tipo}</Text>
            {tipo === 'Todos' ?
              <Divide width={18} color={Colors.branco} />
              : 
              <X width={18} color={Colors.branco} />
            }
          </Pressable>
        ))}
      </View>

      {/* 🔢 Teclado Numérico */}
      <View style={{width:'80%', backgroundColor:Colors.azulEscuro, borderRadius:10, borderWidth:1, borderColor:Colors.azulClaro, padding:10, marginTop:10}}>
        <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'center', gap:10}}>
          {[...'1234567890'].map((num) => (
            <Pressable
              key={num}
              onPress={() => handleNumeroPress(num)}
              style={{
                width: '28%',
                backgroundColor: Colors.azulescuro,
                paddingVertical: 12,
                borderRadius: 5,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.azulClaro
              }}
            >
              <Text style={{color: Colors.branco, fontSize: RFValue(14), fontWeight: 'bold'}}>{num}</Text>
            </Pressable>
          ))}

          {/* 🔙 Apagar Último */}
          <Pressable
            onPress={handleApagarUltimo}
            style={{
              width: '28%',
              backgroundColor: Colors.azulMedio,
              paddingVertical: 12,
              borderRadius: 5,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Colors.azulClaro
            }}
          >
            <Text style={{color: Colors.branco, fontSize: RFValue(12), fontWeight: 'bold'}}>Apagar</Text>
          </Pressable>

          {/* ❌ Limpar Tudo */}
          <Pressable
            onPress={handleLimparTudo}
            style={{
              width: '28%',
              backgroundColor: Colors.vermelho || '#b00',
              paddingVertical: 12,
              borderRadius: 5,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Colors.azulClaro
            }}
          >
            <Text style={{color: Colors.branco, fontSize: RFValue(12), fontWeight: 'bold'}}>Limpar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

{/* Componente Principal */}
const Jogar: React.FC = () => { 
  
  const {width, height} = useWindowDimensions();

  // Estados para Modal de Extrações
  const [extracoesModalVisibile,setExtracoesModalVisibile] = useState(false);
  const [diasExtracoes, setDiasExtracoes] = useState<Date[]>([new Date()]);
  const [diaSelecionado, setDiaSelecionado] = useState<Date>(new Date());
  const [bancas, setBancas] = useState(['Banca 1', 'Banca 2', 'Banca 3']);
  const [bancasHorarios, setBancasHorarios] = useState<Record<string, string[]>>({}); // horarios disponiveis por banca
  const [bancasHorariosSelecionados, setBancasHorariosSelecionados] = useState<Record<string,string[]>>({}); // horarios selecionados  
  
  // Estados para Modal de Pule
  const [puleModalVisible,setPuleModalVisible] = useState(false);
  const [etapasPule, setEtapasPule] = useState<etapaPule[]>([
    { titulo: 'Modalidade',feita: false, atual: true},
    { titulo: 'Jogo', feita: false, atual: false },
    { titulo: 'Prêmio', feita: false, atual: false },
    { titulo: 'Valor', feita: false, atual: false },
  ]);
  const etapaPuleAtual = etapasPule.find((etapa) => etapa.atual);

  const [modalidades, setModalidades] = useState<Modalidade[]>([
    {nome:'Milhar', premiacao:6000, selecionada:false, digitos_necessarios:4},
    {nome:'Centena', premiacao:600, selecionada:false, digitos_necessarios:3},
    {nome:'Dezena', premiacao:70, selecionada:false, digitos_necessarios:2},
    {nome:'Milhar Invetido', premiacao:6000, selecionada:false, digitos_necessarios:4},
    {nome:'Centena Invertida', premiacao:60, selecionada:false, digitos_necessarios:3},
    {nome:'Grupo', premiacao:18, selecionada:false, digitos_necessarios:2},
    {nome:'Dupla de Grupo', premiacao:16, selecionada:false, digitos_necessarios:2},
    {nome:'Quadra de Grupo', premiacao:1000, selecionada:false, digitos_necessarios:4},
    {nome:'Quina de Grupo', premiacao:5000, selecionada:false, digitos_necessarios:5},
    {nome:'Duque de Dezena', premiacao:300, selecionada:false, digitos_necessarios:2},
    {nome:'Terno de Dezena', premiacao:5000, selecionada:false, digitos_necessarios:3},
  ]);
  const modalidadeSelecionada = modalidades.find((modalidade) => modalidade.selecionada) ?? {
    nome:'', 
    premiacao:0, 
    selecionada:false, 
    digitos_necessarios:0
  };
  const [numerosSelecionados, setNumerosSelecionados] = useState<string[]>([]);

  const [premiosSelecionados, setPremiosSelecionados] = useState<number[]>([]);

  const [valorSelecionado, setValorSelecionado] = useState<number>(0);
  const [separacaoSelecionada, setSeparacaoSelecionada] = useState<string>('Todos');

  const [apostas, setApostas] = useState<Apostas[]>([]);

  const proximaEtapaPuleDisabled = (
    (etapaPuleAtual?.titulo === 'Modalidade' && modalidadeSelecionada.nome === '') ||
    (etapaPuleAtual?.titulo === 'Jogo' && numerosSelecionados.length === 0) ||
    (etapaPuleAtual?.titulo === 'Prêmio' && premiosSelecionados.length === 0) ||
    (etapaPuleAtual?.titulo === 'Valor' && valorSelecionado === 0) 
  );

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
    setDiasExtracoes(prevDias => {
      const diasAdicionais = prevDias.flatMap(dia => {
        const novasDatas: Date[] = [];
        for (let i = 1; i <= 6; i++) {
          const novaData = new Date(dia);
          novaData.setDate(novaData.getDate() + i);
          novasDatas.push(novaData);
        }
        return novasDatas;
      });

      return [...prevDias, ...diasAdicionais];
    });
    setBancasHorarios(bancasHorarios);
  }

  return (
    <View style={{ flex: 1, flexDirection: "column",padding:20,minHeight:height - 125}}>
      
      {/* Seção de Extrações Selecionadas */}
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
          onPress={() => [listBancasHorarios(), setExtracoesModalVisibile(true), console.log(diasExtracoes)]}
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

      {/* Seção de Pule */}
      <View style={{borderWidth:1,borderColor:Colors.azulescuro,marginBottom:20,borderRadius:7,padding:10,paddingBottom:40}}>
        {/* Titulo da Seção */}
        <Text style={{fontWeight:'bold', fontSize:RFValue(16), marginBottom:12}}>2. 🎮 Jogos</Text>
        {/* Botão para iniciar o Modal*/}
        <Pressable
          disabled={Object.keys(bancasHorariosSelecionados).length === 0} 
          onPress={() => [
            setNumerosSelecionados([]),
            setPremiosSelecionados([]),
            setValorSelecionado(0),
            setSeparacaoSelecionada('Todos'),
            setEtapasPule((prev) => {
                return prev.map((etapa, i) => ({
                  ...etapa,
                  atual: i === 0,    // só a primeira etapa é atual
                  feita: false       // todas ficam como não feitas
                }))
              }),
            setPuleModalVisible(true)
          ]}
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
        {/* Modal para Seleção de Bancas e Horários */}
        <Modal
          visible={puleModalVisible}
          transparent={true} 
          animationType="slide"
          onRequestClose={() => setPuleModalVisible(false)} 
        >
          
          <View style={{ flex: 1,backgroundColor: 'rgba(0, 0, 0, 0.5)',padding:15,alignItems:'center',}}>
            <View style={{maxWidth:1200, width:'100%', backgroundColor:'rgba(22, 26, 29,0.0)',paddingVertical:4, flex:1}}>
              {/* Botão para fechar o Modal */}
              <Pressable
                onPress={() => setPuleModalVisible(false)}
                style = {{backgroundColor:Colors.azulMedio, alignSelf:'flex-end', padding:5, borderRadius:20, width:35}}
              >
                <X color={Colors.branco} />
              </Pressable>

              {/* Conteúdo do Modal */}
              <View style={{maxWidth:1200, width:'100%', borderColor:Colors.azulClaro,borderWidth:1,borderRadius:7,flex:1}}>
                {/* Acompanhamento de Etapas */}
                <View style={{flex:0.125, backgroundColor: Colors.azulEscuro,borderTopLeftRadius:7,borderTopRightRadius:7}}>
                  <View style={{flex:1, flexDirection:'row', paddingVertical:15,paddingHorizontal:10, justifyContent:'center', alignItems:'center'}}>
                    {etapasPule.map((etapa, index) => (
                      <View key={index} style={{flex:1, justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                        {/* Bolinha Indicativa*/}
                        <View style={{flex:1,borderRadius:20,backgroundColor: etapa.atual || etapa.feita ? Colors.azulescuro: Colors.cinzaClaro,padding:5}}>
                          <View style={{borderRadius:20,padding: etapa.feita? 0 : etapa.atual? 10: 7,borderColor:Colors.branco,borderWidth:2, backgroundColor: etapa.feita ? Colors.branco : 'transparent'}}>
                            {etapa.feita ? 
                              (<Check color={Colors.azulEscuro} style={{width: 20, height: 20}} />)
                              :
                              (null)
                            }
                          </View>
                        </View>
                        {/* Título da Etapa */}
                        <Text style={{color: Colors.branco}}>{etapa.titulo}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/*Conteúdo Principal*/}
                <View style={{flex:1, backgroundColor: Colors.azulescuro}}>
                  {
                    etapaPuleAtual?.titulo === 'Modalidade' ? (
                      <Modalidades modalidades={modalidades} setModalidades={setModalidades} />
                    ) :
                    etapaPuleAtual?.titulo === 'Jogo' ? (
                      <Jogo modalidade={modalidadeSelecionada} digitos={['0','0','0','0']} numeros_selecionados={numerosSelecionados} setNumerosSelecionados={setNumerosSelecionados} />
                    ) :
                    etapaPuleAtual?.titulo === 'Prêmio' ? (
                      <Premio numerosSelecionados={numerosSelecionados} premiosSelecionados={premiosSelecionados} setPremiosSelecionados={setPremiosSelecionados} />
                    ) :
                    etapaPuleAtual?.titulo === 'Valor' ? (
                      <Valor valorSelecionado={valorSelecionado} setValorSelecionado={setValorSelecionado} separacaoSelecionada={separacaoSelecionada} setSeparacaoSelecionada={setSeparacaoSelecionada} />
                    ) :
                    null     
                  }
                </View>
                
                {/* Navegação de Etapas */}
                <View style={{flex:0.1, backgroundColor: Colors.azulEscuro,borderBottomLeftRadius:7,borderBottomRightRadius:7}}>
                  <View style={{flex:1, paddingVertical:15,paddingHorizontal:50, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                    {/* Voltar Etapa */}
                    <Pressable
                      onPress={() => 
                        setEtapasPule((prev) => {
                          const index = prev.findIndex((etapa) => etapa.atual);
                          if (index === 0) return prev;

                          return prev.map((etapa, i) => ({
                            ...etapa,
                            feita: i === index ? false : etapa.feita,
                            atual: i === index - 1, 
                          }))
                        })
                      }
                      style={({ pressed }) => [{backgroundColor:Colors.azulescuro,padding:10,borderRadius:5}]}
                    >
                      <Text style={{color: Colors.branco,fontSize:RFValue(11)}}>Voltar</Text>
                    </Pressable>

                    {/* Próxima Etapa */}
                    <Pressable
                      disabled={
                        proximaEtapaPuleDisabled
                      }
                      onPress={() =>
                        setEtapasPule((prev) => {
                          const index = prev.findIndex((etapa) => etapa.atual)
                          if (index === -1 || index === prev.length - 1) {
                            console.log(bancasHorariosSelecionados);
                            setApostas((apostasAnteriores) => [
                              ...apostasAnteriores,
                              {
                                extracao: {
                                  nome_banca: Object.keys(bancasHorariosSelecionados)[0],
                                  horario: bancasHorariosSelecionados[Object.keys(bancasHorariosSelecionados)[0]][0],
                                  data: diaSelecionado
                                },
                                modalidade: modalidadeSelecionada,
                                numeros_selecionados: numerosSelecionados,
                                premios_selecionados: premiosSelecionados,
                                valor: valorSelecionado,
                                separacao: separacaoSelecionada
                              }
                            ]);
                            setPuleModalVisible(false);
                            return prev;
                          }

                          return prev.map((etapa, i) => ({
                            ...etapa,
                            feita: i === index ? true : etapa.feita,
                            atual: i === index + 1, 
                          }))
                        })
                      }
                      style={({ pressed }) => [{backgroundColor: proximaEtapaPuleDisabled ? Colors.cinzaClaro : Colors.azulescuro, padding:10, borderRadius:5}]}
                    >
                      <Text style={{color: Colors.branco,fontSize:RFValue(11)}}>Próximo</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>   

      {/* Seção de Boletim de Apostas */}
      <View style={{ borderWidth: 1, borderColor: Colors.azulescuro, marginBottom: 20, borderRadius: 7, padding: 10, paddingBottom: 40 }}>
        <Text style={{ fontWeight: 'bold', fontSize: RFValue(16), marginBottom: 12 }}>3. Boletim de Apostas</Text>

        {apostas.length === 0 ? (
          <View style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: Colors.azulescuro, padding: 10, borderRadius: 5 }}>
            <Text style={{ fontSize: RFValue(12), color: Colors.azulescuro, textAlign: 'center', fontWeight: 'bold' }}>🎯 Nenhum Jogo Feito</Text>
          </View>
        ) : (
          <FlatList
            data={apostas}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item, index }) => (
              <View style={{ borderWidth: 1, borderColor: Colors.azulescuro, borderRadius: 5, padding: 10, backgroundColor: Colors.azulEscuro, position: 'relative' }}>
                
                {/* Botão para remover a aposta */}
                
                <View style ={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                  <Text style={{ color: Colors.branco, fontWeight: 'bold', fontSize: RFValue(12) }}>
                    {item.extracao.nome_banca} - {item.extracao.data.toLocaleDateString('pt-BR')} - {item.extracao.horario}
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.azulescuro, // ou outra cor
                      borderRadius:5,
                      width: 24,
                      height: 24,
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 10,
                    }}
                    onPress={() => setApostas(prev => prev.filter((_, i) => i !== index))} // Função que você deve criar
                  >
                    <X color={Colors.branco} width={16} height={16} />
                  </TouchableOpacity>
                </View>
               
                <Text style={{ color: Colors.branco, fontSize: RFValue(11), marginTop: 2 }}>Modalidade: {item.modalidade.nome}</Text>
                <Text style={{ color: Colors.branco, fontSize: RFValue(11), marginTop: 2 }}>
                  Números: {item.numeros_selecionados.join(', ')}
                </Text>
                <Text style={{ color: Colors.branco, fontSize: RFValue(11), marginTop: 2 }}>
                  Prêmios: {item.premios_selecionados.join(', ')}
                </Text>
                <Text style={{ color: Colors.branco, fontSize: RFValue(11), marginTop: 2 }}>
                  Separação: {item.separacao}
                </Text>
                <Text style={{ color: Colors.branco, fontSize: RFValue(12), marginTop: 2 , fontWeight: 'bold' }}>
                  Valor Total: R$ {
                    item.separacao === 'Todos' ? 
                      (item.valor.toFixed(2))
                      : 
                      (item.valor * item.numeros_selecionados.length * item.premios_selecionados.length).toFixed(2)
                  }
                </Text>
              </View>
            )}
          />

        )}

        {/* Botão Realizar Apostas */}
        {apostas.length > 0 && (
          <Pressable
            onPress={() => {
              const acess_token = localStorage.getItem('access_token');
              fetch(`${API_BASE_URL}/bets/create_new_bet`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${acess_token}`,
                },
                body: JSON.stringify({ 'apostas': apostas }),
              })
                .then((response) => response.json())
                .then((data) => {
                  if(data.success){
                    Alert.alert('Sucesso', 'Apostas realizadas com sucesso!');
                    setApostas([]);
                  }
                  else{
                    Alert.alert('Erro', 'Houve um erro ao realizar as apostas. Tente novamente.');
                  }
                  
                })
                .catch((error) => {
                  console.error('Erro ao realizar apostas:', error);
                });
            }}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? Colors.azulMedio : Colors.azulescuro,
                paddingVertical: 12,
                borderRadius: 5,
                marginTop: 15,
                alignItems: 'center',
              },
            ]}
          >
            <Text style={{ color: Colors.branco, fontWeight: 'bold', fontSize: RFValue(14) }}>Realizar Apostas</Text>
          </Pressable>
        )}
      </View>

    </View>
  );
};

export default Jogar;
