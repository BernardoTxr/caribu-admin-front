import React, { createContext, useContext, ReactNode } from 'react';

interface UserData {
  email?: string;
  balance_in_cents?: number;
  nome?: string;
  id?: string | number;
  [key: string]: any; // Para outras propriedades que possam existir
}

interface UserDataContextType {
  userData: UserData | null;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

interface UserDataProviderProps {
  children: ReactNode;
  userData: UserData | null;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children, userData }) => {
  return (
    <UserDataContext.Provider value={{ userData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

export type { UserData };
export default UserDataProvider;
