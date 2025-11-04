const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface DepositRequest {
  amount_in_cents: number;
}

export interface WithdrawRequest {
  amount_in_cents: number;
}

export const depositMoney = async (amount_in_cents: number): Promise<any> => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const response = await fetch(`${API_BASE_URL}/wallet/depositar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ amount_in_cents }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao realizar depósito');
  }

  return response.json();
};

export const withdrawMoney = async (amount_in_cents: number): Promise<any> => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const response = await fetch(`${API_BASE_URL}/wallet/sacar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ amount_in_cents }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao realizar saque');
  }

  return response.json();
};

export const getTransactionHistory = async (limit: number = 50): Promise<any> => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const response = await fetch(`${API_BASE_URL}/wallet/historico?limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao buscar histórico');
  }

  return response.json();
};

export const getBalance = async (): Promise<any> => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const response = await fetch(`${API_BASE_URL}/wallet/saldo`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao buscar saldo');
  }

  return response.json();
};
