import { useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { verifyToken } from '@/app/services/auth'; 

export const useVerifyToken = async () => {
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const checkAuth = async () => {
        try {
          await verifyToken(); // verifica o token via cookie
        } catch (error) {
          console.error('Token inválido ou expirado. Redirecionando...');
          router.push('/login'); // redireciona para a página de login
        }
      };

      checkAuth();
    }, [router])
  );
};
