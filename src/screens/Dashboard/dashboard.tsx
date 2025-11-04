// Dashboard.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Platform, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; // Para o gráfico de linhas

// --- 1. Dados Mockados ---

// Dados mockados para Saques e Depósitos por dia
interface DailyData {
  date: string; // Ex: '2023-10-26'
  deposits: number;
  withdrawals: number;
  userEmail?: string; // Opcional, para filtrar por usuário
}

// Geração de dados mockados para 30 dias com alguns usuários específicos
const generateMockData = (): DailyData[] => {
  const data: DailyData[] = [];
  const today = new Date();

  const specificUsers = [
    'user1@example.com', 
    'user2@example.com', 
    'user3@example.com'
  ];

  for (let i = 29; i >= 0; i--) { // Últimos 30 dias
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];

    // Dados gerais
    data.push({
      date: formattedDate,
      deposits: Math.floor(Math.random() * 500) + 100, // entre 100 e 600
      withdrawals: Math.floor(Math.random() * 300) + 50, // entre 50 e 350
    });

    // Adiciona alguns dados para usuários específicos em alguns dias
    if (i % 5 === 0) { // A cada 5 dias para o user1
      data.push({
        date: formattedDate,
        deposits: Math.floor(Math.random() * 100) + 200,
        withdrawals: Math.floor(Math.random() * 50) + 10,
        userEmail: specificUsers[0],
      });
    }
    if (i % 7 === 0) { // A cada 7 dias para o user2
      data.push({
        date: formattedDate,
        deposits: Math.floor(Math.random() * 80) + 150,
        withdrawals: Math.floor(Math.random() * 40) + 5,
        userEmail: specificUsers[1],
      });
    }
     if (i % 3 === 0) { // A cada 3 dias para o user3
      data.push({
        date: formattedDate,
        deposits: Math.floor(Math.random() * 120) + 100,
        withdrawals: Math.floor(Math.random() * 60) + 20,
        userEmail: specificUsers[2],
      });
    }
  }
  return data;
};

const ALL_MOCK_DATA = generateMockData();

// --- 2. Funções Auxiliares de Cálculo ---

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// --- 3. Componente Dashboard ---

const Dashboard = () => {
  const [filterEmail, setFilterEmail] = useState<string>('');
  
  // Filtrar os dados com base no email, se houver
  const filteredData = useMemo(() => {
    if (!filterEmail) {
      // Quando não há filtro, consideramos apenas os dados gerais (sem userEmail) ou somamos
      // Para este exemplo, vamos simplificar e considerar os dados gerais.
      // Em uma aplicação real, você faria um sumário de todos os dados ou carregaria dados específicos.
      const aggregatedData: Record<string, { deposits: number; withdrawals: number }> = {};
      ALL_MOCK_DATA.forEach(item => {
        if (!item.userEmail || item.userEmail.toLowerCase() === filterEmail.toLowerCase()) {
            if (!aggregatedData[item.date]) {
                aggregatedData[item.date] = { deposits: 0, withdrawals: 0 };
            }
            aggregatedData[item.date].deposits += item.deposits;
            aggregatedData[item.date].withdrawals += item.withdrawals;
        }
      });
      return Object.keys(aggregatedData).map(date => ({
        date,
        deposits: aggregatedData[date].deposits,
        withdrawals: aggregatedData[date].withdrawals,
      })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    } else {
        // Filtra estritamente pelo userEmail, combinando com dados gerais daquele dia se existirem
        const userSpecificData: Record<string, { deposits: number; withdrawals: number }> = {};
        ALL_MOCK_DATA.filter(item => 
                !item.userEmail || item.userEmail.toLowerCase() === filterEmail.toLowerCase()
            ).forEach(item => {
                if (!userSpecificData[item.date]) {
                    userSpecificData[item.date] = { deposits: 0, withdrawals: 0 };
                }
                userSpecificData[item.date].deposits += item.deposits;
                userSpecificData[item.date].withdrawals += item.withdrawals;
            });
        return Object.keys(userSpecificData).map(date => ({
            date,
            deposits: userSpecificData[date].deposits,
            withdrawals: userSpecificData[date].withdrawals,
        })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
  }, [filterEmail]);

  // Preparar dados para o gráfico
  const chartLabels = filteredData.map(d => d.date.slice(5)); // Ex: '10-26'
  const depositData = filteredData.map(d => d.deposits);
  const withdrawalData = filteredData.map(d => d.withdrawals);

  // --- Cálculo de Métricas (Direita do Gráfico) ---
  const calculateMetrics = (data: DailyData[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera hora para comparação de datas

    let totalDeposits7Days = 0;
    let totalWithdrawals7Days = 0;
    let totalDeposits30Days = 0;
    let totalWithdrawals30Days = 0;

    data.forEach(item => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(today.getTime() - itemDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) {
        totalDeposits7Days += item.deposits;
        totalWithdrawals7Days += item.withdrawals;
      }
      if (diffDays <= 30) {
        totalDeposits30Days += item.deposits;
        totalWithdrawals30Days += item.withdrawals;
      }
    });

    const revenue7Days = totalDeposits7Days - totalWithdrawals7Days;
    const revenue30Days = totalDeposits30Days - totalWithdrawals30Days;
    const avgDailyRevenue = revenue30Days / 30; // Média dos últimos 30 dias

    return {
      revenue7Days,
      revenue30Days,
      avgDailyRevenue,
      totalDeposits7Days,
      totalWithdrawals7Days
    };
  };

  const metrics = useMemo(() => calculateMetrics(filteredData), [filteredData]);

  // Dimensões da tela para o gráfico (ajusta para web/mobile)
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Platform.OS === 'web' ? screenWidth * 0.55 : screenWidth * 0.9;
  const metricsWidth = Platform.OS === 'web' ? screenWidth * 0.35 : screenWidth * 0.9;


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Filtro de Usuário */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filtrar por email do usuário (ex: user1@example.com)"
          placeholderTextColor="#888"
          value={filterEmail}
          onChangeText={setFilterEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TouchableOpacity 
            style={styles.clearFilterButton} 
            onPress={() => setFilterEmail('')}
            disabled={!filterEmail}
        >
            <Text style={styles.clearFilterText}>Limpar Filtro</Text>
        </TouchableOpacity>
      </View>

      {/* Gráfico e Métricas Lado a Lado (ou empilhados no Mobile) */}
      <View style={styles.chartAndMetricsWrapper}>
        {/* Gráfico de Saques/Depósitos */}
        <View style={[styles.chartContainer, Platform.OS === 'web' && { width: chartWidth }]}>
          <Text style={styles.chartTitle}>Saques e Depósitos (Últimos 30 Dias)</Text>
          {filteredData.length > 0 ? (
            <LineChart
              data={{
                labels: chartLabels.filter((_, i) => i % 5 === 0), // Mostra a cada 5 labels para não sobrepor
                datasets: [
                  {
                    data: depositData,
                    color: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`, // Verde para Depósitos
                    strokeWidth: 2,
                  },
                  {
                    data: withdrawalData,
                    color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`, // Vermelho para Saques
                    strokeWidth: 2,
                  },
                ],
                legend: ['Depósitos', 'Saques']
              }}
              width={Platform.OS === 'web' ? chartWidth : screenWidth * 0.9} // Largura do gráfico
              height={300}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0, // Sem casas decimais para quantidades
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '1',
                  stroke: '#ffa726',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          ) : (
            <Text style={styles.noDataText}>Nenhum dado para exibir com este filtro.</Text>
          )}
        </View>

        {/* Métricas à Direita */}
        <View style={[styles.metricsContainer, Platform.OS === 'web' && { width: metricsWidth }]}>
          <MetricCard title="Receita (Últimos 7 Dias)" value={formatCurrency(metrics.revenue7Days)} color="#1e3a8a" />
          <MetricCard title="Receita (Últimos 30 Dias)" value={formatCurrency(metrics.revenue30Days)} color="#1e3a8a" />
          <MetricCard title="Receita Média Diária (30 Dias)" value={formatCurrency(metrics.avgDailyRevenue)} color="#1e3a8a" />
          <MetricCard title="Total Depósitos (7 Dias)" value={formatCurrency(metrics.totalDeposits7Days)} color="#1e3a8a" />
          <MetricCard title="Total Saques (7 Dias)" value={formatCurrency(metrics.totalWithdrawals7Days)} color="#1e3a8a" />
        </View>
      </View>
    </ScrollView>
  );
};

// Componente auxiliar para os cards de métricas
const MetricCard = ({ title, value, color }: { title: string; value: string; color: string }) => (
  <View style={[styles.metricCard, { backgroundColor: color }]}>
    <Text style={styles.metricTitle}>{title}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

// --- 4. Estilos ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50, // Espaço extra para ScrollView
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  filterInput: {
    flex: Platform.OS === 'web' ? 1 : undefined,
    width: Platform.OS === 'web' ? undefined : '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: Platform.OS === 'web' ? 10 : 0,
    marginBottom: Platform.OS === 'web' ? 0 : 10,
    color: '#333',
  },
  clearFilterButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chartAndMetricsWrapper: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'flex-start' : 'center',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  metricsContainer: {
    flexDirection: Platform.OS === 'web' ? 'column' : 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: Platform.OS === 'web' ? '100%' : '48%', // 2 cards por linha no mobile
  },
  metricTitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  noDataText: {
    textAlign: 'center',
    paddingVertical: 50,
    color: '#888',
    fontSize: 16,
  },
});

export default Dashboard;