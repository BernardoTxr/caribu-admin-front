import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login/Login";
import AppDrawerNavigator from "./AppDrawerNavigator";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen 
            name="App" 
            component={AppDrawerNavigator} // <--- O Drawer entra aqui
        />
    </Stack.Navigator>
  );
}
