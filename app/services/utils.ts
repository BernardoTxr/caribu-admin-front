const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000'; // Substitua pela URL real

export const getUserDetails = async () => {
  try {
    // Pegar o token do localStorage
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('Token de acesso não encontrado');
    }

    const response = await fetch(`${API_BASE_URL}/bets/user_details`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Enviar token no header
      },
      // Removido credentials: 'include' para evitar problemas de CORS
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