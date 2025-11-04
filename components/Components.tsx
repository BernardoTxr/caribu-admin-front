import SideBar from "@/components/SideBar";
import { ButtonPrimary, ButtonSecundary} from "@/components/Buttons";
import MainContentController from "@/components/MainContentController";
import Resultados from "@/components/pages/Resultados/page";
import Home from "@/components/pages/Home/page";
import Jogar from "@/components/pages/Jogar/page";
import {Menu} from 'lucide-react-native';
import ResultCard from "@/components/pages/Resultados/ResultCard";
import {Carrossel} from "@/components/pages/Home/BannerPrincipal";
import FeatureCard from "@/components/FeatureCard";
import AtrasadoCard from "@/components/pages/Home/AtrasadoCard";
import ApostasRecentes from "@/components/pages/Home/ApostasRecentes";
import AtrasadosRecentes from "@/components/pages/Home/AtrasadosRecentes";
import Footer from "@/components/Footer";
import { useUserData } from "@/components/contexts/UserDataContext";
import SideBarMobile from "@/components/SideBarMobile";



export { 
    SideBar, ButtonPrimary, ButtonSecundary, Menu, MainContentController, Resultados, Jogar,
    ResultCard, Home,  Carrossel, AtrasadoCard, FeatureCard, ApostasRecentes, AtrasadosRecentes,
    Footer, useUserData, SideBarMobile,
};