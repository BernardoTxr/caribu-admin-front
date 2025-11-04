const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL; // Substitua pela URL real

export const registerUser = async (userData: {
  password: string;
  email: string;
  cpf: string;
  telefone: string;
  tipo_chave_pix: string;
  chave_pix: string;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
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

export const loginUser = async (data: {
  emailOrCpf: string;
  password: string;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: 'include', // temporariamente removido para desenvolvimento local
      body: JSON.stringify(data),
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

export const verifyToken = async () => {
  /* TODO:
  1. Pensar em como fazer quando for MOBILE
  */
  try{
    const token = localStorage.getItem("access_token"); // WEB - corrigido para access_token
    if(!token){
      return false;
    }
    else{
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return response.json();
      }
      return response.json(); // Retorna true se o token existe
    }
    
  }
  catch (error) {
    console.error("Erro ao verificar token:", error);
    return false; // Retorna false em caso de erro
  }
};

export const forgotPassword = async (data: { email: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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

export const resetPassword = async (data: { new_password: string; token: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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

export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      // credentials: 'include', // temporariamente removido para desenvolvimento local
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

