import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { Colors } from '@/styles/colors';
import { ButtonPrimary, ButtonSecundary } from '@/components/Components';

interface CarteiraModalProps {
  visible: boolean;
  onClose: () => void;
  currentBalance: number;
  onDeposit: (amount: number) => Promise<void>;
  onWithdraw: (amount: number) => Promise<void>;
}

const CarteiraModal: React.FC<CarteiraModalProps> = ({
  visible,
  onClose,
  currentBalance,
  onDeposit,
  onWithdraw
}) => {
  const [activeTab, setActiveTab] = useState<'depositar' | 'sacar'>('depositar');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const formatCurrency = (value: number) => {
    return (value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const parseAmount = (text: string): number => {
    const cleanText = text.replace(/[^\d,]/g, '').replace(',', '.');
    return Math.round(parseFloat(cleanText || '0') * 100);
  };

  const handleConfirm = async () => {
    const amountInCents = parseAmount(amount);
    
    if (amountInCents <= 0) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }

    if (activeTab === 'sacar' && amountInCents > currentBalance) {
      Alert.alert('Erro', 'Saldo insuficiente');
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'depositar') {
        await onDeposit(amountInCents);
        Alert.alert('Sucesso', 'Depósito realizado com sucesso!');
      } else {
        await onWithdraw(amountInCents);
        Alert.alert('Sucesso', 'Saque realizado com sucesso!');
      }
      setAmount('');
      onClose();
    } catch (error) {
      Alert.alert('Erro', `Erro ao ${activeTab}: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Carteira</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Saldo atual */}
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Saldo atual:</Text>
            <Text style={styles.balanceValue}>{formatCurrency(currentBalance)}</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'depositar' && styles.activeTab]}
              onPress={() => setActiveTab('depositar')}
            >
              <Text style={[styles.tabText, activeTab === 'depositar' && styles.activeTabText]}>
                Depositar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'sacar' && styles.activeTab]}
              onPress={() => setActiveTab('sacar')}
            >
              <Text style={[styles.tabText, activeTab === 'sacar' && styles.activeTabText]}>
                Sacar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            <Text style={styles.inputLabel}>
              Valor para {activeTab}:
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currency}>R$</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="0,00"
                placeholderTextColor={Colors.cinzaClaro}
                keyboardType="numeric"
              />
            </View>

            {/* Valores rápidos */}
            <View style={styles.quickValues}>
              {[10, 20, 50, 100].map(value => (
                <TouchableOpacity
                  key={value}
                  style={styles.quickButton}
                  onPress={() => setAmount(value.toString())}
                >
                  <Text style={styles.quickButtonText}>R$ {value}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Botões de ação */}
            <View style={styles.actionButtons}>
              <ButtonSecundary
                text="Cancelar"
                onClick={onClose}
                size={14}
              />
              <ButtonPrimary
                text={loading ? 'Processando...' : activeTab.toUpperCase()}
                onClick={handleConfirm}
                size={14}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.azulescuro,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: Colors.amarelo,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.amarelo,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.amarelotransparente,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: Colors.amarelo,
    fontSize: 18,
    fontWeight: 'bold',
  },
  balanceContainer: {
    backgroundColor: Colors.azulclarotransparente,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  balanceLabel: {
    color: Colors.cinzaClaro,
    fontSize: 14,
  },
  balanceValue: {
    color: Colors.branco,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.azulclarotransparente,
    borderRadius: 8,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.amarelo,
    borderRadius: 8,
  },
  tabText: {
    color: Colors.cinzaClaro,
    fontWeight: '600',
  },
  activeTabText: {
    color: Colors.azulescuro,
    fontWeight: 'bold',
  },
  form: {
    gap: 16,
  },
  inputLabel: {
    color: Colors.branco,
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.azulclarotransparente,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.bordaamarelotransparente,
    paddingHorizontal: 12,
    height: 50,
  },
  currency: {
    color: Colors.cinzaClaro,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: Colors.branco,
    fontSize: 16,
    fontWeight: '600',
  },
  quickValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: Colors.azulclarotransparente,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.bordaamarelotransparente,
    alignItems: 'center',
  },
  quickButtonText: {
    color: Colors.amarelo,
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});

export default CarteiraModal;
