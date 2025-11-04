// AppDrawerNavigator.tsx

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from '../screens/Dashboard/dashboard';
import CRM from '../screens/CRM/crm';
import AlterarParametros from '../screens/AlterarParametros/alterarparametros';

const Drawer = createDrawerNavigator();

export default function AppDrawerNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: true }}>
      <Drawer.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{ title: 'Dashboard' }} 
      />
        <Drawer.Screen
        name="CRM"
        component={CRM}
        options={{ title: 'CRM' }}
      />
        <Drawer.Screen
        name="Alterar Parametros"
        component={AlterarParametros}
        options={{ title: 'Alterar Parâmetros' }}
      />
    </Drawer.Navigator>
  );
}