const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000'; // Substitua pela URL real

export const createNewBet = async (data: {
    possible_bet: string;
    amount_in_cents: number;
    category: string;
    sorteios:string;
    tipo:string;
    numbers: string;
    token: string;
}) => {
  try {
    // Separar o token dos dados para envio
    const { token, ...betData } = data;
    
    const response = await fetch(`${API_BASE_URL}/bets/create_new_bet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      // Enviar apenas os dados da aposta, não o token
      body: JSON.stringify(betData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Pega do backend diretamente
      const message = errorData.message || errorData.detail || `Erro HTTP ${response.status}`;
      throw new Error(message);
    }

    return await response.json();
  } catch (err: any) {
    // Melhor tratamento do erro para evitar [object Object]
    const errorMessage = err.message || err.toString() || 'Erro desconhecido na API';
    console.error('Erro na chamada da API:', errorMessage);
    throw new Error(errorMessage);
  }
};