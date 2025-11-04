const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000'; // Substitua pela URL real

export const getUserBets = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bets/my_bets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Pega do backend diretamente
      const message = errorData.message || errorData.detail || 'Erro desconhecido';
      throw new Error(message);
    }

    return await response.json();
  } catch (err: any) {
    console.error('Erro na chamada da API:', err);
    throw err;
  }
};