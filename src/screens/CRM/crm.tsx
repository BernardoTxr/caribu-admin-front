// CRM.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { UserPlus, Gift, TrendingUp, DollarSign } from 'lucide-react-native'; // Ícones para as fases

// --- 1. Dados Mockados ---

// Definição das Fases do Funil
type FunnelPhaseKey = 'cadastro' | 'promocional' | 'aposta' | 'saldo_real';

const FUNNEL_PHASES: { key: FunnelPhaseKey; label: string; icon: any }[] = [
  { key: 'cadastro', label: 'Com Cadastro', icon: UserPlus },
  { key: 'promocional', label: 'C/ Saldo Promocional', icon: Gift },
  { key: 'aposta', label: 'Realizou Aposta', icon: TrendingUp },
  { key: 'saldo_real', label: 'C/ Saldo Real', icon: DollarSign },
];

const MOCK_FUNNEL_DATA: Record<FunnelPhaseKey, number> = {
  cadastro: 387,
  promocional: 292,
  aposta: 142,
  saldo_real: 36,
};

// Dados detalhados para a tabela (Mock)
const MOCK_LEAD_DETAILS: Record<FunnelPhaseKey, { id: number; email: string; telefone: string }[]> = {
  cadastro: [
    { id: 1, email: "ana.c@email.com", telefone: "(11) 98765-4321" },
    { id: 2, email: "bruno.a@email.com", telefone: "(21) 99876-5432" },
    { id: 3, email: "carlos.m@email.com", telefone: "(31) 97654-3210" },
    // Adicione mais dados para diferenciar a lista...
    { id: 4, email: "diana.f@email.com", telefone: "(11) 99123-4567" },
    { id: 5, email: "eduardo.s@email.com", telefone: "(41) 98234-5678" },
  ],
  promocional: [
    { id: 1, email: "ana.c@email.com", telefone: "(11) 98765-4321" },
    { id: 2, email: "bruno.a@email.com", telefone: "(21) 99876-5432" },
    { id: 6, email: "fernanda.p@email.com", telefone: "(51) 96321-7890" },
    { id: 7, email: "gabriel.l@email.com", telefone: "(71) 95432-1098" },
    { id: 8, email: "helena.r@email.com", telefone: "(81) 94567-8901" },
  ],
  aposta: [
    { id: 1, email: "ana.c@email.com", telefone: "(11) 98765-4321" },
    { id: 9, email: "igor.t@email.com", telefone: "(91) 93210-9876" },
    { id: 10, email: "juliana.q@email.com", telefone: "(61) 91098-7654" },
  ],
  saldo_real: [
    { id: 1, email: "ana.c@email.com", telefone: "(11) 98765-4321" },
    { id: 11, email: "klaus.v@email.com", telefone: "(85) 92345-6789" },
  ],
};


const CRM = () => {
  // Estado para controlar qual fase está selecionada para a tabela
  const [selectedPhase, setSelectedPhase] = useState<FunnelPhaseKey>('cadastro');

  // Dados da tabela a serem exibidos com base na fase selecionada
  const tableData = MOCK_LEAD_DETAILS[selectedPhase];
  const selectedPhaseLabel = FUNNEL_PHASES.find(p => p.key === selectedPhase)?.label || '';

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
      {/* -------------------- FUNIL DE LEADS (TOPO) -------------------- */}
      <View style={styles.funnelContainer}>
        <Text style={styles.funnelTitle}>Funil de Engajamento de Clientes</Text>
        
        <View style={styles.funnelSteps}>
          {FUNNEL_PHASES.map((phase, index) => {
            const count = MOCK_FUNNEL_DATA[phase.key];
            const IconComponent = phase.icon;
            
            // Calcula a largura proporcional para simular o funil (opcional)
            const baseWidth = MOCK_FUNNEL_DATA.cadastro;
            const widthPercentage = (count / baseWidth) * 100;
            const widthStyle = Platform.OS === 'web' ? { width: `${widthPercentage}%` } : { flex: 1 };


            return (
              <TouchableOpacity
                key={phase.key}
                style={[
                  styles.funnelStep, 
                  phase.key === selectedPhase && styles.funnelStepSelected,
                  // Estilo para simular o formato de funil (mais estreito no topo)
                  Platform.OS === 'web' && { width: `calc(${widthPercentage}% + 100px)` } 
                ]}
                onPress={() => setSelectedPhase(phase.key)}
              >
                <View style={styles.funnelContent}>
                  <IconComponent size={24} color="#FFF" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.funnelCount}>{count}</Text>
                    <Text style={styles.funnelLabel}>{phase.label}</Text>
                  </View>
                </View>
                
                {/* Ícone de seta para mobile */}
                {index < FUNNEL_PHASES.length - 1 && Platform.OS !== 'web' && (
                    <Text style={styles.arrow}>↓</Text>
                )}

              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* -------------------- TABELA DINÂMICA (ABAIXO) -------------------- */}
      <View style={styles.tableSection}>
        <Text style={styles.tableTitle}>Detalhes da Fase: {selectedPhaseLabel} ({tableData.length} Clientes)</Text>

        {/* Tabela Header */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableHeader, { flex: 0.2 }]}>ID</Text>
          <Text style={[styles.tableCell, styles.tableHeader, { flex: 0.4 }]}>Email</Text>
          <Text style={[styles.tableCell, styles.tableHeader, { flex: 0.4 }]}>Telefone</Text>
        </View>

        {/* Tabela Body */}
        {tableData.length > 0 ? (
          tableData.map((lead) => (
            <View key={lead.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 0.2 }]}>{lead.id}</Text>
              <Text style={[styles.tableCell, { flex: 0.4 }]}>{lead.email}</Text>
              <Text style={[styles.tableCell, { flex: 0.4 }]}>{lead.telefone}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>Nenhum lead nesta fase.</Text>
        )}
      </View>
    </ScrollView>
  );
};

// --- 2. Estilos ---

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
  },
  
  // --- Estilos do Funil ---
  funnelContainer: {
    marginBottom: 30,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  funnelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  funnelSteps: {
    flexDirection: Platform.OS === 'web' ? 'column' : 'column', // Empilha verticalmente
    alignItems: 'center',
    width: '100%',
  },
  funnelStep: {
    backgroundColor: '#007bff', // Cor padrão
    padding: 15,
    borderRadius: 8,
    marginBottom: Platform.OS === 'web' ? 10 : 20, // Espaço entre os itens
    width: Platform.OS === 'web' ? '80%' : '100%', // Largura inicial
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    // Estilo de funil (trapezóide) é difícil de fazer apenas com View/Flex em RN,
    // mas o alinhamento e as cores já dão a ideia.
  },
  funnelStepSelected: {
    backgroundColor: '#28a745', // Cor quando selecionado (Verde)
    borderWidth: 2,
    borderColor: '#1e7e34',
  },
  funnelContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  funnelCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  funnelLabel: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 2,
  },
  arrow: {
    fontSize: 20,
    color: '#555',
    alignSelf: 'center',
    marginTop: -10, // Move para cima para sobrepor um pouco
  },
  
  // --- Estilos da Tabela ---
  tableSection: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    fontSize: 14,
    color: '#555',
    paddingHorizontal: 5,
  },
  tableHeader: {
    fontWeight: 'bold',
    color: '#000',
  },
  noDataText: {
    textAlign: 'center',
    padding: 20,
    color: '#888',
  }
});

export default CRM;