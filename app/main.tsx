import React, { useState, useCallback, useEffect } from "react";
import { useSideBar } from "@/components/contexts/SideBarContext";
import {
  View,
  Text,
  Platform,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  useWindowDimensions
} from "react-native";
import {
  SideBarMobile,
  SideBar,
  ButtonPrimary,
  ButtonSecundary,
  Menu,
  MainContentController,
} from "@/components/Components";
import { Colors } from "@/styles/colors";
import { useFocusEffect, useRouter } from "expo-router";
import mainStyles from "@/styles/main";
import Footer from "@/components/Footer";
import { logoutUser,verifyToken } from "./services/auth";
import { getUserDetails } from "./services/utils";
import { depositMoney, withdrawMoney } from "./services/wallet";
import UserProfile from "@/components/UserProfile";
import { UserDataProvider, UserData } from "@/components/contexts/UserDataContext";
import CarteiraModal from "@/components/CarteiraModal";

const Main = () => {
  const [selectedMenu, setSelectedMenu] = useState("Main");
  const { toggleSidebar } = useSideBar();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userBalance, setUserBalance] = useState(0);
  const [carteiraModalVisible, setCarteiraModalVisible] = useState(false);
  const {width } = useWindowDimensions();
  const isMobile = width < 768; // Exemplo de breakpoint para mobile

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === "web") document.title = "Caribú Loterias";
    }, [])
  );

  useEffect(() => {
      verifyToken().then((data) => {
        if (!data) {
          setIsAuthenticated(false);
        }
        else{
          setUserData(data);
          setIsAuthenticated(true);
          
          // Buscar dados completos do usuário incluindo saldo
          getUserDetails().then((userDetails) => {
            setUserBalance(userDetails.balance_in_cents || 0);
          }).catch((error) => {
            console.error('Erro ao buscar saldo:', error);
            setUserBalance(0);
          });
        }
      });
  },[]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login");
    } catch (error) {
      window.alert("Erro ao fazer logout. Tente novamente.");
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleDeposit = async (amount: number) => {
    try {
      await depositMoney(amount);
      // Atualizar saldo após depósito
      const userDetails = await getUserDetails();
      if (userDetails && userDetails.balance_in_cents) {
        setUserBalance(userDetails.balance_in_cents);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleWithdraw = async (amount: number) => {
    try {
      await withdrawMoney(amount);
      // Atualizar saldo após saque
      const userDetails = await getUserDetails();
      if (userDetails && userDetails.balance_in_cents) {
        setUserBalance(userDetails.balance_in_cents);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>

      {/* container raiz em coluna */}
      <View style={[mainStyles.container, { flex: 1 }]}>
        
        {/* Topbar */}
        <View style={mainStyles.topBar}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 24, height: "100%" }}>
            {isMobile ? (
              // --- Layout para CELULAR ---
              <View style={{ flexDirection: "column", alignItems: "center", gap: 0 }}>
                <Image
                  source={require("@/assets/images/symbol.png")}
                  style={[mainStyles.logo, { width: 32, height: 32 ,marginTop:4}]}
                />
                <Text
                  style={{
                    fontFamily: "Segoe UI",
                    fontWeight: "bold",
                    fontSize: 20,
                    color: "#FFDE59",
                  }}
                >
                  CARIBÚ
                </Text>
              </View>
            ) : (
              // --- Layout para DESKTOP ---
              <>
                <Pressable onPress={toggleSidebar}>
                  <Menu size={28} color={"#ffffff"} />
                </Pressable>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text
                    style={{
                      fontFamily: "Segoe UI",
                      fontWeight: "bold",
                      fontSize: 20,
                      color: "#FFDE59",
                    }}
                  >
                    CARIBÚ
                  </Text>
                  <Image
                    source={require("@/assets/images/symbol.png")}
                    style={mainStyles.logo}
                  />
                  <Text
                    style={{
                      fontFamily: "Segoe UI",
                      fontWeight: "bold",
                      fontSize: 20,
                      color: "#FFDE59",
                    }}
                  >
                    LOTERIAS
                  </Text>
                </View>
              </>     
            )}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            {!isAuthenticated ? (
              <>
                <ButtonPrimary onClick={() => router.push("/login")} size={14} text={"LOGIN"} />
                <ButtonSecundary onClick={() => router.push("/registro")} size={14} text={"REGISTRAR"} />
              </>
            ) : (
              <>
                <ButtonSecundary 
                  onClick={() => setCarteiraModalVisible(true)} 
                  size={14} 
                  text={"CARTEIRA"} 
                />
                <UserProfile 
                  email={userData?.email || ''} 
                  balance={userBalance}
                  onClick={() => window.alert('Mostrar Opções de Perfil')}
                />
              </>
            )}
          </View>
        </View>

        {/* DUAS COLUNAS: sidebar fixa + coluna scrollável */}  
        <UserDataProvider userData={userData}>
          <View style={{ flex: 1, flexDirection: isMobile ? "column-reverse" : "row"}}>
            {/* ESQUERDA: Sidebar (define a própria largura internamente) */}
            {isMobile? 
              <SideBarMobile/>
              :
              <SideBar />
            }

            {/* DIREITA: tudo que rola (conteúdo + footer) */}
            <ScrollView
              style={isMobile ? { flex: 1 } : { flex: 1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: Colors.branco }}
              contentContainerStyle={{
                flexGrow: 1, // permite o conteúdo expandir sem empurrar o footer indevidamente
              }}
            >
              <MainContentController />

              <Footer />
            </ScrollView>
          
          </View>
        </UserDataProvider>
      
      </View>

      {/* Modal da Carteira */}
      <CarteiraModal
        visible={carteiraModalVisible}
        onClose={() => setCarteiraModalVisible(false)}
        currentBalance={userBalance}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
      />
            
    </SafeAreaView>
  );
};

export default Main;
