import SideBar from "@/components/SideBar";
import { ButtonPrimary, ButtonSecundary} from "@/components/Buttons";
import MainContentController from "@/components/MainContentController";
import Resultados from "@/components/pages/Resultados";
import Home from "@/components/pages/Home";
import Jogar from "@/components/pages/Jogar";
import {Menu} from 'lucide-react-native';
import ResultCard from "@/components/ResultCard";
import {Carrossel} from "@/components/BannerPrincipal";
import FeatureCard from "@/components/FeatureCard";
import AtrasadoCard from "@/components/AtrasadoCard";
import ApostasRecentes from "@/components/ApostasRecentes";
import AtrasadosRecentes from "@/components/AtrasadosRecentes";
import AnimalCard from "@/components/Jogar/AnimalCard";
import AnimalsGrid from "@/components/Jogar/AnimalsGrid";
import Footer from "@/components/Footer";
import { BetCategory } from "@/components/Jogar/BetCategorySelector";
import { useUserData } from "@/components/contexts/UserDataContext";
import SideBarMobile from "@/components/SideBarMobile";



export { SideBar, ButtonPrimary, ButtonSecundary, Menu, MainContentController, Resultados, Jogar,
      ResultCard, Home,  Carrossel, AtrasadoCard, FeatureCard, ApostasRecentes, AtrasadosRecentes,
          AnimalCard, AnimalsGrid, Footer, BetCategory, useUserData, SideBarMobile
     };