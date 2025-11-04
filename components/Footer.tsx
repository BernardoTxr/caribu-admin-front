import React from "react";
import { View, Text, Image, Pressable, Linking, Platform,useWindowDimensions } from "react-native";
import { Instagram,Facebook,Twitter } from "lucide-react-native";
import type { ViewStyle } from "react-native";
import s from "@/styles/footer";

// Ícones e logos (substituir pelos corretos dps)
const ICON_INSTAGRAM = require("@/assets/images/favicon.png");
const ICON_FACEBOOK  = require("@/assets/images/favicon.png");
const LOGO_MARK      = require("@/assets/images/favicon.png");

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const colW: ViewStyle["width"] = Platform.OS === "web" ? "25%" : "100%";
  const open = (url: string) => Linking.openURL(url);
  const { width } = useWindowDimensions();
  const isMobile = width < 768; // Exemplo de breakpoint para mobile



  return (
    <View style={s.wrap}>
      {/* colunas */}
      <View style={s.grid}>
        {/* marca + social */}
        <View style={[s.col, { width: colW }]}>
          <View style={s.brandRow}>
            {isMobile ? (
                <Text style={s.brandName}>CARIBÚ</Text>
            ) : (
              <>
                <Image source={LOGO_MARK} style={s.brandLogo} />
                <Text style={s.brandName}>CARIBÚ</Text>
              </>
            )}
          </View>
          <Text style={s.brandDesc}>
            A melhor plataforma de jogos online, feita para quem busca diversão com
            segurança e confiança.
          </Text>

          <View style={s.socialRow}>
            <Pressable style={s.socialBtn} onPress={() => open("https://instagram.com")}>
              <Instagram style={s.socialIcon} />
            </Pressable>
            <Pressable style={s.socialBtn} onPress={() => open("https://facebook.com")}>
              <Facebook style={s.socialIcon} />
            </Pressable>
            <Pressable style={s.socialBtn} onPress={() => open("https://twitter.com")}>
              <Twitter style={s.socialIcon} />
            </Pressable>
          </View>
        </View>

        {/* acesso rápido */}
        <View style={[s.col, { width: colW }]}>
          <Text style={s.colTitle}>ACESSO RÁPIDO</Text>
          <Pressable onPress={() => {}}><Text style={s.link}>Jogar Agora</Text></Pressable>
          <Pressable onPress={() => {}}><Text style={s.link}>Resultados</Text></Pressable>
          <Pressable onPress={() => {}}><Text style={s.link}>Cotação</Text></Pressable>
        </View>

        {/* jogador + suporte */}
        <View style={[s.col, { width: colW }]}>
          <Text style={s.colTitle}>JOGADOR</Text>
          <Pressable onPress={() => {}}><Text style={s.link}>Minha Conta</Text></Pressable>
          <Pressable onPress={() => {}}><Text style={s.link}>Carteira</Text></Pressable>
          <Pressable onPress={() => {}}><Text style={s.link}>Indique e Ganhe</Text></Pressable>

          <Text style={[s.colTitle, { marginTop: 16 }]}>SUPORTE</Text>
          <Pressable onPress={() => {}}><Text style={s.link}>Central de Suporte</Text></Pressable>
          <Pressable onPress={() => open("https://wa.me/5555999999999")}>
            <Text style={s.link}>Suporte via WhatsApp ↗</Text>
          </Pressable>
        </View>

        {/* legal */}
        <View style={[s.col, { width: colW }]}>
          <Text style={s.colTitle}>LEGAL</Text>
          <Pressable onPress={() => {}}><Text style={s.link}>Política de Privacidade</Text></Pressable>
          <Pressable onPress={() => {}}><Text style={s.link}>Termos de Uso</Text></Pressable>
        </View>
      </View>

      {/* responsabilidade */}
      <View style={s.respWrap}>
        <Text style={s.respText}>
          Jogue com Responsabilidade! O jogo pode ser viciante e, em alguns casos, levar a
          transtornos relacionados ao jogo patológico. Esteja atento aos sinais e busque
          apoio sempre que necessário.
        </Text>
        <View style={s.badge18}><Text style={s.badge18Text}>+18</Text></View>
        <Text style={s.aboutText}>
          Caribú Loterias é um site de entretenimento online que proporciona uma experiência
          segura e confiável, garantindo transparência e responsabilidade em todas as apostas.
        </Text>
      </View>

      <View style={s.hr} />
      <Text style={s.copy}>© {year} Caribú Loterias. Todos os direitos reservados.</Text>
    </View>
  );
};

export default Footer;
