import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Home, Droplets, Apple, ClipboardList, BookOpen, User, Plus, ChevronRight, ChevronLeft,
  Bell, Calculator, Check, X, TrendingUp, TrendingDown, Minus, Heart, Activity,
  Clock, Target, Award, Zap, Coffee, Sun, Moon, Sunset, AlertTriangle, Phone,
  Edit3, Trash2, BarChart3, ArrowRight, Star, CheckCircle, Circle, Info,
  Utensils, Search, ChevronDown, ChevronUp, Flame, Lightbulb, Shield,
  Eye, EyeOff, Mail, Lock, UserPlus, LogIn, Salad, Pill, Syringe
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

// ==================== STORAGE HELPERS ====================
const STORAGE_KEY = "glicovida-data";

const defaultData = {
  user: null,
  glucoseRecords: [],
  foodDiary: [],
  checklist: {},
  reminders: [],
  goals: [],
  medications: [],
  habits: [],
  mealPlan: {},
  habitLog: {},
  emotionalDiary: [],
  challengeLog: {},
  darkMode: false,
};

function loadData() {
  try {
    const raw = localStorage?.getItem?.(STORAGE_KEY);
    if (raw) return { ...defaultData, ...JSON.parse(raw) };
  } catch {}
  return { ...defaultData };
}

// Use in-memory store with React state instead of localStorage
const useAppData = () => {
  const [data, setData] = useState(defaultData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res && res.value) {
          setData({ ...defaultData, ...JSON.parse(res.value) });
        }
      } catch {}
      setLoaded(true);
    })();
  }, []);

  const save = useCallback(async (newData) => {
    setData(newData);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(newData));
    } catch {}
  }, []);

  return { data, save, loaded };
};

// ==================== CONSTANTS ====================
const COLORS = {
  primary: "#0F766E",
  primaryLight: "#14B8A6",
  primaryBg: "#F0FDFA",
  accent: "#F97316",
  accentLight: "#FFF7ED",
  danger: "#EF4444",
  dangerBg: "#FEF2F2",
  warning: "#F59E0B",
  warningBg: "#FFFBEB",
  success: "#10B981",
  successBg: "#ECFDF5",
  bg: "#F8FAFB",
  card: "#FFFFFF",
  text: "#1E293B",
  textSecondary: "#64748B",
  textLight: "#94A3B8",
  border: "#E2E8F0",
};

const TABS = [
  { id: "home", label: "Início", icon: Home },
  { id: "glucose", label: "Glicemia", icon: Droplets },
  { id: "food", label: "Alimentação", icon: Apple },
  { id: "routine", label: "Rotina", icon: ClipboardList },
  { id: "learn", label: "Aprender", icon: BookOpen },
  { id: "profile", label: "Perfil", icon: User },
];

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const FOOD_DATABASE = [
  // === CEREAIS E GRÃOS ===
  { name: "Arroz branco (1 xícara)", carbs: 45, gi: "alto", category: "Cereais" },
  { name: "Arroz integral (1 xícara)", carbs: 36, gi: "médio", category: "Cereais" },
  { name: "Arroz parboilizado (1 xícara)", carbs: 41, gi: "médio", category: "Cereais" },
  { name: "Arroz japonês (1 xícara)", carbs: 48, gi: "alto", category: "Cereais" },
  { name: "Aveia em flocos (2 col. sopa)", carbs: 11, gi: "médio", category: "Cereais" },
  { name: "Aveia em farelo (2 col. sopa)", carbs: 10, gi: "baixo", category: "Cereais" },
  { name: "Quinoa cozida (1/2 xícara)", carbs: 17, gi: "baixo", category: "Cereais" },
  { name: "Milho cozido (1 espiga)", carbs: 19, gi: "médio", category: "Cereais" },
  { name: "Milho enlatado (3 col. sopa)", carbs: 14, gi: "médio", category: "Cereais" },
  { name: "Cuscuz de milho (100g)", carbs: 25, gi: "médio", category: "Cereais" },
  { name: "Polenta (100g)", carbs: 16, gi: "alto", category: "Cereais" },
  { name: "Granola (1/4 xícara)", carbs: 18, gi: "médio", category: "Cereais" },
  { name: "Cereal matinal (1 xícara)", carbs: 28, gi: "alto", category: "Cereais" },
  { name: "Trigo sarraceno (100g)", carbs: 20, gi: "baixo", category: "Cereais" },
  { name: "Amaranto (100g)", carbs: 19, gi: "baixo", category: "Cereais" },
  { name: "Cevada cozida (100g)", carbs: 28, gi: "baixo", category: "Cereais" },
  { name: "Painço / Milhete (100g)", carbs: 23, gi: "médio", category: "Cereais" },

  // === LEGUMINOSAS ===
  { name: "Feijão carioca (1 concha)", carbs: 14, gi: "baixo", category: "Leguminosas" },
  { name: "Feijão preto (1 concha)", carbs: 15, gi: "baixo", category: "Leguminosas" },
  { name: "Feijão branco (1 concha)", carbs: 16, gi: "baixo", category: "Leguminosas" },
  { name: "Feijão fradinho (1 concha)", carbs: 14, gi: "baixo", category: "Leguminosas" },
  { name: "Lentilha cozida (1 concha)", carbs: 12, gi: "baixo", category: "Leguminosas" },
  { name: "Grão-de-bico cozido (1 concha)", carbs: 15, gi: "baixo", category: "Leguminosas" },
  { name: "Ervilha cozida (100g)", carbs: 14, gi: "baixo", category: "Leguminosas" },
  { name: "Soja cozida (100g)", carbs: 9, gi: "baixo", category: "Leguminosas" },
  { name: "Edamame (100g)", carbs: 8, gi: "baixo", category: "Leguminosas" },
  { name: "Feijão verde/vagem (100g)", carbs: 7, gi: "baixo", category: "Leguminosas" },

  // === TUBÉRCULOS E RAÍZES ===
  { name: "Batata-doce cozida (100g)", carbs: 20, gi: "médio", category: "Tubérculos" },
  { name: "Batata inglesa cozida (100g)", carbs: 17, gi: "alto", category: "Tubérculos" },
  { name: "Batata frita (porção 100g)", carbs: 35, gi: "alto", category: "Tubérculos" },
  { name: "Purê de batata (100g)", carbs: 16, gi: "alto", category: "Tubérculos" },
  { name: "Mandioca cozida (100g)", carbs: 30, gi: "alto", category: "Tubérculos" },
  { name: "Mandioquinha (100g)", carbs: 19, gi: "médio", category: "Tubérculos" },
  { name: "Inhame cozido (100g)", carbs: 24, gi: "médio", category: "Tubérculos" },
  { name: "Cará cozido (100g)", carbs: 22, gi: "médio", category: "Tubérculos" },
  { name: "Beterraba cozida (100g)", carbs: 10, gi: "médio", category: "Tubérculos" },
  { name: "Nabo cozido (100g)", carbs: 4, gi: "baixo", category: "Tubérculos" },

  // === PÃES ===
  { name: "Pão francês (1 unidade)", carbs: 28, gi: "alto", category: "Pães" },
  { name: "Pão integral (1 fatia)", carbs: 12, gi: "médio", category: "Pães" },
  { name: "Pão de forma branco (1 fatia)", carbs: 14, gi: "alto", category: "Pães" },
  { name: "Pão de centeio (1 fatia)", carbs: 12, gi: "médio", category: "Pães" },
  { name: "Pão australiano (1 fatia)", carbs: 15, gi: "médio", category: "Pães" },
  { name: "Pão sírio/árabe (1 unidade)", carbs: 24, gi: "médio", category: "Pães" },
  { name: "Pão de queijo (1 unidade média)", carbs: 12, gi: "alto", category: "Pães" },
  { name: "Pão de milho (1 fatia)", carbs: 18, gi: "alto", category: "Pães" },
  { name: "Pão ciabatta (1 unidade)", carbs: 30, gi: "alto", category: "Pães" },
  { name: "Bisnaguinha (1 unidade)", carbs: 14, gi: "alto", category: "Pães" },
  { name: "Torrada integral (2 unidades)", carbs: 12, gi: "médio", category: "Pães" },
  { name: "Torrada branca (2 unidades)", carbs: 14, gi: "alto", category: "Pães" },
  { name: "Wrap / Tortilha (1 unidade)", carbs: 22, gi: "médio", category: "Pães" },
  { name: "Croissant (1 unidade)", carbs: 26, gi: "alto", category: "Pães" },

  // === MASSAS ===
  { name: "Macarrão branco cozido (100g)", carbs: 28, gi: "alto", category: "Massas" },
  { name: "Macarrão integral cozido (100g)", carbs: 25, gi: "médio", category: "Massas" },
  { name: "Espaguete cozido (100g)", carbs: 27, gi: "médio", category: "Massas" },
  { name: "Lasanha pronta (1 pedaço)", carbs: 30, gi: "alto", category: "Massas" },
  { name: "Nhoque de batata (100g)", carbs: 33, gi: "alto", category: "Massas" },
  { name: "Macarrão instantâneo (1 pacote)", carbs: 52, gi: "alto", category: "Massas" },
  { name: "Ravioli (100g)", carbs: 24, gi: "médio", category: "Massas" },
  { name: "Yakisoba (100g)", carbs: 22, gi: "médio", category: "Massas" },

  // === FRUTAS ===
  { name: "Maçã (1 unidade média)", carbs: 15, gi: "baixo", category: "Frutas" },
  { name: "Banana nanica (1 unidade)", carbs: 23, gi: "médio", category: "Frutas" },
  { name: "Banana prata (1 unidade)", carbs: 20, gi: "médio", category: "Frutas" },
  { name: "Laranja (1 unidade média)", carbs: 12, gi: "baixo", category: "Frutas" },
  { name: "Morango (10 unidades)", carbs: 8, gi: "baixo", category: "Frutas" },
  { name: "Manga (1/2 unidade)", carbs: 17, gi: "médio", category: "Frutas" },
  { name: "Mamão papaia (1 fatia)", carbs: 10, gi: "médio", category: "Frutas" },
  { name: "Mamão formosa (1 fatia)", carbs: 12, gi: "médio", category: "Frutas" },
  { name: "Melancia (1 fatia média)", carbs: 12, gi: "alto", category: "Frutas" },
  { name: "Melão (1 fatia média)", carbs: 8, gi: "médio", category: "Frutas" },
  { name: "Abacaxi (1 fatia)", carbs: 13, gi: "médio", category: "Frutas" },
  { name: "Uva (15 unidades)", carbs: 15, gi: "médio", category: "Frutas" },
  { name: "Pera (1 unidade)", carbs: 15, gi: "baixo", category: "Frutas" },
  { name: "Pêssego (1 unidade)", carbs: 10, gi: "baixo", category: "Frutas" },
  { name: "Ameixa (2 unidades)", carbs: 12, gi: "baixo", category: "Frutas" },
  { name: "Kiwi (1 unidade)", carbs: 11, gi: "baixo", category: "Frutas" },
  { name: "Goiaba (1 unidade)", carbs: 14, gi: "baixo", category: "Frutas" },
  { name: "Abacate (1/2 unidade)", carbs: 6, gi: "baixo", category: "Frutas" },
  { name: "Caqui (1 unidade)", carbs: 19, gi: "médio", category: "Frutas" },
  { name: "Tangerina (1 unidade)", carbs: 9, gi: "baixo", category: "Frutas" },
  { name: "Limão (1 unidade)", carbs: 3, gi: "baixo", category: "Frutas" },
  { name: "Maracujá (1 unidade)", carbs: 12, gi: "baixo", category: "Frutas" },
  { name: "Acerola (10 unidades)", carbs: 5, gi: "baixo", category: "Frutas" },
  { name: "Jabuticaba (10 unidades)", carbs: 13, gi: "médio", category: "Frutas" },
  { name: "Pitaya (1 unidade)", carbs: 13, gi: "baixo", category: "Frutas" },
  { name: "Lichia (5 unidades)", carbs: 10, gi: "médio", category: "Frutas" },
  { name: "Coco fresco (100g)", carbs: 5, gi: "baixo", category: "Frutas" },
  { name: "Açaí puro (100g)", carbs: 6, gi: "baixo", category: "Frutas" },
  { name: "Açaí com xarope (200ml)", carbs: 35, gi: "alto", category: "Frutas" },
  { name: "Framboesa (100g)", carbs: 6, gi: "baixo", category: "Frutas" },
  { name: "Mirtilo/Blueberry (100g)", carbs: 12, gi: "baixo", category: "Frutas" },
  { name: "Amora (100g)", carbs: 5, gi: "baixo", category: "Frutas" },
  { name: "Jaca (100g)", carbs: 22, gi: "médio", category: "Frutas" },
  { name: "Cajá (1 unidade)", carbs: 7, gi: "baixo", category: "Frutas" },
  { name: "Carambola (1 unidade)", carbs: 4, gi: "baixo", category: "Frutas" },
  { name: "Graviola (100g)", carbs: 16, gi: "baixo", category: "Frutas" },
  { name: "Figo (2 unidades)", carbs: 12, gi: "médio", category: "Frutas" },

  // === LEGUMES E VERDURAS ===
  { name: "Abóbora cozida (100g)", carbs: 7, gi: "médio", category: "Legumes" },
  { name: "Abobrinha (100g)", carbs: 3, gi: "baixo", category: "Legumes" },
  { name: "Cenoura crua (1 unidade)", carbs: 6, gi: "médio", category: "Legumes" },
  { name: "Brócolis (100g)", carbs: 4, gi: "baixo", category: "Legumes" },
  { name: "Couve-flor (100g)", carbs: 5, gi: "baixo", category: "Legumes" },
  { name: "Espinafre (100g)", carbs: 1, gi: "baixo", category: "Legumes" },
  { name: "Couve refogada (100g)", carbs: 4, gi: "baixo", category: "Legumes" },
  { name: "Alface (1 prato)", carbs: 1, gi: "baixo", category: "Legumes" },
  { name: "Rúcula (100g)", carbs: 2, gi: "baixo", category: "Legumes" },
  { name: "Tomate (1 unidade)", carbs: 4, gi: "baixo", category: "Legumes" },
  { name: "Pepino (1/2 unidade)", carbs: 2, gi: "baixo", category: "Legumes" },
  { name: "Cebola (1 unidade)", carbs: 7, gi: "baixo", category: "Legumes" },
  { name: "Alho (3 dentes)", carbs: 3, gi: "baixo", category: "Legumes" },
  { name: "Pimentão (1 unidade)", carbs: 6, gi: "baixo", category: "Legumes" },
  { name: "Berinjela (100g)", carbs: 3, gi: "baixo", category: "Legumes" },
  { name: "Chuchu cozido (100g)", carbs: 3, gi: "baixo", category: "Legumes" },
  { name: "Quiabo (100g)", carbs: 4, gi: "baixo", category: "Legumes" },
  { name: "Jiló (100g)", carbs: 3, gi: "baixo", category: "Legumes" },
  { name: "Repolho (100g)", carbs: 4, gi: "baixo", category: "Legumes" },
  { name: "Aspargos (100g)", carbs: 2, gi: "baixo", category: "Legumes" },
  { name: "Cogumelos (100g)", carbs: 3, gi: "baixo", category: "Legumes" },
  { name: "Palmito (100g)", carbs: 3, gi: "baixo", category: "Legumes" },
  { name: "Maxixe (100g)", carbs: 2, gi: "baixo", category: "Legumes" },
  { name: "Couve de bruxelas (100g)", carbs: 5, gi: "baixo", category: "Legumes" },
  { name: "Acelga (100g)", carbs: 2, gi: "baixo", category: "Legumes" },
  { name: "Agrião (100g)", carbs: 1, gi: "baixo", category: "Legumes" },

  // === CARNES E PROTEÍNAS ===
  { name: "Frango grelhado (100g)", carbs: 0, gi: "baixo", category: "Proteínas" },
  { name: "Frango empanado (100g)", carbs: 12, gi: "alto", category: "Proteínas" },
  { name: "Carne bovina magra (100g)", carbs: 0, gi: "baixo", category: "Proteínas" },
  { name: "Carne bovina gorda (100g)", carbs: 0, gi: "baixo", category: "Proteínas" },
  { name: "Carne suína (100g)", carbs: 0, gi: "baixo", category: "Proteínas" },
  { name: "Peixe grelhado (100g)", carbs: 0, gi: "baixo", category: "Proteínas" },
  { name: "Salmão (100g)", carbs: 0, gi: "baixo", category: "Proteínas" },
  { name: "Atum (100g)", carbs: 0, gi: "baixo", category: "Proteínas" },
  { name: "Sardinha (1 lata)", carbs: 0, gi: "baixo", category: "Proteínas" },
  { name: "Camarão (100g)", carbs: 1, gi: "baixo", category: "Proteínas" },
  { name: "Ovo cozido (1 unidade)", carbs: 0.5, gi: "baixo", category: "Proteínas" },
  { name: "Ovo frito (1 unidade)", carbs: 0.5, gi: "baixo", category: "Proteínas" },
  { name: "Omelete simples (2 ovos)", carbs: 1, gi: "baixo", category: "Proteínas" },
  { name: "Peru/Chester (100g)", carbs: 0, gi: "baixo", category: "Proteínas" },
  { name: "Carne seca (100g)", carbs: 0, gi: "baixo", category: "Proteínas" },
  { name: "Linguiça (1 unidade)", carbs: 2, gi: "baixo", category: "Proteínas" },
  { name: "Salsicha (1 unidade)", carbs: 2, gi: "baixo", category: "Proteínas" },
  { name: "Presunto (2 fatias)", carbs: 1, gi: "baixo", category: "Proteínas" },
  { name: "Peito de peru (2 fatias)", carbs: 1, gi: "baixo", category: "Proteínas" },
  { name: "Tofu firme (100g)", carbs: 2, gi: "baixo", category: "Proteínas" },
  { name: "Proteína de soja (100g)", carbs: 6, gi: "baixo", category: "Proteínas" },
  { name: "Hambúrguer bovino (1 unid.)", carbs: 5, gi: "baixo", category: "Proteínas" },
  { name: "Bacon (2 fatias)", carbs: 0, gi: "baixo", category: "Proteínas" },

  // === LATICÍNIOS ===
  { name: "Leite integral (1 copo 200ml)", carbs: 10, gi: "baixo", category: "Laticínios" },
  { name: "Leite desnatado (1 copo 200ml)", carbs: 10, gi: "baixo", category: "Laticínios" },
  { name: "Leite de amêndoas (200ml)", carbs: 1, gi: "baixo", category: "Laticínios" },
  { name: "Leite de aveia (200ml)", carbs: 13, gi: "médio", category: "Laticínios" },
  { name: "Leite de coco (200ml)", carbs: 2, gi: "baixo", category: "Laticínios" },
  { name: "Leite de soja (200ml)", carbs: 4, gi: "baixo", category: "Laticínios" },
  { name: "Iogurte natural (170g)", carbs: 8, gi: "baixo", category: "Laticínios" },
  { name: "Iogurte grego natural (170g)", carbs: 6, gi: "baixo", category: "Laticínios" },
  { name: "Iogurte de frutas (170g)", carbs: 22, gi: "médio", category: "Laticínios" },
  { name: "Queijo mussarela (30g)", carbs: 0.5, gi: "baixo", category: "Laticínios" },
  { name: "Queijo minas frescal (30g)", carbs: 1, gi: "baixo", category: "Laticínios" },
  { name: "Queijo prato (30g)", carbs: 0.5, gi: "baixo", category: "Laticínios" },
  { name: "Queijo cottage (100g)", carbs: 3, gi: "baixo", category: "Laticínios" },
  { name: "Queijo parmesão (30g)", carbs: 1, gi: "baixo", category: "Laticínios" },
  { name: "Requeijão (1 col. sopa)", carbs: 1, gi: "baixo", category: "Laticínios" },
  { name: "Cream cheese (1 col. sopa)", carbs: 1, gi: "baixo", category: "Laticínios" },
  { name: "Manteiga (1 col. sopa)", carbs: 0, gi: "baixo", category: "Laticínios" },
  { name: "Creme de leite (2 col. sopa)", carbs: 1, gi: "baixo", category: "Laticínios" },
  { name: "Leite condensado (1 col. sopa)", carbs: 11, gi: "alto", category: "Laticínios" },

  // === OLEAGINOSAS E SEMENTES ===
  { name: "Castanha-do-pará (3 unid.)", carbs: 2, gi: "baixo", category: "Oleaginosas" },
  { name: "Castanha de caju (10 unid.)", carbs: 9, gi: "baixo", category: "Oleaginosas" },
  { name: "Amêndoas (10 unidades)", carbs: 4, gi: "baixo", category: "Oleaginosas" },
  { name: "Nozes (5 unidades)", carbs: 3, gi: "baixo", category: "Oleaginosas" },
  { name: "Amendoim (30g)", carbs: 5, gi: "baixo", category: "Oleaginosas" },
  { name: "Pasta de amendoim (1 col. sopa)", carbs: 4, gi: "baixo", category: "Oleaginosas" },
  { name: "Macadâmia (10 unidades)", carbs: 2, gi: "baixo", category: "Oleaginosas" },
  { name: "Pistache (30g)", carbs: 8, gi: "baixo", category: "Oleaginosas" },
  { name: "Semente de chia (1 col. sopa)", carbs: 5, gi: "baixo", category: "Oleaginosas" },
  { name: "Semente de linhaça (1 col. sopa)", carbs: 3, gi: "baixo", category: "Oleaginosas" },
  { name: "Semente de girassol (30g)", carbs: 6, gi: "baixo", category: "Oleaginosas" },
  { name: "Semente de abóbora (30g)", carbs: 4, gi: "baixo", category: "Oleaginosas" },
  { name: "Gergelim (1 col. sopa)", carbs: 3, gi: "baixo", category: "Oleaginosas" },
  { name: "Mix de nuts (30g)", carbs: 6, gi: "baixo", category: "Oleaginosas" },

  // === BEBIDAS ===
  { name: "Suco de laranja natural (200ml)", carbs: 20, gi: "médio", category: "Bebidas" },
  { name: "Suco de uva integral (200ml)", carbs: 28, gi: "médio", category: "Bebidas" },
  { name: "Suco de maçã (200ml)", carbs: 24, gi: "médio", category: "Bebidas" },
  { name: "Suco verde (200ml)", carbs: 10, gi: "baixo", category: "Bebidas" },
  { name: "Água de coco (200ml)", carbs: 9, gi: "baixo", category: "Bebidas" },
  { name: "Refrigerante comum (350ml)", carbs: 39, gi: "alto", category: "Bebidas" },
  { name: "Refrigerante zero (350ml)", carbs: 0, gi: "baixo", category: "Bebidas" },
  { name: "Cerveja (350ml)", carbs: 13, gi: "alto", category: "Bebidas" },
  { name: "Cerveja light (350ml)", carbs: 6, gi: "médio", category: "Bebidas" },
  { name: "Vinho tinto (150ml)", carbs: 4, gi: "baixo", category: "Bebidas" },
  { name: "Vinho branco (150ml)", carbs: 4, gi: "baixo", category: "Bebidas" },
  { name: "Café sem açúcar (200ml)", carbs: 0, gi: "baixo", category: "Bebidas" },
  { name: "Café com açúcar (200ml)", carbs: 10, gi: "alto", category: "Bebidas" },
  { name: "Cappuccino (200ml)", carbs: 16, gi: "médio", category: "Bebidas" },
  { name: "Chá sem açúcar (200ml)", carbs: 0, gi: "baixo", category: "Bebidas" },
  { name: "Smoothie de frutas (300ml)", carbs: 35, gi: "médio", category: "Bebidas" },
  { name: "Achocolatado (200ml)", carbs: 28, gi: "alto", category: "Bebidas" },
  { name: "Isotônico (500ml)", carbs: 30, gi: "alto", category: "Bebidas" },
  { name: "Energético (250ml)", carbs: 28, gi: "alto", category: "Bebidas" },

  // === DOCES E SOBREMESAS ===
  { name: "Chocolate amargo 70% (30g)", carbs: 12, gi: "baixo", category: "Doces" },
  { name: "Chocolate ao leite (30g)", carbs: 17, gi: "alto", category: "Doces" },
  { name: "Chocolate branco (30g)", carbs: 18, gi: "alto", category: "Doces" },
  { name: "Brigadeiro (1 unidade)", carbs: 10, gi: "alto", category: "Doces" },
  { name: "Beijinho (1 unidade)", carbs: 9, gi: "alto", category: "Doces" },
  { name: "Pudim (1 fatia)", carbs: 32, gi: "alto", category: "Doces" },
  { name: "Sorvete (1 bola)", carbs: 18, gi: "alto", category: "Doces" },
  { name: "Picolé de fruta (1 unidade)", carbs: 15, gi: "médio", category: "Doces" },
  { name: "Gelatina diet (1 porção)", carbs: 0, gi: "baixo", category: "Doces" },
  { name: "Gelatina comum (1 porção)", carbs: 18, gi: "alto", category: "Doces" },
  { name: "Bolo simples (1 fatia)", carbs: 35, gi: "alto", category: "Doces" },
  { name: "Bolo de chocolate (1 fatia)", carbs: 40, gi: "alto", category: "Doces" },
  { name: "Torta de frutas (1 fatia)", carbs: 30, gi: "alto", category: "Doces" },
  { name: "Paçoca (1 unidade)", carbs: 12, gi: "médio", category: "Doces" },
  { name: "Mel (1 col. sopa)", carbs: 17, gi: "alto", category: "Doces" },
  { name: "Açúcar refinado (1 col. sopa)", carbs: 12, gi: "alto", category: "Doces" },
  { name: "Goiabada (1 fatia)", carbs: 25, gi: "alto", category: "Doces" },
  { name: "Doce de leite (1 col. sopa)", carbs: 13, gi: "alto", category: "Doces" },
  { name: "Rapadura (30g)", carbs: 27, gi: "alto", category: "Doces" },
  { name: "Barra de cereal (1 unidade)", carbs: 18, gi: "médio", category: "Doces" },
  { name: "Cookie (1 unidade)", carbs: 15, gi: "alto", category: "Doces" },
  { name: "Brownie (1 pedaço)", carbs: 22, gi: "alto", category: "Doces" },
  { name: "Mousse de chocolate (100g)", carbs: 20, gi: "médio", category: "Doces" },
  { name: "Banana passa (30g)", carbs: 20, gi: "alto", category: "Doces" },
  { name: "Damasco seco (5 unidades)", carbs: 16, gi: "médio", category: "Doces" },
  { name: "Uva passa (30g)", carbs: 22, gi: "médio", category: "Doces" },
  { name: "Tâmara (2 unidades)", carbs: 18, gi: "alto", category: "Doces" },

  // === PRATOS BRASILEIROS ===
  { name: "Coxinha (1 unidade)", carbs: 22, gi: "alto", category: "Pratos Brasileiros" },
  { name: "Pastel frito (1 unidade)", carbs: 20, gi: "alto", category: "Pratos Brasileiros" },
  { name: "Empada (1 unidade)", carbs: 15, gi: "alto", category: "Pratos Brasileiros" },
  { name: "Esfiha (1 unidade)", carbs: 18, gi: "alto", category: "Pratos Brasileiros" },
  { name: "Tapioca simples (1 unidade)", carbs: 22, gi: "alto", category: "Pratos Brasileiros" },
  { name: "Tapioca com queijo (1 unidade)", carbs: 23, gi: "alto", category: "Pratos Brasileiros" },
  { name: "Acarajé (1 unidade)", carbs: 20, gi: "médio", category: "Pratos Brasileiros" },
  { name: "Farofa (2 col. sopa)", carbs: 16, gi: "alto", category: "Pratos Brasileiros" },
  { name: "Baião de dois (100g)", carbs: 18, gi: "médio", category: "Pratos Brasileiros" },
  { name: "Feijoada (1 concha)", carbs: 12, gi: "baixo", category: "Pratos Brasileiros" },
  { name: "Arroz carreteiro (100g)", carbs: 20, gi: "alto", category: "Pratos Brasileiros" },
  { name: "Escondidinho (100g)", carbs: 18, gi: "alto", category: "Pratos Brasileiros" },
  { name: "Moqueca (1 porção)", carbs: 8, gi: "baixo", category: "Pratos Brasileiros" },
  { name: "Vatapá (100g)", carbs: 12, gi: "médio", category: "Pratos Brasileiros" },
  { name: "Bobó de camarão (100g)", carbs: 14, gi: "médio", category: "Pratos Brasileiros" },
  { name: "Tutu de feijão (100g)", carbs: 18, gi: "médio", category: "Pratos Brasileiros" },
  { name: "Virada paulista (100g)", carbs: 16, gi: "médio", category: "Pratos Brasileiros" },
  { name: "Açaí na tigela completo (300ml)", carbs: 50, gi: "alto", category: "Pratos Brasileiros" },
  { name: "Pamonha (1 unidade)", carbs: 30, gi: "alto", category: "Pratos Brasileiros" },
  { name: "Curau (100g)", carbs: 22, gi: "alto", category: "Pratos Brasileiros" },
  { name: "Canjica (100g)", carbs: 25, gi: "alto", category: "Pratos Brasileiros" },

  // === FAST FOOD E LANCHES ===
  { name: "Hambúrguer completo (1 unid.)", carbs: 35, gi: "alto", category: "Fast Food" },
  { name: "Cheeseburger (1 unid.)", carbs: 30, gi: "alto", category: "Fast Food" },
  { name: "Pizza margherita (1 fatia)", carbs: 30, gi: "alto", category: "Fast Food" },
  { name: "Pizza calabresa (1 fatia)", carbs: 28, gi: "alto", category: "Fast Food" },
  { name: "Pizza portuguesa (1 fatia)", carbs: 29, gi: "alto", category: "Fast Food" },
  { name: "Hot dog completo (1 unid.)", carbs: 35, gi: "alto", category: "Fast Food" },
  { name: "Batata frita (porção média)", carbs: 45, gi: "alto", category: "Fast Food" },
  { name: "Nuggets (6 unidades)", carbs: 18, gi: "alto", category: "Fast Food" },
  { name: "Sanduíche natural (1 unid.)", carbs: 20, gi: "médio", category: "Fast Food" },
  { name: "Wrap de frango (1 unid.)", carbs: 25, gi: "médio", category: "Fast Food" },
  { name: "Sushi (8 peças)", carbs: 40, gi: "alto", category: "Fast Food" },
  { name: "Temaki (1 unidade)", carbs: 25, gi: "alto", category: "Fast Food" },
  { name: "Burrito (1 unidade)", carbs: 40, gi: "médio", category: "Fast Food" },
  { name: "Taco (1 unidade)", carbs: 14, gi: "médio", category: "Fast Food" },
  { name: "Esfirra (1 unidade)", carbs: 18, gi: "alto", category: "Fast Food" },
  { name: "Quibe frito (1 unidade)", carbs: 12, gi: "médio", category: "Fast Food" },
  { name: "Pão de queijo (1 unidade)", carbs: 12, gi: "alto", category: "Fast Food" },

  // === SOPAS ===
  { name: "Sopa de legumes (1 prato)", carbs: 15, gi: "baixo", category: "Sopas" },
  { name: "Caldo verde (1 prato)", carbs: 12, gi: "médio", category: "Sopas" },
  { name: "Sopa de feijão (1 prato)", carbs: 20, gi: "baixo", category: "Sopas" },
  { name: "Canja de galinha (1 prato)", carbs: 18, gi: "médio", category: "Sopas" },
  { name: "Sopa de abóbora (1 prato)", carbs: 14, gi: "médio", category: "Sopas" },
  { name: "Sopa de lentilha (1 prato)", carbs: 16, gi: "baixo", category: "Sopas" },
  { name: "Creme de milho (1 prato)", carbs: 22, gi: "médio", category: "Sopas" },

  // === CONDIMENTOS E MOLHOS ===
  { name: "Ketchup (1 col. sopa)", carbs: 4, gi: "médio", category: "Molhos" },
  { name: "Mostarda (1 col. sopa)", carbs: 1, gi: "baixo", category: "Molhos" },
  { name: "Maionese (1 col. sopa)", carbs: 0.5, gi: "baixo", category: "Molhos" },
  { name: "Molho de tomate (3 col. sopa)", carbs: 6, gi: "baixo", category: "Molhos" },
  { name: "Molho shoyu (1 col. sopa)", carbs: 1, gi: "baixo", category: "Molhos" },
  { name: "Azeite de oliva (1 col. sopa)", carbs: 0, gi: "baixo", category: "Molhos" },
  { name: "Vinagre (1 col. sopa)", carbs: 0, gi: "baixo", category: "Molhos" },
  { name: "Molho barbecue (1 col. sopa)", carbs: 6, gi: "alto", category: "Molhos" },
  { name: "Homus/Hummus (2 col. sopa)", carbs: 6, gi: "baixo", category: "Molhos" },
  { name: "Guacamole (2 col. sopa)", carbs: 3, gi: "baixo", category: "Molhos" },

  // === FARINHAS E OUTROS ===
  { name: "Farinha de trigo (2 col. sopa)", carbs: 15, gi: "alto", category: "Farinhas" },
  { name: "Farinha de mandioca (2 col. sopa)", carbs: 17, gi: "alto", category: "Farinhas" },
  { name: "Farinha de amêndoas (2 col. sopa)", carbs: 3, gi: "baixo", category: "Farinhas" },
  { name: "Farinha de coco (2 col. sopa)", carbs: 6, gi: "baixo", category: "Farinhas" },
  { name: "Farinha de aveia (2 col. sopa)", carbs: 11, gi: "médio", category: "Farinhas" },
  { name: "Farinha de linhaça (2 col. sopa)", carbs: 2, gi: "baixo", category: "Farinhas" },
  { name: "Fécula de batata (1 col. sopa)", carbs: 10, gi: "alto", category: "Farinhas" },
  { name: "Amido de milho (1 col. sopa)", carbs: 9, gi: "alto", category: "Farinhas" },
  { name: "Pipoca (1 xícara)", carbs: 6, gi: "médio", category: "Farinhas" },
  { name: "Biscoito cream cracker (3 unid.)", carbs: 15, gi: "alto", category: "Farinhas" },
  { name: "Biscoito água e sal (3 unid.)", carbs: 14, gi: "alto", category: "Farinhas" },
  { name: "Biscoito integral (3 unid.)", carbs: 12, gi: "médio", category: "Farinhas" },
];

const EDUCATIONAL_CONTENT = [
  {
    id: 1,
    title: "O que fazer em caso de hipoglicemia?",
    category: "Emergência",
    icon: "⚡",
    color: COLORS.danger,
    bgColor: COLORS.dangerBg,
    content: "A hipoglicemia acontece quando a glicose no sangue cai abaixo de 70 mg/dL. Os sintomas incluem tremores, sudorese, tontura e confusão mental. Ao sentir esses sinais, consuma imediatamente 15g de carboidratos de rápida absorção — como meio copo de suco de laranja, 1 colher de sopa de mel ou 3 balas de glicose. Espere 15 minutos e meça novamente. Se continuar baixa, repita o processo. Sempre tenha uma fonte rápida de açúcar por perto."
  },
  {
    id: 2,
    title: "Como contar carboidratos de forma simples",
    category: "Alimentação",
    icon: "🧮",
    color: COLORS.primary,
    bgColor: COLORS.primaryBg,
    content: "A contagem de carboidratos ajuda a prever o impacto da refeição na sua glicemia. A regra básica: leia os rótulos e procure o valor de carboidratos por porção. Para alimentos sem rótulo, use referências como a biblioteca de alimentos do app. Lembre-se: o total de carboidratos importa mais que o açúcar isolado. Com o tempo, você desenvolverá uma intuição para estimar as quantidades."
  },
  {
    id: 3,
    title: "A ordem dos alimentos no prato faz diferença",
    category: "Dica prática",
    icon: "🍽️",
    color: COLORS.success,
    bgColor: COLORS.successBg,
    content: "Estudos mostram que comer os vegetais e proteínas antes dos carboidratos pode reduzir os picos glicêmicos em até 30-40%. Comece pela salada, depois as proteínas (carnes, ovos, leguminosas) e por último os carboidratos (arroz, pão, batata). Essa simples mudança na ordem pode transformar o impacto da refeição na sua glicose."
  },
  {
    id: 4,
    title: "Mitos e verdades sobre açúcar e diabetes",
    category: "Educação",
    icon: "🔍",
    color: COLORS.accent,
    bgColor: COLORS.accentLight,
    content: "MITO: Diabético não pode comer nada doce. VERDADE: O importante é a quantidade, a combinação e o contexto. Um doce após uma refeição rica em fibras e proteínas tem muito menos impacto do que o mesmo doce consumido isoladamente. MITO: Açúcar mascavo é liberado. VERDADE: O corpo processa todos os açúcares simples de forma semelhante — o foco deve ser na redução geral."
  },
  {
    id: 5,
    title: "A importância do sono para a glicemia",
    category: "Estilo de vida",
    icon: "😴",
    color: "#8B5CF6",
    bgColor: "#F5F3FF",
    content: "Dormir menos de 6 horas pode aumentar a resistência à insulina e elevar a glicemia. Durante o sono profundo, o corpo regula hormônios essenciais para o metabolismo da glicose. Dicas: mantenha horários regulares, evite telas 2h antes de dormir, deixe o quarto escuro e silencioso, e pratique exercícios durante o dia (mas não perto da hora de dormir)."
  },
  {
    id: 6,
    title: "Exercícios físicos e controle glicêmico",
    category: "Atividade física",
    icon: "🏃",
    color: COLORS.primaryLight,
    bgColor: COLORS.primaryBg,
    content: "A atividade física aumenta a sensibilidade à insulina, permitindo que a glicose entre nas células com mais facilidade. Para começar: 30 minutos de caminhada diária já fazem grande diferença. Meça a glicemia antes e depois do exercício. Se usar insulina, tenha sempre um lanche rápido por perto para prevenir hipoglicemia durante o treino."
  },
  {
    id: 7,
    title: "Dicas para comer fora de casa",
    category: "Dica prática",
    icon: "🍴",
    color: COLORS.warning,
    bgColor: COLORS.warningBg,
    content: "Comer fora não precisa ser estressante. Antes de pedir, visualize a proporção ideal: metade do prato com vegetais, um quarto proteína, um quarto carboidratos. Peça substituições simples (grelhado em vez de frito). Evite bebidas açucaradas e peça água. E lembre-se: uma refeição diferente não anula todo o seu esforço — o que conta é a consistência do dia a dia."
  },
  {
    id: 8,
    title: "Estresse e glicemia: a conexão oculta",
    category: "Estilo de vida",
    icon: "🧘",
    color: "#EC4899",
    bgColor: "#FDF2F8",
    content: "Quando você está estressado, o corpo libera cortisol e adrenalina, que aumentam a glicose no sangue. Técnicas que ajudam: respiração diafragmática (inspire 4s, segure 2s, expire 6s), meditação de 5-10 minutos diários e atividades que relaxam como caminhada ao ar livre. Cuidar da mente é tão importante quanto cuidar da alimentação."
  },
  {
    id: 9,
    title: "🏛️ Seus direitos: Medicamentos 100% gratuitos pelo SUS",
    category: "Direitos do Diabético",
    icon: "⚖️",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    content: "Você sabia que a Lei Federal nº 11.347/2006 garante que toda pessoa com diabetes tem direito a receber GRATUITAMENTE pelo SUS os medicamentos e materiais necessários para o tratamento? Isso inclui medicamentos, insulinas, seringas, tiras reagentes e glicosímetros. É lei — e vale para diabetes Tipo 1 e Tipo 2. Muitas pessoas não sabem desse direito e acabam comprando do próprio bolso algo que poderiam receber sem nenhum custo. Continue lendo os próximos artigos para saber exatamente o que você pode retirar e onde."
  },
  {
    id: 10,
    title: "Medicamentos gratuitos na Unidade Básica de Saúde (UBS)",
    category: "Direitos do Diabético",
    icon: "🏥",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    content: "Na farmácia da sua Unidade Básica de Saúde (UBS), ESF (Estratégia Saúde da Família) ou Clínica da Família, você pode retirar GRATUITAMENTE os seguintes medicamentos e insumos para diabetes:\n\n💊 MEDICAMENTOS:\n• Glibenclamida 5mg (comprimidos)\n• Metformina 500mg e 850mg (comprimidos)\n• Gliclazida 30mg e 60mg (comprimidos)\n• Insulina Humana NPH 100 UI/ml (frasco ou caneta)\n• Insulina Humana Regular 100 UI/ml (frasco ou caneta)\n\n🔧 INSUMOS:\n• Tiras reagentes para medir glicemia\n• Lancetas para furar o dedo\n• Seringas com agulha para aplicar insulina\n• Glicosímetro (aparelho de medir glicose — emprestado)\n• Lancetador (emprestado)\n\nDesde 2017, canetas aplicadoras de insulina NPH e Regular também foram incorporadas ao SUS, priorizando pacientes até 19 anos e acima de 45 anos."
  },
  {
    id: 11,
    title: "Farmácia Popular: mais medicamentos gratuitos",
    category: "Direitos do Diabético",
    icon: "💊",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    content: "Além da UBS, o Programa Farmácia Popular do Brasil distribui medicamentos GRATUITOS em mais de 34 mil farmácias privadas credenciadas em todo o país. Basta procurar o selo 'Aqui Tem Farmácia Popular'.\n\n💊 MEDICAMENTOS DISPONÍVEIS:\n• Metformina 500mg, 850mg e 500mg ação prolongada\n• Glibenclamida 5mg\n• Insulina NPH e Regular (frasco ou refil)\n• Dapagliflozina 10mg (inibidor SGLT2 — incorporado em 2022)\n\n📋 O QUE LEVAR:\n• CPF\n• Documento com foto\n• Receita médica (pode ser de médico particular ou do SUS)\n\n⏰ VALIDADE: A receita vale por 120 dias (em alguns casos, até 365 dias). Você pode retirar mensalmente.\n\n👤 TERCEIROS: Outra pessoa pode retirar para você, bastando levar documento próprio com foto, CPF, e procuração do paciente."
  },
  {
    id: 12,
    title: "Medicamentos especializados (Alto Custo) pelo SUS",
    category: "Direitos do Diabético",
    icon: "💉",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    content: "Para casos que necessitam de tratamento mais avançado, o SUS possui o Componente Especializado (popularmente chamado de 'Farmácia de Alto Custo'). Nele estão disponíveis:\n\n💉 MEDICAMENTOS DISPONÍVEIS:\n• Insulinas análogas de ação rápida (100U/ml)\n• Insulinas análogas de ação prolongada (100U/ml) — incorporada ao PCDT de DM1\n• Dapagliflozina 10mg (para DM2 com risco cardiovascular)\n• Ranibizumabe (para edema macular diabético)\n• Aflibercept (para edema macular diabético)\n\n📋 COMO SOLICITAR:\n1. Laudo médico preenchido (LME)\n2. Exames específicos atualizados\n3. Receita médica\n4. Termo de esclarecimento assinado\n5. RG, CPF e Cartão SUS\n6. Comprovante de residência\n\n📍 ONDE: Farmácias de alto custo estaduais ou polos de dispensação municipais.\n\nPara análogos de insulina rápida: máximo de 5 canetas/mês (1500 unidades) e 31 agulhas de 4mm por mês."
  },
  {
    id: 13,
    title: "PRIMEIRO PASSO: Consulta médica e diagnóstico",
    category: "Direitos do Diabético",
    icon: "👨‍⚕️",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    content: "Antes de tudo, você precisa passar por um médico para ter o diagnóstico e a receita. Veja como funciona:\n\n👨‍⚕️ PASSO 1 — CONSULTA MÉDICA:\n• Agende uma consulta na UBS (Unidade Básica de Saúde) mais próxima da sua casa — é gratuito pelo SUS\n• Você também pode ir a um médico particular ou do convênio\n• O médico vai pedir exames de sangue (glicemia em jejum, hemoglobina glicada) para confirmar o diagnóstico\n• Com o diagnóstico confirmado, o médico vai prescrever o tratamento adequado (medicamentos orais, insulina, ou ambos)\n\n📝 PASSO 2 — A RECEITA MÉDICA:\n• O médico deve emitir uma receita médica legível\n• A receita precisa conter: nome genérico do medicamento (ex: 'Cloridrato de Metformina 850mg'), dosagem, frequência de uso, data, assinatura e CRM do médico\n• IMPORTANTE: A receita pode ser de qualquer médico — do SUS, particular ou convênio. Não precisa ser exclusivamente do SUS!\n• Para insulinas: o médico também deve emitir um relatório indicando o tipo de insulina, doses e frequência de monitoramento da glicemia\n\n📋 PASSO 3 — RELATÓRIO MÉDICO (para insumos):\n• Para receber tiras reagentes, seringas, lancetas e glicosímetro, além da receita você precisa de um relatório médico\n• O relatório deve informar: tipo de diabetes, medicamentos em uso, tipo de insulina (se usar), e quantas vezes por dia precisa medir a glicemia\n• Esse relatório é necessário para o cadastro no programa municipal de diabetes da sua cidade"
  },
  {
    id: 131,
    title: "SEGUNDO PASSO: Documentos necessários para retirada",
    category: "Direitos do Diabético",
    icon: "📄",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    content: "Com a receita e o relatório médico em mãos, agora você precisa reunir os documentos. Veja exatamente o que levar em cada caso:\n\n📋 PARA RETIRAR NA UBS (medicamentos + insumos):\n• Receita médica original e legível (com nome genérico do remédio)\n• RG (Documento de identidade)\n• CPF\n• Cartão Nacional do SUS (Cartão SUS) — se não tiver, pode fazer na própria UBS na hora\n• Comprovante de endereço atualizado\n• Relatório médico (para insumos como tiras, seringas e glicosímetro)\n\n📋 PARA RETIRAR NA FARMÁCIA POPULAR:\n• CPF\n• Documento oficial com foto (RG, CNH ou outro)\n• Receita médica (pode ser de médico particular!)\n• Obs: NÃO precisa de Cartão SUS na Farmácia Popular\n\n📋 PARA MEDICAMENTOS DE ALTO CUSTO:\n• Laudo para Solicitação de Medicamentos (LME) — preenchido pelo médico\n• Exames médicos específicos (variam conforme o medicamento)\n• Receita médica atualizada\n• Termo de Esclarecimento e Responsabilidade — assinado pelo médico e pelo paciente\n• RG e CPF\n• Cartão Nacional do SUS\n• Comprovante de residência com CEP\n• E-mail do paciente ou responsável\n\n⚠️ DICA: Tire cópias de tudo antes de entregar! Guarde sempre uma cópia da receita e do relatório com você."
  },
  {
    id: 132,
    title: "TERCEIRO PASSO: Onde ir para retirar (passo a passo final)",
    category: "Direitos do Diabético",
    icon: "🗺️",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    content: "Agora que você já tem a receita, relatório e documentos, veja onde ir:\n\n🏥 OPÇÃO 1 — UBS / POSTO DE SAÚDE:\n1. Vá à UBS mais próxima com todos os documentos\n2. Procure a farmácia da unidade\n3. Apresente a receita e os documentos\n4. Para insumos: peça para ser cadastrado no Programa Municipal de Diabetes\n5. Após o cadastro, retire mensalmente seus medicamentos e insumos\n6. Volte ao médico periodicamente para renovar a receita\n\n💊 OPÇÃO 2 — FARMÁCIA POPULAR:\n1. Busque no Google 'Farmácia Popular perto de mim' ou procure o selo 'Aqui Tem Farmácia Popular'\n2. São mais de 34 mil farmácias privadas credenciadas em todo o Brasil\n3. Apresente CPF, documento com foto e receita\n4. Retire mensalmente — a receita vale por 120 dias\n5. Outra pessoa pode retirar por você com procuração, documento com foto e CPF\n\n🏛️ OPÇÃO 3 — FARMÁCIA DE ALTO CUSTO:\n1. Reúna toda a documentação (LME, exames, receita, termo, documentos pessoais)\n2. Entregue na farmácia de alto custo do seu estado ou no polo de dispensação municipal\n3. Aguarde a análise e aprovação do pedido\n4. Após aprovação, retire mensalmente\n5. A cada 6 meses, renove o processo com novos exames e receita atualizada\n6. Para análogos de insulina: leve também o diário de monitorização da glicemia\n\n📞 SE TIVER PROBLEMAS: Ligue para o Disque 136 (Ouvidoria do SUS) — funciona de segunda a sexta, 8h às 20h, e sábados, 8h às 18h."
  },
  {
    id: 14,
    title: "Tiras reagentes e monitoramento: quantas posso receber?",
    category: "Direitos do Diabético",
    icon: "🩸",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    content: "A Portaria 2.583 do Ministério da Saúde define que pessoas com diabetes em uso de insulina têm direito a tiras reagentes, lancetas e seringas GRATUITAMENTE.\n\n📊 FREQUÊNCIA RECOMENDADA DE TESTES:\n• A recomendação é medir de 3 a 4 vezes por dia\n• Para DM1 e quem usa múltiplas doses de insulina: 3 a 4 testes/dia\n• Inclui medições antes das refeições, 2 horas após e antes de dormir\n• O teste noturno é importante para prevenir hipoglicemia durante o sono\n\n💉 SERINGAS:\n• Devem ser com agulha acoplada\n• A SBD recomenda seringas de 50UI (doses pares e ímpares) ou 100UI (doses maiores)\n• Com agulhas curtas (até 6mm) para evitar aplicação em músculo\n\n📝 OBSERVAÇÃO: Cada município pode ter seu próprio protocolo com quantidades diferentes. Procure a UBS da sua cidade para saber as quantidades exatas disponíveis na sua região."
  },
  {
    id: 15,
    title: "Lei Federal 11.347/2006: conheça a lei que protege você",
    category: "Direitos do Diabético",
    icon: "📜",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    content: "A Lei nº 11.347, de 27 de setembro de 2006, é a lei que GARANTE por escrito os seus direitos como pessoa com diabetes.\n\n📖 O QUE DIZ A LEI:\nArt. 1º — Pessoas com diabetes receberão GRATUITAMENTE do SUS os medicamentos necessários para o tratamento e os materiais para aplicação e monitoramento da glicemia.\n\nArt. 3º — Se houver ATRASO na entrega, você tem direito de cobrar informações à autoridade sanitária municipal.\n\n⚠️ CONDIÇÃO: É necessário estar inscrito em um programa de educação para diabéticos (o cadastro na UBS já cumpre esse requisito na maioria dos municípios).\n\n🔗 FONTES OFICIAIS:\n• Presidência da República (planalto.gov.br)\n• Ministério da Saúde (gov.br/saude)\n• Sociedade Brasileira de Diabetes (diabetes.org.br)\n\n💡 DICA: Guarde essa informação e compartilhe com outros diabéticos. Muitas pessoas não sabem que têm esse direito e acabam gastando dinheiro desnecessariamente."
  },
  {
    id: 16,
    title: "Diabetes Tipo 1: tratamento disponível no SUS",
    category: "Direitos do Diabético",
    icon: "🩺",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    content: "Quem tem Diabetes Tipo 1 precisa de injeções diárias de insulina. O SUS oferece GRATUITAMENTE todo o tratamento necessário:\n\n💉 INSULINAS DISPONÍVEIS:\n• Insulina Humana NPH (ação intermediária) — frasco ou caneta\n• Insulina Humana Regular (ação rápida) — frasco ou caneta\n• Insulinas análogas de ação rápida (no componente especializado)\n• Insulinas análogas de ação prolongada (incorporada ao PCDT)\n\n🔧 INSUMOS PARA APLICAÇÃO:\n• Seringas com agulha acoplada\n• Canetas aplicadoras (priorizando até 19 anos e acima de 45 anos)\n• Agulhas de 4mm para canetas\n\n📊 MONITORAMENTO:\n• Glicosímetro\n• Tiras reagentes (3-4 por dia)\n• Lancetas e lancetador\n\n🏥 ONDE RETIRAR: UBS, Farmácia Popular e Farmácia de Alto Custo (para análogos).\n\n📝 DICA: Mantenha um diário de glicemia — ele é necessário para renovar a dispensação dos análogos de insulina a cada 6 meses."
  },
  {
    id: 17,
    title: "Diabetes Tipo 2: tratamento disponível no SUS",
    category: "Direitos do Diabético",
    icon: "🩺",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    content: "O Diabetes Tipo 2 geralmente começa com medicamentos orais, podendo evoluir para uso de insulina. O SUS cobre todo o tratamento:\n\n💊 MEDICAMENTOS ORAIS GRATUITOS:\n• Metformina 500mg e 850mg — o mais usado, reduz a produção de glicose pelo fígado\n• Glibenclamida 5mg — estimula o pâncreas a produzir mais insulina\n• Gliclazida 30mg e 60mg — age estimulando a produção de insulina\n• Dapagliflozina 10mg — medicamento mais moderno (inibidor SGLT2), disponível na Farmácia Popular e no Componente Especializado\n\n💉 INSULINAS (se necessário):\n• NPH e Regular — disponíveis gratuitamente\n\n⚠️ IMPORTANTE: O DM2 frequentemente vem acompanhado de hipertensão, colesterol alto e obesidade. O SUS também oferece acompanhamento integral para essas condições através da Atenção Primária.\n\n📍 ONDE RETIRAR:\n• Metformina, Glibenclamida: UBS e Farmácia Popular\n• Gliclazida: UBS\n• Dapagliflozina: Farmácia Popular e Farmácia de Alto Custo\n• Insulinas: UBS e Farmácia Popular"
  },
  {
    id: 18,
    title: "Ouvidoria do SUS: saiba como reclamar seus direitos",
    category: "Direitos do Diabético",
    icon: "📞",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    content: "Se você está tendo dificuldades para conseguir seus medicamentos ou insumos gratuitos, saiba que você pode e deve reclamar!\n\n📞 CANAIS DE ATENDIMENTO:\n• Disque 136 — Ouvidoria do SUS (segunda a sexta, 8h às 20h; sábados, 8h às 18h)\n• Secretaria de Saúde do seu município\n• Secretaria Estadual de Saúde\n\n📋 O QUE VOCÊ PODE RECLAMAR:\n• Falta de medicamentos na UBS\n• Atraso na entrega de insulinas ou insumos\n• Negativa de cadastro no programa de diabetes\n• Dificuldade para acessar a Farmácia de Alto Custo\n• Qualquer desrespeito ao seu direito garantido por lei\n\n💡 DICA IMPORTANTE: Alguns estados e municípios possuem protocolos regionais próprios e podem oferecer medicamentos adicionais além da lista nacional. Vale perguntar na sua UBS o que está disponível na sua cidade.\n\n⚖️ PEDIDO ADMINISTRATIVO: Para medicamentos não incluídos nos protocolos, é possível fazer um pedido administrativo à Secretaria de Saúde local, com relatório médico detalhado, exames e receita."
  },
];

const DEFAULT_REMINDERS = [
  { id: 1, title: "Medir glicemia em jejum", time: "07:00", icon: "💉", active: true },
  { id: 2, title: "Café da manhã", time: "08:00", icon: "☕", active: true },
  { id: 3, title: "Medir glicemia (pós café)", time: "10:00", icon: "💉", active: true },
  { id: 4, title: "Almoço", time: "12:00", icon: "🍽️", active: true },
  { id: 5, title: "Medir glicemia (pós almoço)", time: "14:00", icon: "💉", active: true },
  { id: 6, title: "Lanche da tarde", time: "16:00", icon: "🍎", active: true },
  { id: 7, title: "Jantar", time: "19:00", icon: "🍽️", active: true },
  { id: 8, title: "Medir glicemia (noite)", time: "21:00", icon: "💉", active: true },
  { id: 9, title: "Medicação / Insulina", time: "22:00", icon: "💊", active: true },
  { id: 10, title: "Beber água", time: "Ao longo do dia", icon: "💧", active: true },
];

const DEFAULT_CHECKLIST = [
  { id: 1, text: "Medir glicemia pela manhã", done: false },
  { id: 2, text: "Tomar café da manhã equilibrado", done: false },
  { id: 3, text: "Beber pelo menos 2L de água", done: false },
  { id: 4, text: "Fazer 30 min de atividade física", done: false },
  { id: 5, text: "Registrar refeições no app", done: false },
  { id: 6, text: "Tomar medicação/insulina no horário", done: false },
  { id: 7, text: "Preparar lanche saudável", done: false },
  { id: 8, text: "Medir glicemia antes de dormir", done: false },
];

const TRAVEL_CHECKLIST_TYPE1 = [
  // Medicação e Insulina
  { id: "t1-1", text: "Insulina de ação rápida (dose extra para emergência)", category: "💉 Insulina", done: false },
  { id: "t1-2", text: "Insulina de ação lenta/intermediária (NPH ou análoga)", category: "💉 Insulina", done: false },
  { id: "t1-3", text: "Canetas de insulina ou seringas extras", category: "💉 Insulina", done: false },
  { id: "t1-4", text: "Agulhas extras para canetas (pelo menos o dobro)", category: "💉 Insulina", done: false },
  { id: "t1-5", text: "Bolsa térmica para transportar insulina", category: "💉 Insulina", done: false },
  { id: "t1-6", text: "Gelo reutilizável ou gelpack (nunca congelar insulina)", category: "💉 Insulina", done: false },
  // Monitoramento
  { id: "t1-7", text: "Glicosímetro (aparelho de medir glicemia)", category: "🩸 Monitoramento", done: false },
  { id: "t1-8", text: "Tiras reagentes (levar o dobro do necessário)", category: "🩸 Monitoramento", done: false },
  { id: "t1-9", text: "Lancetas e lancetador", category: "🩸 Monitoramento", done: false },
  { id: "t1-10", text: "Pilhas/bateria extra para o glicosímetro", category: "🩸 Monitoramento", done: false },
  { id: "t1-11", text: "Sensor de glicose extra (se usar CGM/Libre)", category: "🩸 Monitoramento", done: false },
  // Alimentação de emergência
  { id: "t1-12", text: "Sachês de glicose ou balas para hipoglicemia", category: "🍬 Emergência alimentar", done: false },
  { id: "t1-13", text: "Suco de laranja em caixinha (fonte rápida de açúcar)", category: "🍬 Emergência alimentar", done: false },
  { id: "t1-14", text: "Biscoitos ou barras de cereal (lanches rápidos)", category: "🍬 Emergência alimentar", done: false },
  { id: "t1-15", text: "Castanhas ou mix de nuts (lanche saudável)", category: "🍬 Emergência alimentar", done: false },
  { id: "t1-16", text: "Garrafinha de água", category: "🍬 Emergência alimentar", done: false },
  // Documentos
  { id: "t1-17", text: "Receita médica atualizada (insulinas e insumos)", category: "📋 Documentos", done: false },
  { id: "t1-18", text: "Relatório médico em português e inglês (viagem internacional)", category: "📋 Documentos", done: false },
  { id: "t1-19", text: "Cartão SUS e convênio médico", category: "📋 Documentos", done: false },
  { id: "t1-20", text: "Carteirinha ou pulseira de identificação diabético", category: "📋 Documentos", done: false },
  { id: "t1-21", text: "Lista de contatos de emergência", category: "📋 Documentos", done: false },
  { id: "t1-22", text: "Seguro viagem (viagem internacional)", category: "📋 Documentos", done: false },
  // Outros
  { id: "t1-23", text: "Álcool em gel ou algodão com álcool", category: "🎒 Outros", done: false },
  { id: "t1-24", text: "Descartex portátil (para agulhas usadas)", category: "🎒 Outros", done: false },
  { id: "t1-25", text: "Meias confortáveis (proteção dos pés)", category: "🎒 Outros", done: false },
  { id: "t1-26", text: "Calçado confortável e adequado", category: "🎒 Outros", done: false },
  { id: "t1-27", text: "Protetor solar (evitar queimaduras que afetam glicemia)", category: "🎒 Outros", done: false },
  { id: "t1-28", text: "Dividir insumos em 2 bolsas (caso perca uma)", category: "🎒 Outros", done: false },
];

const TRAVEL_CHECKLIST_TYPE2 = [
  // Medicação
  { id: "t2-1", text: "Medicamentos orais (Metformina, Gliclazida, etc.)", category: "💊 Medicação", done: false },
  { id: "t2-2", text: "Medicamentos extras (levar o dobro para emergência)", category: "💊 Medicação", done: false },
  { id: "t2-3", text: "Insulina (se usar) com canetas/seringas extras", category: "💊 Medicação", done: false },
  { id: "t2-4", text: "Bolsa térmica para insulina (se usar)", category: "💊 Medicação", done: false },
  { id: "t2-5", text: "Medicamentos para pressão arterial (se usar)", category: "💊 Medicação", done: false },
  { id: "t2-6", text: "Medicamentos para colesterol (se usar)", category: "💊 Medicação", done: false },
  // Monitoramento
  { id: "t2-7", text: "Glicosímetro (aparelho de medir glicemia)", category: "🩸 Monitoramento", done: false },
  { id: "t2-8", text: "Tiras reagentes (levar o dobro)", category: "🩸 Monitoramento", done: false },
  { id: "t2-9", text: "Lancetas e lancetador", category: "🩸 Monitoramento", done: false },
  { id: "t2-10", text: "Pilhas/bateria extra para o glicosímetro", category: "🩸 Monitoramento", done: false },
  // Alimentação
  { id: "t2-11", text: "Sachês de glicose ou balas (para hipoglicemia)", category: "🍬 Emergência alimentar", done: false },
  { id: "t2-12", text: "Suco de laranja em caixinha", category: "🍬 Emergência alimentar", done: false },
  { id: "t2-13", text: "Lanches saudáveis (castanhas, frutas secas, barras)", category: "🍬 Emergência alimentar", done: false },
  { id: "t2-14", text: "Garrafinha de água", category: "🍬 Emergência alimentar", done: false },
  // Documentos
  { id: "t2-15", text: "Receita médica atualizada", category: "📋 Documentos", done: false },
  { id: "t2-16", text: "Relatório médico (viagem internacional)", category: "📋 Documentos", done: false },
  { id: "t2-17", text: "Cartão SUS e convênio médico", category: "📋 Documentos", done: false },
  { id: "t2-18", text: "Carteirinha ou pulseira de identificação diabético", category: "📋 Documentos", done: false },
  { id: "t2-19", text: "Lista de contatos de emergência", category: "📋 Documentos", done: false },
  { id: "t2-20", text: "Seguro viagem (viagem internacional)", category: "📋 Documentos", done: false },
  // Outros
  { id: "t2-21", text: "Álcool em gel", category: "🎒 Outros", done: false },
  { id: "t2-22", text: "Meias confortáveis (proteção dos pés)", category: "🎒 Outros", done: false },
  { id: "t2-23", text: "Calçado confortável e adequado", category: "🎒 Outros", done: false },
  { id: "t2-24", text: "Protetor solar", category: "🎒 Outros", done: false },
  { id: "t2-25", text: "Dividir medicamentos em 2 bolsas", category: "🎒 Outros", done: false },
];

const EMERGENCY_KIT = {
  "Tipo 1": [
    { icon: "💉", title: "Insulina de ação rápida", desc: "Para corrigir hiperglicemia de urgência. Mantenha sempre acessível." },
    { icon: "🍬", title: "Sachês de glicose (15g cada)", desc: "Para tratar hipoglicemia imediata. Leve no mínimo 5 sachês." },
    { icon: "🧃", title: "Suco de laranja ou refrigerante comum", desc: "Fonte rápida de açúcar. Caixinha de 200ml resolve hipoglicemia em 15 min." },
    { icon: "🩸", title: "Glicosímetro + tiras + lancetas", desc: "Para medir a glicemia antes de tomar qualquer decisão." },
    { icon: "💉", title: "Glucagon injetável", desc: "Para hipoglicemia severa quando a pessoa não consegue engolir. Alguém próximo deve saber aplicar." },
    { icon: "📋", title: "Cartão de identificação", desc: "Com nome, tipo de diabetes, medicações, contato de emergência e médico." },
    { icon: "📱", title: "Contatos de emergência no celular", desc: "SAMU 192, médico, familiar. Deixe na tela de bloqueio do celular." },
    { icon: "💧", title: "Água mineral", desc: "Hidratação é essencial em crises de hiperglicemia." },
    { icon: "🍪", title: "Lanche com carboidrato complexo", desc: "Biscoito integral ou barra de cereal para após corrigir a hipoglicemia." },
  ],
  "Tipo 2": [
    { icon: "💊", title: "Medicamentos orais extras", desc: "Sempre leve doses extras dos seus medicamentos diários." },
    { icon: "🍬", title: "Sachês de glicose (15g cada)", desc: "Para tratar hipoglicemia caso use sulfoniluréias ou insulina." },
    { icon: "🧃", title: "Suco de laranja ou refrigerante comum", desc: "Fonte rápida de açúcar para emergência." },
    { icon: "🩸", title: "Glicosímetro + tiras + lancetas", desc: "Para medir a glicemia e tomar decisões informadas." },
    { icon: "📋", title: "Cartão de identificação", desc: "Com nome, tipo de diabetes, medicações, contato de emergência e médico." },
    { icon: "📱", title: "Contatos de emergência no celular", desc: "SAMU 192, médico, familiar. Deixe na tela de bloqueio." },
    { icon: "💧", title: "Água mineral", desc: "Hidratação ajuda a baixar a glicemia naturalmente." },
    { icon: "🍪", title: "Lanche saudável", desc: "Castanhas ou barra de cereal para manter energia estável." },
    { icon: "💉", title: "Insulina (se prescrita)", desc: "Se faz uso de insulina, leve doses extras e bolsa térmica." },
  ],
};

// ==================== DAILY MOTIVATION ====================
const MOTIVATIONAL_PHRASES = [
  { text: "Cada medição é um passo rumo ao controle. Você está no caminho certo!", emoji: "💪" },
  { text: "Diabetes não define quem você é. Sua força e disciplina sim.", emoji: "🌟" },
  { text: "Cuidar de si mesmo não é egoísmo, é necessidade. Você merece!", emoji: "❤️" },
  { text: "Hoje é um novo dia para fazer escolhas que cuidam do seu corpo.", emoji: "🌅" },
  { text: "Pequenas mudanças diárias geram grandes resultados ao longo do tempo.", emoji: "🚀" },
  { text: "Você é mais forte do que qualquer pico de glicose. Continue firme!", emoji: "💚" },
  { text: "A consistência é mais poderosa do que a perfeição. Faça o seu melhor hoje.", emoji: "⭐" },
  { text: "Seu corpo é seu maior patrimônio. Investir nele sempre vale a pena.", emoji: "🏆" },
  { text: "Não se compare com os outros. Sua jornada é única e valiosa.", emoji: "🌈" },
  { text: "A alimentação é o combustível da sua liberdade. Escolha com sabedoria.", emoji: "🍎" },
  { text: "Cada refeição equilibrada é uma vitória silenciosa. Comemore!", emoji: "🎉" },
  { text: "Controlar o diabetes é um ato de amor próprio todos os dias.", emoji: "💙" },
  { text: "Não existe caminho fácil, mas existe um caminho que vale a pena.", emoji: "🛤️" },
  { text: "Seu esforço de hoje é a saúde do seu amanhã. Continue!", emoji: "🌱" },
  { text: "Você não está sozinho nessa jornada. O GlicoVida está com você!", emoji: "🤝" },
  { text: "A água é sua aliada silenciosa. Mantenha-se hidratado hoje!", emoji: "💧" },
  { text: "Mexer o corpo é libertar a mente. Que tal uma caminhada hoje?", emoji: "🏃" },
  { text: "Dormir bem é tão importante quanto comer bem. Cuide do seu sono.", emoji: "😴" },
  { text: "Respirar fundo pode acalmar o corpo e estabilizar a glicemia.", emoji: "🧘" },
  { text: "O conhecimento é sua maior arma contra o diabetes. Continue aprendendo!", emoji: "📚" },
  { text: "Gratidão pelo seu corpo transforma a forma como você cuida dele.", emoji: "🙏" },
  { text: "Cada dia organizado é um dia de liberdade conquistada.", emoji: "📋" },
  { text: "Não tenha medo de pedir ajuda. Isso é sinal de inteligência.", emoji: "🫂" },
  { text: "Sua rotina é a base do seu controle. Valorize cada hábito!", emoji: "🔥" },
  { text: "Acredite: é possível viver com leveza, mesmo com diabetes.", emoji: "🕊️" },
  { text: "O prato do diabético pode ser colorido, saboroso e equilibrado!", emoji: "🥗" },
  { text: "Você já percorreu um caminho incrível. Olhe para trás e se orgulhe.", emoji: "👏" },
  { text: "Medir a glicemia não é uma obrigação, é um ato de autocuidado.", emoji: "🩸" },
  { text: "A vida com diabetes tem desafios, mas também tem muitas conquistas.", emoji: "🏅" },
  { text: "Hoje é o dia perfeito para dar mais um passo na direção certa.", emoji: "👣" },
];
const getDailyPhrase = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(),0,0)) / 86400000);
  return MOTIVATIONAL_PHRASES[dayOfYear % MOTIVATIONAL_PHRASES.length];
};

// ==================== FAQ ====================
const FAQ_DATA = [
  { q: "O que é diabetes tipo 1?", a: "É uma doença autoimune onde o pâncreas não produz insulina. O corpo ataca as células que produzem insulina, por isso a pessoa precisa de injeções diárias de insulina para sobreviver. Geralmente é diagnosticada na infância ou adolescência, mas pode surgir em qualquer idade." },
  { q: "O que é diabetes tipo 2?", a: "É quando o corpo não usa a insulina de forma eficiente (resistência à insulina) ou não produz insulina suficiente. É o tipo mais comum, geralmente ligado ao estilo de vida, obesidade e genética. Pode ser controlado com alimentação, exercícios e medicamentos orais, mas às vezes requer insulina." },
  { q: "Qual o nível normal de glicemia?", a: "Em jejum: 70 a 99 mg/dL é considerado normal. Após as refeições (2 horas): até 140 mg/dL. Valores entre 100-125 mg/dL em jejum indicam pré-diabetes. Acima de 126 mg/dL em jejum (em duas medições) indica diabetes." },
  { q: "O que é hipoglicemia e como tratar?", a: "É quando a glicose cai abaixo de 70 mg/dL. Sintomas: tremores, suor frio, tontura, confusão. Tratamento imediato: consumir 15g de carboidrato rápido (meio copo de suco, 1 colher de mel ou 3 balas de glicose), esperar 15 minutos e medir novamente." },
  { q: "O que é hiperglicemia?", a: "É quando a glicose fica acima de 180 mg/dL. Pode ser causada por excesso de carboidratos, falta de medicação, estresse ou doença. Sintomas: sede excessiva, urina frequente, cansaço, visão turva. Beba água, verifique a medicação e procure médico se persistir acima de 300 mg/dL." },
  { q: "Diabético pode comer doce?", a: "Sim! O segredo não é eliminar, mas saber como e quando comer. Prefira doces após refeições ricas em fibras e proteínas. Escolha porções pequenas e evite comer doces isoladamente. Frutas com baixo índice glicêmico são ótimas opções de sobremesa." },
  { q: "O que é índice glicêmico (IG)?", a: "É uma escala de 0 a 100 que classifica os alimentos conforme a velocidade com que elevam a glicose no sangue. IG baixo (até 55): liberam açúcar lentamente. IG médio (56-69): moderado. IG alto (70+): elevam rápido a glicose. Preferir alimentos com IG baixo ajuda no controle." },
  { q: "Como contar carboidratos?", a: "Leia os rótulos dos alimentos e procure 'carboidratos totais' por porção. Para alimentos sem rótulo, use tabelas de referência (como a biblioteca deste app). Some todos os carboidratos da refeição para estimar o impacto na glicemia. Com o tempo, você ganha prática." },
  { q: "Exercício físico ajuda no diabetes?", a: "Sim, muito! O exercício aumenta a sensibilidade à insulina, ajuda a controlar o peso e reduz a glicemia. Recomenda-se 150 minutos por semana de atividade moderada (caminhada, bicicleta). Meça a glicemia antes e depois. Se usar insulina, tenha um lanche por perto." },
  { q: "Quais exames o diabético deve fazer?", a: "Hemoglobina glicada (HbA1c) a cada 3-6 meses, glicemia em jejum, perfil lipídico (colesterol), função renal (creatinina e microalbuminúria), exame de fundo de olho anualmente, exame dos pés. Converse com seu médico sobre a frequência ideal." },
  { q: "Estresse afeta a glicemia?", a: "Sim! O estresse libera cortisol e adrenalina, que aumentam a glicose no sangue. Além disso, o estresse pode levar a escolhas alimentares ruins e abandono da rotina. Técnicas como respiração, meditação e exercícios ajudam a controlar." },
  { q: "Posso pegar medicamentos gratuitos pelo SUS?", a: "Sim! A Lei Federal 11.347/2006 garante medicamentos e insumos gratuitos para diabéticos. Inclui insulina, metformina, glibenclamida, gliclazida, tiras reagentes, seringas e glicosímetro. Consulte a aba 'Aprender' do app para o passo a passo completo." },
  { q: "Qual a diferença entre insulina NPH e Regular?", a: "A NPH é de ação intermediária — começa a agir em 2-4 horas e dura 12-18 horas. Usada para controle basal. A Regular é de ação rápida — começa em 30-60 minutos e dura 6-8 horas. Usada antes das refeições para cobrir os carboidratos." },
  { q: "Preciso medir a glicemia todos os dias?", a: "O ideal é sim, especialmente se usar insulina. A recomendação é 3-4 vezes por dia (jejum, antes e após refeições, antes de dormir). Para diabetes tipo 2 sem insulina, a frequência pode ser menor — converse com seu médico." },
];

// ==================== RECIPES ====================
const RECIPES_DATA = [
  { id: 1, name: "Omelete de espinafre com tomate", time: "10 min", carbs: 3, gi: "baixo", emoji: "🥚", category: "Café da manhã",
    ingredients: "2 ovos, 1 xícara de espinafre, 3 tomates-cereja, sal e pimenta a gosto, 1 colher de azeite",
    steps: "1. Bata os ovos com sal e pimenta. 2. Aqueça o azeite na frigideira. 3. Refogue o espinafre por 1 minuto. 4. Despeje os ovos e adicione os tomates cortados. 5. Cozinhe em fogo baixo até firmar. Sirva!" },
  { id: 2, name: "Salada colorida com quinoa e frango", time: "20 min", carbs: 22, gi: "baixo", emoji: "🥗", category: "Almoço",
    ingredients: "100g de peito de frango grelhado, 1/2 xícara de quinoa cozida, rúcula, tomate, pepino, cenoura ralada, azeite e limão",
    steps: "1. Cozinhe a quinoa e reserve. 2. Grelhe o frango e corte em tiras. 3. Monte a salada com rúcula, tomate, pepino e cenoura. 4. Adicione a quinoa e o frango. 5. Tempere com azeite e limão." },
  { id: 3, name: "Mousse de abacate com cacau", time: "5 min", carbs: 8, gi: "baixo", emoji: "🥑", category: "Sobremesa",
    ingredients: "1/2 abacate maduro, 1 colher de sopa de cacau em pó, 1 colher de chá de adoçante natural (estévia/eritritol), essência de baunilha",
    steps: "1. Bata todos os ingredientes no liquidificador ou com garfo. 2. Ajuste o adoçante ao gosto. 3. Leve à geladeira por 30 min (opcional). 4. Sirva em porções pequenas. Delícia sem culpa!" },
  { id: 4, name: "Sopa cremosa de abóbora com gengibre", time: "30 min", carbs: 14, gi: "médio", emoji: "🥣", category: "Jantar",
    ingredients: "300g de abóbora, 1 pedaço de gengibre ralado, 1 cebola, 2 dentes de alho, caldo de legumes, sal e noz-moscada",
    steps: "1. Refogue cebola e alho em azeite. 2. Adicione a abóbora em cubos e o gengibre. 3. Cubra com caldo e cozinhe até amolecer. 4. Bata no liquidificador. 5. Tempere com sal e noz-moscada. Sirva quente." },
  { id: 5, name: "Iogurte natural com chia e frutas vermelhas", time: "3 min", carbs: 12, gi: "baixo", emoji: "🫐", category: "Lanche",
    ingredients: "1 pote de iogurte natural sem açúcar, 1 colher de sopa de chia, morangos ou mirtilos, canela a gosto",
    steps: "1. Coloque o iogurte em um pote. 2. Adicione a chia e misture. 3. Cubra com frutas vermelhas. 4. Polvilhe canela. Pronto! Lanche rápido e nutritivo." },
  { id: 6, name: "Frango grelhado com legumes assados", time: "35 min", carbs: 10, gi: "baixo", emoji: "🍗", category: "Almoço",
    ingredients: "1 peito de frango, abobrinha, berinjela, pimentão, cebola roxa, azeite, alecrim, sal e pimenta",
    steps: "1. Tempere o frango com alecrim, sal e pimenta. 2. Corte os legumes em fatias. 3. Regue tudo com azeite. 4. Asse no forno a 200°C por 25-30 minutos. 5. Sirva com salada verde." },
  { id: 7, name: "Panqueca de aveia com banana", time: "15 min", carbs: 25, gi: "médio", emoji: "🥞", category: "Café da manhã",
    ingredients: "1 banana madura, 2 ovos, 3 colheres de aveia, canela a gosto, 1 colher de óleo de coco",
    steps: "1. Amasse a banana com garfo. 2. Misture os ovos e a aveia. 3. Adicione canela. 4. Aqueça óleo de coco na frigideira. 5. Despeje porções da massa e doure dos dois lados. Sirva com frutas." },
  { id: 8, name: "Wrap de atum com folhas verdes", time: "10 min", carbs: 18, gi: "médio", emoji: "🌯", category: "Lanche",
    ingredients: "1 tortilha integral, 1 lata de atum, alface, tomate, cenoura ralada, 1 colher de iogurte natural, limão",
    steps: "1. Escorra o atum e misture com iogurte e limão. 2. Forre a tortilha com alface. 3. Adicione o atum, tomate e cenoura. 4. Enrole firme. 5. Corte ao meio e sirva." },
  { id: 9, name: "Peixe grelhado com purê de couve-flor", time: "25 min", carbs: 6, gi: "baixo", emoji: "🐟", category: "Jantar",
    ingredients: "1 filé de peixe (tilápia ou salmão), couve-flor, alho, azeite, limão, sal, salsinha",
    steps: "1. Cozinhe a couve-flor até ficar macia. 2. Bata com alho e azeite até virar purê. 3. Tempere o peixe com limão e sal. 4. Grelhe em frigideira com azeite. 5. Sirva o peixe sobre o purê e finalize com salsinha." },
  { id: 10, name: "Mix de castanhas e chocolate amargo", time: "2 min", carbs: 10, gi: "baixo", emoji: "🥜", category: "Lanche",
    ingredients: "5 castanhas-de-caju, 5 amêndoas, 3 nozes, 2 quadradinhos de chocolate amargo 70%",
    steps: "1. Separe as porções em um potinho. 2. Pronto! Lanche perfeito para ter na bolsa. Rico em gorduras boas e com baixo impacto glicêmico." },
];

// ==================== BONUSES ====================
const BONUSES_DATA = [
  { icon: "📖", title: "E-book: Diabetes no Controle", desc: "Guia completo com a metodologia Alavanca Glicêmica Zero. Aprenda a comer de tudo sem restrições, entendendo a ordem e combinação dos alimentos.", tag: "Bônus Principal" },
  { icon: "🗓️", title: "13 Cardápios Semanais", desc: "Cardápios completos e variados com café da manhã, almoço, lanche e jantar organizados para cada semana. Pronto para seguir e se organizar.", tag: "Bônus" },
  { icon: "✅", title: "Checklist para Consulta Médica", desc: "Lista com perguntas essenciais para fazer ao seu médico. Nunca mais saia da consulta com dúvidas — vá preparado e aproveite ao máximo.", tag: "Bônus" },
  { icon: "📋", title: "Checklist Diabetes Tipo 1", desc: "Checklist exclusivo com os cuidados essenciais para quem convive com diabetes tipo 1. Organização diária, semanal e mensal.", tag: "Bônus Tipo 1" },
  { icon: "📋", title: "Checklist Diabetes Tipo 2", desc: "Checklist exclusivo com os cuidados essenciais para quem convive com diabetes tipo 2. Alimentação, exercícios e acompanhamento.", tag: "Bônus Tipo 2" },
  { icon: "📊", title: "Plano Alimentar Imprimível", desc: "Tabela completa para você imprimir e preencher com suas refeições da semana, glicemias e observações. Ideal para ter controle visual.", tag: "Bônus" },
];

// ==================== GLOSSARY ====================
const GLOSSARY_DATA = [
  { term: "Glicemia", def: "Nível de açúcar (glicose) no sangue. Medido em mg/dL." },
  { term: "HbA1c (Hemoglobina Glicada)", def: "Exame que mostra a média da glicemia dos últimos 2-3 meses. O ideal é abaixo de 7% para a maioria dos diabéticos." },
  { term: "Hipoglicemia", def: "Glicose abaixo de 70 mg/dL. Causa tremores, suor, tontura. Tratar com 15g de carboidrato rápido." },
  { term: "Hiperglicemia", def: "Glicose acima de 180 mg/dL. Pode causar sede excessiva, urina frequente, cansaço." },
  { term: "Índice Glicêmico (IG)", def: "Escala de 0-100 que mede a velocidade com que um alimento eleva a glicose. Baixo (≤55), Médio (56-69), Alto (≥70)." },
  { term: "Carga Glicêmica (CG)", def: "Considera o IG e a quantidade de carboidratos. Dá uma visão mais completa do impacto do alimento na glicose." },
  { term: "Insulina", def: "Hormônio produzido pelo pâncreas que permite a glicose entrar nas células. Diabéticos tipo 1 não produzem; tipo 2 têm resistência." },
  { term: "Insulina NPH", def: "Insulina de ação intermediária. Começa a agir em 2-4h, dura 12-18h. Usada para controle basal." },
  { term: "Insulina Regular", def: "Insulina de ação rápida. Começa em 30-60min, dura 6-8h. Usada antes das refeições." },
  { term: "Insulina Análoga", def: "Insulina modificada em laboratório para agir mais rápido ou mais lento que as humanas. Ex: Lispro, Glargina." },
  { term: "Resistência à Insulina", def: "Quando as células do corpo não respondem bem à insulina. Comum na diabetes tipo 2." },
  { term: "Cetoacidose Diabética", def: "Complicação grave quando falta insulina. O corpo queima gordura e produz cetonas ácidas. Requer atendimento urgente." },
  { term: "Glicosímetro", def: "Aparelho portátil para medir a glicemia no sangue através de uma gota no dedo." },
  { term: "Tiras Reagentes", def: "Fitas descartáveis usadas no glicosímetro para medir a glicose no sangue." },
  { term: "Lanceta", def: "Agulha fina descartável usada para furar a ponta do dedo e obter a gota de sangue." },
  { term: "Fator de Correção (FC)", def: "Quantos mg/dL de glicose 1 unidade de insulina rápida reduz. Ex: FC=50 significa que 1U baixa 50mg/dL." },
  { term: "Relação I:C", def: "Relação Insulina:Carboidrato. Quantos gramas de carboidrato 1 unidade de insulina cobre. Ex: 1:15 = 1U para 15g." },
  { term: "Contagem de Carboidratos", def: "Método de estimar os gramas de carboidratos de uma refeição para calcular a dose de insulina." },
  { term: "Metformina", def: "Medicamento oral mais usado no diabetes tipo 2. Reduz a produção de glicose pelo fígado." },
  { term: "Glibenclamida", def: "Medicamento oral que estimula o pâncreas a produzir mais insulina. Classe: sulfonilureia." },
  { term: "Dapagliflozina", def: "Medicamento que faz os rins eliminarem glicose pela urina (inibidor SGLT2). Disponível no SUS desde 2022." },
  { term: "RENAME", def: "Relação Nacional de Medicamentos Essenciais — lista oficial de medicamentos disponíveis pelo SUS." },
  { term: "Pé Diabético", def: "Complicação que afeta os pés por danos nos nervos e circulação. Pode causar feridas que não cicatrizam." },
  { term: "Neuropatia Diabética", def: "Dano nos nervos causado pela glicemia alta crônica. Causa formigamento, dor ou perda de sensibilidade." },
  { term: "Retinopatia Diabética", def: "Dano nos vasos dos olhos causado pela diabetes. Pode levar à perda de visão se não tratada." },
];

// ==================== SUBSTITUTIONS ====================
const SUBSTITUTIONS_DATA = [
  { original: "Arroz branco", substitute: "Arroz integral ou Quinoa", carbsSaved: "9-28g", igChange: "Alto → Baixo/Médio", tip: "A quinoa tem mais proteína e fibra, mantendo a saciedade por mais tempo." },
  { original: "Pão francês", substitute: "Pão integral ou Pão de centeio", carbsSaved: "12-16g", igChange: "Alto → Médio", tip: "O pão integral libera energia mais lentamente, evitando picos." },
  { original: "Batata inglesa", substitute: "Batata-doce ou Mandioquinha", carbsSaved: "0-3g", igChange: "Alto → Médio", tip: "A batata-doce tem mais fibras e vitaminas, com menor impacto glicêmico." },
  { original: "Macarrão branco", substitute: "Macarrão integral ou de legumes", carbsSaved: "3-10g", igChange: "Alto → Médio", tip: "Massas integrais retardam a digestão e evitam picos rápidos." },
  { original: "Açúcar refinado", substitute: "Estévia, Eritritol ou Xilitol", carbsSaved: "12g", igChange: "Alto → Zero", tip: "Adoçantes naturais não impactam a glicemia e mantêm o sabor." },
  { original: "Farinha de trigo", substitute: "Farinha de amêndoas ou de coco", carbsSaved: "9-12g", igChange: "Alto → Baixo", tip: "Farinhas alternativas são ricas em fibras e gorduras boas." },
  { original: "Refrigerante comum", substitute: "Refrigerante zero ou Água com gás e limão", carbsSaved: "39g", igChange: "Alto → Zero", tip: "Eliminar refrigerante comum é uma das mudanças de maior impacto." },
  { original: "Suco de frutas", substitute: "Fruta inteira ou Suco verde", carbsSaved: "10-18g", igChange: "Médio → Baixo", tip: "A fruta inteira tem fibras que retardam a absorção do açúcar." },
  { original: "Cereal matinal", substitute: "Aveia em flocos ou Granola sem açúcar", carbsSaved: "10-17g", igChange: "Alto → Médio", tip: "A aveia é rica em beta-glucana, que ajuda a controlar a glicemia." },
  { original: "Chocolate ao leite", substitute: "Chocolate amargo 70%+", carbsSaved: "5g", igChange: "Alto → Baixo", tip: "O chocolate amargo tem menos açúcar e é rico em antioxidantes." },
  { original: "Leite integral", substitute: "Leite de amêndoas ou de coco sem açúcar", carbsSaved: "8-9g", igChange: "Baixo → Baixo", tip: "Leites vegetais sem açúcar têm muito menos carboidratos." },
  { original: "Sorvete", substitute: "Iogurte natural congelado com frutas", carbsSaved: "10-15g", igChange: "Alto → Baixo", tip: "Congele iogurte natural com frutas vermelhas para um 'sorvete' saudável." },
];

// ==================== MORE RECIPES (expanding to 30+) ====================
const EXTRA_RECIPES = [
  { id: 11, name: "Salmão assado com aspargos", time: "25 min", carbs: 4, gi: "baixo", emoji: "🐟", category: "Jantar", ingredients: "1 filé de salmão, aspargos, azeite, limão, alho, sal, pimenta, endro", steps: "1. Tempere o salmão com limão, alho e endro. 2. Disponha os aspargos ao lado. 3. Regue com azeite. 4. Asse a 200°C por 20 minutos. Pronto!" },
  { id: 12, name: "Ovos mexidos com cottage e tomate", time: "8 min", carbs: 4, gi: "baixo", emoji: "🥚", category: "Café da manhã", ingredients: "3 ovos, 2 col. sopa de queijo cottage, tomate picado, cebolinha, sal, azeite", steps: "1. Bata os ovos levemente. 2. Cozinhe em fogo baixo com azeite. 3. Adicione cottage e tomate. 4. Finalize com cebolinha." },
  { id: 13, name: "Salada caesar com frango grelhado", time: "15 min", carbs: 8, gi: "baixo", emoji: "🥗", category: "Almoço", ingredients: "Alface romana, frango grelhado, parmesão ralado, croutons integrais (poucos), molho caesar light", steps: "1. Grelhe o frango e corte em tiras. 2. Monte com alface e parmesão. 3. Adicione poucos croutons integrais. 4. Regue com molho." },
  { id: 14, name: "Smoothie verde proteico", time: "5 min", carbs: 14, gi: "baixo", emoji: "🥤", category: "Lanche", ingredients: "1 folha de couve, 1/2 banana congelada, 1 col. de pasta de amendoim, 200ml de leite de amêndoas, gelo", steps: "1. Bata tudo no liquidificador por 1 minuto. 2. Sirva gelado. Nutritivo e saciante!" },
  { id: 15, name: "Berinjela recheada com carne moída", time: "35 min", carbs: 12, gi: "baixo", emoji: "🍆", category: "Jantar", ingredients: "2 berinjelas, 200g carne moída magra, cebola, alho, tomate, queijo minas ralado, temperos", steps: "1. Corte as berinjelas ao meio e escave. 2. Refogue a carne com cebola, alho e tomate. 3. Recheie as berinjelas. 4. Cubra com queijo. 5. Asse por 20min a 180°C." },
  { id: 16, name: "Torta de legumes sem massa", time: "40 min", carbs: 10, gi: "baixo", emoji: "🥧", category: "Almoço", ingredients: "3 ovos, brócolis, cenoura, abobrinha, queijo minas, sal, orégano", steps: "1. Cozinhe e pique os legumes. 2. Bata os ovos com sal. 3. Misture legumes e queijo. 4. Despeje em forma untada. 5. Asse 30min a 180°C." },
  { id: 17, name: "Tabule de quinoa", time: "20 min", carbs: 18, gi: "baixo", emoji: "🌿", category: "Almoço", ingredients: "Quinoa cozida, tomate, pepino, cebola roxa, salsinha, hortelã, limão, azeite", steps: "1. Cozinhe a quinoa e esfrie. 2. Pique todos os vegetais e ervas. 3. Misture tudo. 4. Tempere com limão e azeite." },
  { id: 18, name: "Crepioca de queijo e espinafre", time: "10 min", carbs: 8, gi: "baixo", emoji: "🥞", category: "Café da manhã", ingredients: "1 ovo, 1 col. sopa de goma de tapioca, espinafre, queijo minas, sal", steps: "1. Misture ovo e goma. 2. Despeje na frigideira. 3. Adicione espinafre e queijo. 4. Dobre e sirva." },
  { id: 19, name: "Espetinhos de frango com legumes", time: "25 min", carbs: 6, gi: "baixo", emoji: "🍢", category: "Jantar", ingredients: "Peito de frango em cubos, pimentão, cebola, abobrinha, azeite, temperos", steps: "1. Monte os espetinhos alternando frango e legumes. 2. Tempere com azeite e ervas. 3. Grelhe ou asse por 15-20 minutos." },
  { id: 20, name: "Mingau de aveia com canela", time: "10 min", carbs: 20, gi: "médio", emoji: "🥣", category: "Café da manhã", ingredients: "3 col. sopa de aveia, 200ml de leite vegetal, canela, 5 morangos, 1 col. chá de mel (opcional)", steps: "1. Cozinhe a aveia no leite em fogo baixo. 2. Mexa até engrossar. 3. Adicione canela e morangos. Café da manhã perfeito!" },
  { id: 21, name: "Bolinho de atum assado", time: "30 min", carbs: 8, gi: "baixo", emoji: "🐟", category: "Lanche", ingredients: "1 lata de atum, 1 ovo, 2 col. sopa de aveia, cebola picada, salsinha, sal", steps: "1. Misture todos os ingredientes. 2. Modele bolinhos. 3. Coloque em assadeira untada. 4. Asse 20min a 180°C, virando na metade." },
  { id: 22, name: "Chips de abobrinha no forno", time: "25 min", carbs: 5, gi: "baixo", emoji: "🥒", category: "Lanche", ingredients: "2 abobrinhas, azeite, sal, páprica, alho em pó", steps: "1. Fatie as abobrinhas bem finas. 2. Tempere com azeite e especiarias. 3. Espalhe na assadeira. 4. Asse a 200°C por 20min até ficarem crocantes." },
  { id: 23, name: "Frango xadrez low carb", time: "20 min", carbs: 8, gi: "baixo", emoji: "🍗", category: "Almoço", ingredients: "300g frango em cubos, pimentão colorido, amendoim, shoyu, gengibre, alho, azeite", steps: "1. Refogue frango em cubos. 2. Adicione pimentões e temperos. 3. Junte shoyu e gengibre. 4. Finalize com amendoim." },
  { id: 24, name: "Pudim de chia com frutas", time: "5 min + geladeira", carbs: 15, gi: "baixo", emoji: "🫐", category: "Sobremesa", ingredients: "3 col. sopa de chia, 200ml de leite de coco, adoçante, frutas vermelhas, baunilha", steps: "1. Misture chia, leite de coco e baunilha. 2. Adoce a gosto. 3. Leve à geladeira por 4h ou durante a noite. 4. Sirva com frutas." },
  { id: 25, name: "Hambúrguer caseiro de frango", time: "20 min", carbs: 3, gi: "baixo", emoji: "🍔", category: "Jantar", ingredients: "300g de frango moído, cebola ralada, alho, salsinha, sal, pimenta, azeite", steps: "1. Misture frango com temperos. 2. Modele hambúrgueres. 3. Grelhe em frigideira com azeite. 4. Sirva com salada no lugar do pão." },
  { id: 26, name: "Muffin de banana e aveia (sem açúcar)", time: "30 min", carbs: 16, gi: "médio", emoji: "🧁", category: "Lanche", ingredients: "2 bananas maduras, 2 ovos, 1 xíc. de aveia, canela, 1 col. chá fermento, nozes picadas", steps: "1. Amasse as bananas. 2. Misture ovos, aveia e canela. 3. Adicione fermento e nozes. 4. Distribua em forminhas. 5. Asse 20min a 180°C." },
  { id: 27, name: "Caldo de legumes com frango desfiado", time: "30 min", carbs: 8, gi: "baixo", emoji: "🍲", category: "Jantar", ingredients: "Frango desfiado, cenoura, chuchu, couve, cebola, alho, sal, cheiro-verde", steps: "1. Refogue cebola e alho. 2. Adicione legumes picados e água. 3. Cozinhe até amolecer. 4. Junte o frango desfiado. 5. Finalize com cheiro-verde." },
  { id: 28, name: "Salada de grão-de-bico mediterrânea", time: "15 min", carbs: 20, gi: "baixo", emoji: "🥗", category: "Almoço", ingredients: "Grão-de-bico cozido, pepino, tomate, cebola roxa, azeitonas, azeite, limão, orégano", steps: "1. Escorra o grão-de-bico. 2. Pique os vegetais. 3. Misture tudo. 4. Tempere com azeite, limão e orégano." },
  { id: 29, name: "Ovo na nuvem (cloud eggs)", time: "15 min", carbs: 1, gi: "baixo", emoji: "☁️", category: "Café da manhã", ingredients: "2 ovos, sal, pimenta, ervas finas, parmesão ralado", steps: "1. Separe claras e gemas. 2. Bata as claras em neve. 3. Forme ninhos na assadeira. 4. Asse 5min, adicione as gemas e asse mais 3min." },
  { id: 30, name: "Gelatina proteica com iogurte", time: "5 min + geladeira", carbs: 4, gi: "baixo", emoji: "🍮", category: "Sobremesa", ingredients: "1 pacote de gelatina sem açúcar (sabor favorito), 200ml de iogurte natural, frutas picadas", steps: "1. Prepare a gelatina conforme embalagem. 2. Quando começar a engrossar, misture o iogurte. 3. Adicione frutas. 4. Leve à geladeira até firmar." },
];

// ==================== WEEKLY CHALLENGES ====================
const WEEKLY_CHALLENGES = [
  { id: 1, title: "Mestre da Glicemia", desc: "Registre sua glicemia pelo menos 3 vezes por dia durante 7 dias seguidos", icon: "🩸", target: 21, type: "glucose", reward: "🏅" },
  { id: 2, title: "Chef Saudável", desc: "Registre todas as refeições no diário alimentar por 7 dias", icon: "🍽️", target: 28, type: "food", reward: "👨‍🍳" },
  { id: 3, title: "Organização Total", desc: "Complete 100% do checklist diário por 5 dias seguidos", icon: "✅", target: 5, type: "checklist", reward: "📋" },
  { id: 4, title: "Explorador de Receitas", desc: "Experimente 3 receitas novas esta semana", icon: "🧑‍🍳", target: 3, type: "recipes", reward: "⭐" },
  { id: 5, title: "Hidratação em Dia", desc: "Marque o hábito de beber água por 7 dias seguidos", icon: "💧", target: 7, type: "water", reward: "🌊" },
  { id: 6, title: "Movimento é Vida", desc: "Faça atividade física pelo menos 5 dias esta semana", icon: "🏃", target: 5, type: "exercise", reward: "💪" },
];

// ==================== MOOD EMOJIS ====================
const MOOD_OPTIONS = [
  { emoji: "😄", label: "Ótimo", color: "#10B981" },
  { emoji: "🙂", label: "Bem", color: "#14B8A6" },
  { emoji: "😐", label: "Normal", color: "#F59E0B" },
  { emoji: "😔", label: "Triste", color: "#8B5CF6" },
  { emoji: "😰", label: "Ansioso", color: "#EF4444" },
  { emoji: "😴", label: "Cansado", color: "#64748B" },
  { emoji: "😤", label: "Estressado", color: "#EC4899" },
  { emoji: "🤒", label: "Doente", color: "#F97316" },
];

// ==================== UTILITY FUNCTIONS ====================
const today = () => new Date().toISOString().split("T")[0];
const formatDate = (d) => {
  const dt = new Date(d + "T12:00:00");
  return `${dt.getDate()} ${MONTHS[dt.getMonth()]}`;
};
const formatTime = (d) => {
  const dt = new Date(d);
  return `${String(dt.getHours()).padStart(2,"0")}:${String(dt.getMinutes()).padStart(2,"0")}`;
};
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
};
const getGlucoseStatus = (val) => {
  if (val < 70) return { label: "Baixa", color: COLORS.danger, bg: COLORS.dangerBg };
  if (val <= 130) return { label: "Normal", color: COLORS.success, bg: COLORS.successBg };
  if (val <= 180) return { label: "Atenção", color: COLORS.warning, bg: COLORS.warningBg };
  return { label: "Alta", color: COLORS.danger, bg: COLORS.dangerBg };
};
const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// ==================== STYLES ====================
const styles = {
  app: {
    maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: COLORS.bg,
    fontFamily: "'Nunito', 'Segoe UI', sans-serif", position: "relative", overflow: "hidden",
  },
  content: {
    paddingBottom: 90, paddingTop: 0, minHeight: "100vh",
  },
  tabBar: {
    position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
    maxWidth: 430, width: "100%", background: "#fff", display: "flex",
    borderTop: `1px solid ${COLORS.border}`, zIndex: 100,
    boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
  },
  tab: (active) => ({
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
    padding: "8px 4px 12px", gap: 2, cursor: "pointer", transition: "all 0.2s",
    background: "transparent", border: "none",
    color: active ? COLORS.primary : COLORS.textLight,
    position: "relative",
  }),
  tabIndicator: {
    position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
    width: 24, height: 3, borderRadius: 2, background: COLORS.primary,
  },
  card: {
    background: COLORS.card, borderRadius: 16, padding: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: `1px solid ${COLORS.border}`,
    marginBottom: 12,
  },
  button: (variant = "primary") => ({
    padding: "14px 24px", borderRadius: 12, border: "none", cursor: "pointer",
    fontWeight: 700, fontSize: 15, fontFamily: "inherit", transition: "all 0.2s",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    width: "100%",
    ...(variant === "primary" ? {
      background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
      color: "#fff", boxShadow: "0 4px 12px rgba(15,118,110,0.3)",
    } : variant === "secondary" ? {
      background: COLORS.primaryBg, color: COLORS.primary, border: `1.5px solid ${COLORS.primary}20`,
    } : variant === "danger" ? {
      background: COLORS.dangerBg, color: COLORS.danger,
    } : {
      background: "transparent", color: COLORS.textSecondary,
    }),
  }),
  input: {
    width: "100%", padding: "14px 16px", borderRadius: 12, fontSize: 15,
    border: `1.5px solid ${COLORS.border}`, fontFamily: "inherit",
    outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
    background: "#FAFBFC",
  },
  badge: (bg, color) => ({
    display: "inline-flex", padding: "4px 10px", borderRadius: 20,
    fontSize: 12, fontWeight: 700, background: bg, color: color,
  }),
  header: {
    padding: "20px 20px 16px", background: `linear-gradient(135deg, ${COLORS.primary}, #0D9488)`,
    color: "#fff", position: "relative", overflow: "hidden",
  },
  section: { padding: "0 20px", marginTop: 20 },
  sectionTitle: {
    fontSize: 17, fontWeight: 800, color: COLORS.text, marginBottom: 12,
    display: "flex", alignItems: "center", gap: 8,
  },
};

// ==================== COMPONENTS ====================

// -- Auth Screen --
const ACCOUNTS_KEY = "glicovida-accounts";
const loadAccounts = () => { try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]"); } catch { return []; } };
const saveAccounts = (acc) => { try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(acc)); } catch {} };

const AuthScreen = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", diabetesType: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const accounts = loadAccounts();

    if (mode === "register") {
      if (!form.name || !form.email || !form.password || !form.diabetesType) {
        setError("Preencha todos os campos");
        return;
      }
      if (form.password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres");
        return;
      }
      if (!form.email.includes("@") || !form.email.includes(".")) {
        setError("Digite um e-mail válido");
        return;
      }
      const exists = accounts.find(a => a.email.toLowerCase() === form.email.toLowerCase());
      if (exists) {
        setError("Este e-mail já está cadastrado. Faça login.");
        return;
      }
      const newAccount = {
        name: form.name,
        email: form.email.toLowerCase(),
        password: form.password,
        diabetesType: form.diabetesType,
        createdAt: new Date().toISOString(),
      };
      saveAccounts([...accounts, newAccount]);
      setError("");
      onLogin({
        name: newAccount.name,
        email: newAccount.email,
        diabetesType: newAccount.diabetesType,
        createdAt: newAccount.createdAt,
      });
    } else {
      if (!form.email || !form.password) {
        setError("Preencha e-mail e senha");
        return;
      }
      const account = accounts.find(a => a.email.toLowerCase() === form.email.toLowerCase() && a.password === form.password);
      if (!account) {
        setError("E-mail ou senha incorretos. Verifique seus dados ou crie uma conta.");
        return;
      }
      setError("");
      onLogin({
        name: account.name,
        email: account.email,
        diabetesType: account.diabetesType,
        createdAt: account.createdAt,
      });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${COLORS.primary} 0%, #0D9488 40%, ${COLORS.primaryLight} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", backdropFilter: "blur(10px)" }}>
          <Droplets size={40} color="#fff" />
        </div>
        <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: -1 }}>GlicoVida</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 6 }}>Seu controle, sua liberdade</p>
      </div>

      <div style={{ background: "#fff", borderRadius: 24, padding: 28, width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 24, background: COLORS.bg, borderRadius: 12, padding: 4 }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
              flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer",
              fontWeight: 700, fontSize: 14, fontFamily: "inherit", transition: "all 0.2s",
              background: mode === m ? COLORS.primary : "transparent",
              color: mode === m ? "#fff" : COLORS.textSecondary,
            }}>
              {m === "login" ? "Entrar" : "Criar Conta"}
            </button>
          ))}
        </div>

        {mode === "register" && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 6, display: "block" }}>Seu nome</label>
            <input style={styles.input} placeholder="Ex: João Silva" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 6, display: "block" }}>E-mail</label>
          <input style={styles.input} type="email" placeholder="seu@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 6, display: "block" }}>Senha</label>
          <div style={{ position: "relative" }}>
            <input style={{...styles.input, paddingRight: 44}} type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <button onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: COLORS.textLight }}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {mode === "register" && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 8, display: "block" }}>Tipo de diabetes</label>
            <div style={{ display: "flex", gap: 10 }}>
              {["Tipo 1", "Tipo 2"].map(t => (
                <button key={t} onClick={() => setForm({...form, diabetesType: t})} style={{
                  flex: 1, padding: "12px 0", borderRadius: 12, border: `2px solid ${form.diabetesType === t ? COLORS.primary : COLORS.border}`,
                  background: form.diabetesType === t ? COLORS.primaryBg : "#fff",
                  color: form.diabetesType === t ? COLORS.primary : COLORS.textSecondary,
                  fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <p style={{ color: COLORS.danger, fontSize: 13, marginBottom: 12, fontWeight: 600 }}>{error}</p>}

        <button onClick={handleSubmit} style={styles.button("primary")}>
          {mode === "login" ? <><LogIn size={18} /> Entrar</> : <><UserPlus size={18} /> Criar Conta</>}
        </button>
      </div>
    </div>
  );
};

// -- Header Component --
const Header = ({ user }) => (
  <div style={styles.header}>
    <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
    <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
    <p style={{ fontSize: 14, opacity: 0.85, marginBottom: 2 }}>{getGreeting()},</p>
    <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{user?.name?.split(" ")[0] || "Usuário"} 👋</h1>
    <p style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>Diabetes {user?.diabetesType || "Tipo 1"}</p>
  </div>
);

// -- Quick Actions --
const QuickActions = ({ onAction }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 20px", marginTop: -24, position: "relative", zIndex: 10 }}>
    {[
      { label: "Registrar Glicemia", icon: Droplets, color: COLORS.primary, action: "addGlucose" },
      { label: "Calculadora Carb", icon: Calculator, color: COLORS.accent, action: "calculator" },
    ].map(a => (
      <button key={a.label} onClick={() => onAction(a.action)} style={{
        ...styles.card, padding: 16, display: "flex", flexDirection: "column", alignItems: "center",
        gap: 8, cursor: "pointer", border: "none", marginBottom: 0,
      }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${a.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <a.icon size={22} color={a.color} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{a.label}</span>
      </button>
    ))}
  </div>
);

// -- Glucose Chart Mini --
const GlucoseChartMini = ({ records }) => {
  const last7 = records.slice(-7).map(r => ({
    name: formatDate(r.date),
    valor: r.value,
  }));
  if (last7.length < 2) return (
    <div style={{ ...styles.card, textAlign: "center", padding: 30, color: COLORS.textLight }}>
      <Droplets size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
      <p style={{ fontSize: 14 }}>Registre pelo menos 2 medições para ver o gráfico</p>
    </div>
  );
  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: COLORS.text, margin: 0 }}>📊 Últimas medições</h3>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={last7}>
          <defs>
            <linearGradient id="glucoseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.primaryLight} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.primaryLight} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: COLORS.textLight }} />
          <YAxis tick={{ fontSize: 11, fill: COLORS.textLight }} domain={[40, 300]} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 13 }} />
          <Area type="monotone" dataKey="valor" stroke={COLORS.primary} strokeWidth={2.5} fill="url(#glucoseGrad)" dot={{ fill: COLORS.primary, r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// -- Modal --
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", maxWidth: 430, width: "100%", maxHeight: "85vh", overflow: "auto", padding: "8px 0 0" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: COLORS.border, margin: "0 auto 16px" }} />
        {title && <h2 style={{ fontSize: 20, fontWeight: 800, color: COLORS.text, margin: "0 24px 16px", padding: 0 }}>{title}</h2>}
        <div style={{ padding: "0 24px 32px" }}>{children}</div>
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================
export default function GlicoVida() {
  const { data, save, loaded } = useAppData();
  const [tab, setTab] = useState("home");
  const [modal, setModal] = useState(null);
  const [glucoseForm, setGlucoseForm] = useState({ value: "", context: "jejum", notes: "" });
  const [foodSearch, setFoodSearch] = useState("");
  const [carbCalcItems, setCarbCalcItems] = useState([]);
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [profileForm, setProfileForm] = useState({});
  const [checklistItems, setChecklistItems] = useState(DEFAULT_CHECKLIST.map(c => ({ ...c })));
  // Phase 2 states
  const [chartPeriod, setChartPeriod] = useState("dia");
  const [foodDiaryForm, setFoodDiaryForm] = useState({ meal: "café da manhã", foods: "", notes: "", carbs: "" });
  const [medForm, setMedForm] = useState({ name: "", dose: "", type: "insulina", time: "", notes: "" });
  const [habitForm, setHabitForm] = useState({ name: "", icon: "💧", target: "diário" });
  const [mealPlanForm, setMealPlanForm] = useState({ day: "Segunda", meal: "café da manhã", description: "" });
  const [goalForm, setGoalForm] = useState({ name: "", category: "saúde", target: "" });
  const [showConfetti, setShowConfetti] = useState(false);
  const [travelTab, setTravelTab] = useState("checklist");
  const [travelCustomItem, setTravelCustomItem] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminError, setAdminError] = useState("");
  const ADMIN_PASS = "Diabetes no controle";
  const [insulinCalc, setInsulinCalc] = useState({ currentGlucose: "", targetGlucose: "120", carbsEaten: "", correctionFactor: "50", icRatio: "15" });
  const [moodForm, setMoodForm] = useState({ mood: "", notes: "" });
  const allRecipes = [...RECIPES_DATA, ...EXTRA_RECIPES];
  const darkMode = data.darkMode || false;
  const toggleDarkMode = () => save({ ...data, darkMode: !darkMode });
  const DM = { bg: darkMode ? "#0F172A" : COLORS.bg, card: darkMode ? "#1E293B" : COLORS.card, text: darkMode ? "#F1F5F9" : COLORS.text, textSec: darkMode ? "#94A3B8" : COLORS.textSecondary, border: darkMode ? "#334155" : COLORS.border, header: darkMode ? `linear-gradient(135deg, #064E3B, #065F46)` : `linear-gradient(135deg, ${COLORS.primary}, #0D9488)` };

  // Weekly score calculation
  const getWeeklyScore = () => {
    const d = new Date(); d.setDate(d.getDate()-7); const weekStr = d.toISOString().split("T")[0];
    let score = 0;
    score += data.glucoseRecords.filter(r => r.date >= weekStr).length * 5;
    score += (data.foodDiary||[]).filter(f => f.date >= weekStr).length * 3;
    score += (data.medications||[]).filter(m => m.date >= weekStr).length * 4;
    score += Object.keys(data.checklist||{}).filter(k => k >= weekStr).length * 10;
    score += (data.goals||[]).filter(g => g.done).length * 15;
    return score;
  };
  const weeklyScore = getWeeklyScore();
  const scoreLevel = weeklyScore < 30 ? "Bronze" : weeklyScore < 80 ? "Prata" : weeklyScore < 150 ? "Ouro" : "Diamante";
  const scoreLevelEmoji = weeklyScore < 30 ? "🥉" : weeklyScore < 80 ? "🥈" : weeklyScore < 150 ? "🥇" : "💎";

  // Progress messages
  const getProgressMessage = () => {
    const recs = data.glucoseRecords;
    const d = new Date(); d.setDate(d.getDate()-7); const weekStr = d.toISOString().split("T")[0];
    const weekRecs = recs.filter(r => r.date >= weekStr);
    if (weekRecs.length >= 21) return { text: "Incrível! Você mediu a glicemia mais de 3x por dia essa semana!", emoji: "🏆" };
    if (weekRecs.length >= 14) return { text: "Ótimo ritmo! Continue medindo regularmente.", emoji: "💪" };
    const goals = (data.goals||[]);
    if (goals.filter(g => g.done).length > 0) return { text: `Você já completou ${goals.filter(g=>g.done).length} meta(s)! Continue assim!`, emoji: "🎯" };
    const diary = (data.foodDiary||[]).filter(f => f.date >= weekStr);
    if (diary.length >= 10) return { text: "Diário alimentar em dia! Isso ajuda muito no controle.", emoji: "📝" };
    return { text: "Registre suas medições e refeições para receber análises personalizadas!", emoji: "📊" };
  };

  const addEmotionalEntry = () => {
    if (!moodForm.mood) return;
    const entry = { id: uid(), ...moodForm, date: today(), time: new Date().toISOString() };
    save({ ...data, emotionalDiary: [...(data.emotionalDiary || []), entry] });
    setMoodForm({ mood: "", notes: "" });
    setModal(null);
  };

  // Show welcome screen when user is loaded
  useEffect(() => {
    if (loaded && data.user && !welcomeDismissed) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
        setWelcomeDismissed(true);
      }, 8500);
      return () => clearTimeout(timer);
    }
  }, [loaded, data.user]);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);
  };

  // Initialize checklist for today
  useEffect(() => {
    if (data.checklist?.[today()]) {
      setChecklistItems(data.checklist[today()]);
    }
  }, [data.checklist]);

  const saveChecklist = (items) => {
    setChecklistItems(items);
    save({ ...data, checklist: { ...data.checklist, [today()]: items } });
    if (items.length > 0 && items.every(c => c.done)) triggerConfetti();
  };

  if (!loaded) {
    return (
      <div style={{ ...styles.app, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <Droplets size={48} color={COLORS.primary} style={{ animation: "pulse 1.5s infinite" }} />
          <p style={{ color: COLORS.textSecondary, marginTop: 12, fontWeight: 600 }}>Carregando GlicoVida...</p>
        </div>
      </div>
    );
  }

  if (!data.user) {
    return (
      <div style={styles.app}>
        <AuthScreen onLogin={(user) => { save({ ...data, user, reminders: DEFAULT_REMINDERS }); setWelcomeDismissed(false); setShowWelcome(true); }} />
      </div>
    );
  }

  // Welcome phrases that rotate randomly
  const welcomePhrases = [
    { text: `Olá, ${data.user.name?.split(" ")[0]}! Vamos cuidar da sua saúde hoje?`, emoji: "💚" },
    { text: `Bom te ver de volta, ${data.user.name?.split(" ")[0]}! Seu controle está em suas mãos`, emoji: "💪" },
    { text: `${data.user.name?.split(" ")[0]}, cada dia é uma nova conquista. Vamos lá!`, emoji: "🌟" },
    { text: `Bem-vindo, ${data.user.name?.split(" ")[0]}! Hoje é mais um dia de liberdade`, emoji: "🚀" },
    { text: `${data.user.name?.split(" ")[0]}, você está no caminho certo. Continue assim!`, emoji: "⭐" },
    { text: `Olá, ${data.user.name?.split(" ")[0]}! Lembre-se: você é mais forte que a diabetes`, emoji: "💚" },
    { text: `${data.user.name?.split(" ")[0]}, o GlicoVida está com você. Vamos juntos!`, emoji: "🤝" },
    { text: `Que bom ter você aqui, ${data.user.name?.split(" ")[0]}! Sua saúde agradece`, emoji: "❤️" },
  ];
  const welcomePhrase = welcomePhrases[Math.floor(Date.now() / 60000) % welcomePhrases.length];

  if (showWelcome && data.user) {
    return (
      <div style={styles.app}>
        <style>{`
          @keyframes welcomeBg { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          @keyframes float3d { 0%, 100% { transform: perspective(800px) rotateY(0deg) rotateX(0deg) scale(1); } 25% { transform: perspective(800px) rotateY(15deg) rotateX(5deg) scale(1.05); } 50% { transform: perspective(800px) rotateY(0deg) rotateX(-5deg) scale(1.1); } 75% { transform: perspective(800px) rotateY(-15deg) rotateX(5deg) scale(1.05); } }
          @keyframes glowPulse { 0%, 100% { box-shadow: 0 0 20px rgba(20,184,166,0.3), 0 0 60px rgba(20,184,166,0.1); } 50% { box-shadow: 0 0 40px rgba(20,184,166,0.5), 0 0 80px rgba(20,184,166,0.2); } }
          @keyframes typeIn { from { width: 0; opacity: 0; } to { width: 100%; opacity: 1; } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeInScale { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
          @keyframes particle { 0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; } 50% { opacity: 0.3; } 100% { transform: translateY(-200px) translateX(var(--dx)) scale(0); opacity: 0; } }
          @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
          @keyframes welcomeExit { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(1.1); } }
        `}</style>
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: `linear-gradient(-45deg, #0F766E, #0D9488, #14B8A6, #0F766E, #065F46)`,
          backgroundSize: "400% 400%", animation: "welcomeBg 12s ease infinite", position: "relative", overflow: "hidden", padding: 32,
        }}>
          {/* Floating particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute", width: 6 + Math.random() * 8, height: 6 + Math.random() * 8,
              borderRadius: "50%", background: `rgba(255,255,255,${0.1 + Math.random() * 0.2})`,
              left: `${Math.random() * 100}%`, bottom: `${Math.random() * 30}%`,
              animation: `particle ${5 + Math.random() * 5}s ${Math.random() * 3}s ease-in-out infinite`,
              ["--dx"]: `${-30 + Math.random() * 60}px`,
            }} />
          ))}

          {/* Glowing ring behind logo */}
          <div style={{
            position: "absolute", width: 200, height: 200, borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.1)",
            animation: "glowPulse 4s ease-in-out infinite",
          }} />

          {/* 3D Logo */}
          <div style={{
            width: 110, height: 110, borderRadius: 32, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.15)", backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.25)",
            animation: "float3d 6s ease-in-out infinite, fadeInScale 1.2s ease-out forwards",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}>
            <Droplets size={52} color="#fff" strokeWidth={1.8} />
          </div>

          {/* App name */}
          <h1 style={{
            color: "#fff", fontSize: 36, fontWeight: 900, margin: "20px 0 0", letterSpacing: -1.5,
            animation: "fadeInUp 1.2s 0.8s ease-out both",
            textShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}>
            GlicoVida
          </h1>

          {/* Shimmer subtitle */}
          <p style={{
            fontSize: 13, fontWeight: 600, margin: "6px 0 0", letterSpacing: 3, textTransform: "uppercase",
            background: "linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.9), rgba(255,255,255,0.4))",
            backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "shimmer 3s linear infinite, fadeInUp 1.2s 1.5s ease-out both",
          }}>
            Seu controle, sua liberdade
          </p>

          {/* Welcome phrase */}
          <div style={{
            marginTop: 40, padding: "20px 28px", borderRadius: 20,
            background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.15)", maxWidth: 340, textAlign: "center",
            animation: "fadeInUp 1.2s 2.5s ease-out both",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          }}>
            <p style={{
              color: "#fff", fontSize: 18, fontWeight: 700, lineHeight: 1.5, margin: 0,
            }}>
              {welcomePhrase.text}
            </p>
            <span style={{ fontSize: 36, display: "block", marginTop: 10, animation: "fadeInScale 0.8s 4s ease-out both" }}>
              {welcomePhrase.emoji}
            </span>
          </div>

          {/* Skip button */}
          <button onClick={() => { setShowWelcome(false); setWelcomeDismissed(true); }} style={{
            marginTop: 32, padding: "12px 32px", borderRadius: 30, border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", backdropFilter: "blur(10px)",
            animation: "fadeInUp 1s 5s ease-out both", transition: "all 0.2s",
          }}>
            Entrar no app →
          </button>

          {/* Diabetes type badge */}
          <div style={{
            marginTop: 16, animation: "fadeInUp 1s 5.5s ease-out both",
          }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
              Diabetes {data.user.diabetesType}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const todayRecords = data.glucoseRecords.filter(r => r.date === today());
  const lastRecord = data.glucoseRecords[data.glucoseRecords.length - 1];
  const completedToday = checklistItems.filter(c => c.done).length;
  const totalChecklist = checklistItems.length;

  const addGlucoseRecord = () => {
    const val = parseInt(glucoseForm.value);
    if (isNaN(val) || val < 20 || val > 600) return;
    const rec = { id: uid(), value: val, context: glucoseForm.context, notes: glucoseForm.notes, date: today(), time: new Date().toISOString() };
    save({ ...data, glucoseRecords: [...data.glucoseRecords, rec] });
    setGlucoseForm({ value: "", context: "jejum", notes: "" });
    setModal(null);
  };

  const deleteGlucoseRecord = (id) => {
    save({ ...data, glucoseRecords: data.glucoseRecords.filter(r => r.id !== id) });
  };

  const addToCarbCalc = (food) => {
    const existing = carbCalcItems.find(f => f.name === food.name);
    if (existing) {
      setCarbCalcItems(carbCalcItems.map(f => f.name === food.name ? { ...f, qty: f.qty + 1 } : f));
    } else {
      setCarbCalcItems([...carbCalcItems, { ...food, qty: 1 }]);
    }
  };

  const totalCarbs = carbCalcItems.reduce((sum, f) => sum + f.carbs * f.qty, 0);

  const filteredFoods = foodSearch
    ? FOOD_DATABASE.filter(f => f.name.toLowerCase().includes(foodSearch.toLowerCase()) || f.category.toLowerCase().includes(foodSearch.toLowerCase()))
    : FOOD_DATABASE;

  // ==================== TAB: HOME ====================
  const renderHome = () => (
    <>
      <Header user={data.user} />
      <QuickActions onAction={(action) => {
        if (action === "addGlucose") setModal("addGlucose");
        if (action === "calculator") { setTab("food"); setTimeout(() => setModal("calculator"), 100); }
      }} />

      {/* Last glucose */}
      <div style={styles.section}>
        {/* Progress message */}
        <div style={{ ...styles.card, background: `linear-gradient(135deg, #ECFDF5, #D1FAE5)`, border: `1px solid ${COLORS.success}20`, display: "flex", gap: 12, padding: 14, marginBottom: 12 }}>
          <span style={{ fontSize: 28 }}>{getProgressMessage().emoji}</span>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.success, margin: "0 0 2px" }}>📈 Seu progresso</p>
            <p style={{ fontSize: 13, color: COLORS.text, margin: 0, lineHeight: 1.5 }}>{getProgressMessage().text}</p>
          </div>
        </div>

        {/* Emotional diary quick */}
        <button onClick={() => setModal("emotionalDiary")} style={{ ...styles.card, display: "flex", alignItems: "center", gap: 12, padding: 14, cursor: "pointer", border: `1px solid #8B5CF620`, marginBottom: 12, width: "100%", textAlign: "left" }}>
          <span style={{ fontSize: 24 }}>😊</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: 0 }}>Como você está se sentindo?</p>
            <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: "2px 0 0" }}>Registre seu humor para acompanhar padrões</p>
          </div>
          <ChevronRight size={16} color={COLORS.textLight} />
        </button>
        {lastRecord ? (
          <div style={{ ...styles.card, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: getGlucoseStatus(lastRecord.value).bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: getGlucoseStatus(lastRecord.value).color }}>{lastRecord.value}</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: 0 }}>Última glicemia</p>
              <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: "2px 0 0" }}>
                {formatDate(lastRecord.date)} às {formatTime(lastRecord.time)} · {lastRecord.context}
              </p>
            </div>
            <span style={styles.badge(getGlucoseStatus(lastRecord.value).bg, getGlucoseStatus(lastRecord.value).color)}>
              {getGlucoseStatus(lastRecord.value).label}
            </span>
          </div>
        ) : (
          <div style={{ ...styles.card, textAlign: "center", padding: 24 }}>
            <Droplets size={28} color={COLORS.textLight} style={{ marginBottom: 8 }} />
            <p style={{ color: COLORS.textSecondary, fontSize: 14, margin: 0 }}>Nenhuma medição registrada ainda</p>
            <button onClick={() => setModal("addGlucose")} style={{ ...styles.button("secondary"), marginTop: 12 }}>
              <Plus size={16} /> Registrar primeira medição
            </button>
          </div>
        )}
      </div>

      {/* Checklist progress */}
      <div style={styles.section}>
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: COLORS.text, margin: 0 }}>✅ Checklist de Hoje</h3>
            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.primary }}>{completedToday}/{totalChecklist}</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: COLORS.bg, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryLight})`, width: `${totalChecklist ? (completedToday/totalChecklist)*100 : 0}%`, transition: "width 0.5s ease" }} />
          </div>
          <div style={{ marginTop: 12 }}>
            {checklistItems.slice(0, 4).map(item => (
              <div key={item.id} onClick={() => {
                const updated = checklistItems.map(c => c.id === item.id ? { ...c, done: !c.done } : c);
                saveChecklist(updated);
              }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer" }}>
                {item.done ? <CheckCircle size={20} color={COLORS.success} /> : <Circle size={20} color={COLORS.textLight} />}
                <span style={{ fontSize: 14, color: item.done ? COLORS.textLight : COLORS.text, textDecoration: item.done ? "line-through" : "none", fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
            {totalChecklist > 4 && (
              <button onClick={() => setTab("routine")} style={{ background: "none", border: "none", color: COLORS.primary, fontWeight: 700, fontSize: 13, cursor: "pointer", marginTop: 4, fontFamily: "inherit" }}>
                Ver todos →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={styles.section}>
        <GlucoseChartMini records={data.glucoseRecords} />
      </div>

      {/* Reminders */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}><Bell size={18} color={COLORS.accent} /> Lembretes de Hoje</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(data.reminders || DEFAULT_REMINDERS).filter(r => r.active).slice(0, 5).map(r => (
            <div key={r.id} style={{ ...styles.card, padding: 14, display: "flex", alignItems: "center", gap: 12, marginBottom: 0 }}>
              <span style={{ fontSize: 22 }}>{r.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, margin: 0 }}>{r.title}</p>
                <p style={{ fontSize: 12, color: COLORS.textLight, margin: 0 }}>{r.time}</p>
              </div>
              <Clock size={16} color={COLORS.textLight} />
            </div>
          ))}
        </div>
      </div>

      {/* Daily motivation */}
      <div style={{ ...styles.section, marginBottom: 20 }}>
        <div style={{ ...styles.card, background: `linear-gradient(135deg, ${COLORS.primaryBg}, #E0F7FA)`, border: `1px solid ${COLORS.primary}20` }}>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ fontSize: 28 }}>{getDailyPhrase().emoji}</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.primary, margin: "0 0 4px" }}>✨ Frase do dia</p>
              <p style={{ fontSize: 13, color: COLORS.text, margin: 0, lineHeight: 1.5 }}>
                {getDailyPhrase().text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // ==================== TAB: GLUCOSE ====================
  // ==================== TAB: GLUCOSE (Phase 2 Enhanced) ====================
  const getChartData = () => {
    const records = data.glucoseRecords;
    if (chartPeriod === "dia") {
      return records.filter(r => r.date === today()).map(r => ({ name: formatTime(r.time), valor: r.value, context: r.context }));
    } else if (chartPeriod === "semana") {
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
      const weekStr = weekAgo.toISOString().split("T")[0];
      const byDay = {};
      records.filter(r => r.date >= weekStr).forEach(r => {
        if (!byDay[r.date]) byDay[r.date] = [];
        byDay[r.date].push(r.value);
      });
      return Object.entries(byDay).map(([d, vals]) => ({ name: formatDate(d), valor: Math.round(vals.reduce((a,b)=>a+b,0)/vals.length), min: Math.min(...vals), max: Math.max(...vals) }));
    } else {
      const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate() - 30);
      const monthStr = monthAgo.toISOString().split("T")[0];
      const byDay = {};
      records.filter(r => r.date >= monthStr).forEach(r => {
        if (!byDay[r.date]) byDay[r.date] = [];
        byDay[r.date].push(r.value);
      });
      return Object.entries(byDay).map(([d, vals]) => ({ name: formatDate(d), valor: Math.round(vals.reduce((a,b)=>a+b,0)/vals.length) }));
    }
  };

  const periodRecords = chartPeriod === "dia" ? data.glucoseRecords.filter(r => r.date === today()) : chartPeriod === "semana" ? data.glucoseRecords.filter(r => { const d = new Date(); d.setDate(d.getDate()-7); return r.date >= d.toISOString().split("T")[0]; }) : data.glucoseRecords.filter(r => { const d = new Date(); d.setDate(d.getDate()-30); return r.date >= d.toISOString().split("T")[0]; });
  const periodAvg = periodRecords.length > 0 ? Math.round(periodRecords.reduce((s,r)=>s+r.value,0)/periodRecords.length) : 0;
  const periodMin = periodRecords.length > 0 ? Math.min(...periodRecords.map(r=>r.value)) : 0;
  const periodMax = periodRecords.length > 0 ? Math.max(...periodRecords.map(r=>r.value)) : 0;
  const inRangeCount = periodRecords.filter(r => r.value >= 70 && r.value <= 180).length;
  const inRangePct = periodRecords.length > 0 ? Math.round((inRangeCount/periodRecords.length)*100) : 0;

  const renderGlucose = () => (
    <>
      <div style={{ ...styles.header, paddingBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>💧 Glicemia</h1>
        <p style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Registre e acompanhe em tempo real</p>
      </div>

      <div style={{ padding: "16px 20px 0" }}>
        <button onClick={() => setModal("addGlucose")} style={styles.button("primary")}>
          <Plus size={18} /> Novo Registro
        </button>
      </div>

      {/* Period selector */}
      <div style={{ display: "flex", gap: 8, padding: "16px 20px 0" }}>
        {[{id:"dia",label:"Hoje"},{id:"semana",label:"Semana"},{id:"mês",label:"Mês"}].map(p => (
          <button key={p.id} onClick={() => setChartPeriod(p.id)} style={{
            flex: 1, padding: "10px 0", borderRadius: 12, border: `2px solid ${chartPeriod === p.id ? COLORS.primary : COLORS.border}`,
            background: chartPeriod === p.id ? COLORS.primaryBg : "#fff", color: chartPeriod === p.id ? COLORS.primary : COLORS.textSecondary,
            fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
          }}>{p.label}</button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, padding: "12px 20px 0" }}>
        {[
          { label: "Média", value: periodAvg || "-", color: COLORS.primary },
          { label: "Menor", value: periodMin || "-", color: COLORS.success },
          { label: "Maior", value: periodMax || "-", color: COLORS.danger },
          { label: "No alvo", value: inRangePct ? `${inRangePct}%` : "-", color: COLORS.primaryLight },
        ].map(s => (
          <div key={s.label} style={{ ...styles.card, textAlign: "center", padding: 10, marginBottom: 0 }}>
            <p style={{ fontSize: 10, color: COLORS.textSecondary, fontWeight: 700, margin: 0 }}>{s.label}</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: s.color, margin: "2px 0 0" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ padding: "12px 20px 0" }}>
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: COLORS.text, margin: 0 }}>📊 Gráfico {chartPeriod === "dia" ? "de Hoje (tempo real)" : chartPeriod === "semana" ? "Semanal" : "Mensal"}</h3>
            {chartPeriod === "dia" && <span style={styles.badge(COLORS.successBg, COLORS.success)}>● AO VIVO</span>}
          </div>
          {getChartData().length >= 2 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="glucoseGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primaryLight} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.primaryLight} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: COLORS.textLight }} />
                <YAxis tick={{ fontSize: 10, fill: COLORS.textLight }} domain={[40, 300]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 12 }} />
                <Area type="monotone" dataKey="valor" stroke={COLORS.primary} strokeWidth={2.5} fill="url(#glucoseGrad2)" dot={{ fill: COLORS.primary, r: 4 }} animationDuration={500} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: "center", padding: 30, color: COLORS.textLight }}>
              <p style={{ fontSize: 13 }}>{chartPeriod === "dia" ? "Registre medições hoje para ver o gráfico em tempo real" : "Dados insuficientes para este período"}</p>
            </div>
          )}
          {/* Reference zones */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS.success }} /><span style={{ fontSize: 10, color: COLORS.textLight }}>70-130 Normal</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS.warning }} /><span style={{ fontSize: 10, color: COLORS.textLight }}>131-180 Atenção</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS.danger }} /><span style={{ fontSize: 10, color: COLORS.textLight }}>{">"} 180 Alta</span></div>
          </div>
        </div>
      </div>

      {/* Records */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Histórico</h3>
        {data.glucoseRecords.length === 0 ? (
          <p style={{ color: COLORS.textLight, fontSize: 14, textAlign: "center", padding: 24 }}>Nenhum registro ainda</p>
        ) : (
          [...data.glucoseRecords].reverse().slice(0, 20).map(r => {
            const st = getGlucoseStatus(r.value);
            return (
              <div key={r.id} style={{ ...styles.card, display: "flex", alignItems: "center", gap: 12, padding: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: st.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: st.color }}>{r.value}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{r.value} mg/dL</span>
                    <span style={styles.badge(st.bg, st.color)}>{st.label}</span>
                  </div>
                  <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: "2px 0 0" }}>{formatDate(r.date)} · {formatTime(r.time)} · {r.context}</p>
                  {r.notes && <p style={{ fontSize: 12, color: COLORS.textLight, margin: "2px 0 0" }}>📝 {r.notes}</p>}
                </div>
                <button onClick={() => deleteGlucoseRecord(r.id)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textLight, padding: 4 }}><Trash2 size={16} /></button>
              </div>
            );
          })
        )}
      </div>
    </>
  );

  // ==================== TAB: FOOD (Phase 2 Enhanced) ====================
  const addFoodDiaryEntry = () => {
    if (!foodDiaryForm.foods) return;
    const entry = { id: uid(), ...foodDiaryForm, carbs: parseInt(foodDiaryForm.carbs) || 0, date: today(), time: new Date().toISOString() };
    save({ ...data, foodDiary: [...(data.foodDiary || []), entry] });
    setFoodDiaryForm({ meal: "café da manhã", foods: "", notes: "", carbs: "" });
    setModal(null);
  };
  const todayDiary = (data.foodDiary || []).filter(e => e.date === today());
  const todayDiaryCarbs = todayDiary.reduce((s, e) => s + (e.carbs || 0), 0);

  const renderFood = () => (
    <>
      <div style={{ ...styles.header, paddingBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>🍎 Alimentação</h1>
        <p style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Diário, calculadora e biblioteca</p>
      </div>

      <div style={{ padding: "16px 20px 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { label: "Diário", icon: Edit3, color: COLORS.success, action: "addFoodDiary" },
          { label: "Calculadora", icon: Calculator, color: COLORS.accent, action: "calculator" },
          { label: "Biblioteca", icon: BookOpen, color: COLORS.primary, action: "foodLibrary" },
        ].map(a => (
          <button key={a.label} onClick={() => setModal(a.action)} style={{ ...styles.card, padding: 12, textAlign: "center", cursor: "pointer", border: `2px solid ${a.color}20`, marginBottom: 0 }}>
            <a.icon size={24} color={a.color} />
            <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, margin: "6px 0 0" }}>{a.label}</p>
          </button>
        ))}
      </div>

      {/* Today's diary */}
      <div style={styles.section}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ ...styles.sectionTitle, marginBottom: 0 }}>📝 Diário de Hoje</h3>
          <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.primary }}>{todayDiaryCarbs}g carbs</span>
        </div>
        {todayDiary.length === 0 ? (
          <div style={{ ...styles.card, textAlign: "center", padding: 24 }}>
            <Utensils size={28} color={COLORS.textLight} style={{ marginBottom: 8 }} />
            <p style={{ color: COLORS.textSecondary, fontSize: 14, margin: 0 }}>Nenhuma refeição registrada hoje</p>
            <button onClick={() => setModal("addFoodDiary")} style={{ ...styles.button("secondary"), marginTop: 12 }}>
              <Plus size={16} /> Registrar refeição
            </button>
          </div>
        ) : (
          todayDiary.map(e => (
            <div key={e.id} style={{ ...styles.card, padding: 14, display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>{e.meal === "café da manhã" ? "☕" : e.meal === "almoço" ? "🍽️" : e.meal === "lanche" ? "🍎" : e.meal === "jantar" ? "🌙" : "🍴"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, textTransform: "capitalize" }}>{e.meal}</span>
                  {e.carbs > 0 && <span style={styles.badge(COLORS.primaryBg, COLORS.primary)}>{e.carbs}g carbs</span>}
                </div>
                <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: "4px 0 0" }}>{e.foods}</p>
                {e.notes && <p style={{ fontSize: 12, color: COLORS.textLight, margin: "2px 0 0" }}>📝 {e.notes}</p>}
                <p style={{ fontSize: 11, color: COLORS.textLight, margin: "2px 0 0" }}>{formatTime(e.time)}</p>
              </div>
              <button onClick={() => save({...data, foodDiary: (data.foodDiary||[]).filter(f => f.id !== e.id)})} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textLight }}><Trash2 size={14} /></button>
            </div>
          ))
        )}
      </div>

      {/* Plate rule */}
      <div style={styles.section}>
        <div style={{ ...styles.card, background: `linear-gradient(135deg, ${COLORS.successBg}, #E8F5E9)`, border: `1px solid ${COLORS.success}20` }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: COLORS.text, margin: "0 0 12px" }}>🍽️ Regra do Prato Equilibrado</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { pct: "50%", label: "Vegetais e fibras", color: COLORS.success, emoji: "🥬" },
              { pct: "25%", label: "Proteínas magras", color: COLORS.accent, emoji: "🍗" },
              { pct: "25%", label: "Carboidratos integrais", color: COLORS.primary, emoji: "🍚" },
            ].map(p => (
              <div key={p.label} style={{ flex: "1 1 100px", background: "#fff", borderRadius: 12, padding: 12, textAlign: "center", border: `1px solid ${p.color}20` }}>
                <span style={{ fontSize: 24 }}>{p.emoji}</span>
                <p style={{ fontSize: 20, fontWeight: 800, color: p.color, margin: "4px 0 0" }}>{p.pct}</p>
                <p style={{ fontSize: 11, color: COLORS.textSecondary, margin: "2px 0 0", fontWeight: 600 }}>{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Food sequence */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}><Zap size={18} color={COLORS.accent} /> Sequência Ideal da Refeição</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { step: "1º", title: "Fibras primeiro", desc: "Salada, legumes, folhas verdes", emoji: "🥗", color: COLORS.success },
            { step: "2º", title: "Proteínas", desc: "Carnes, ovos, leguminosas", emoji: "🥩", color: COLORS.accent },
            { step: "3º", title: "Carboidratos", desc: "Arroz, pão, batata (por último!)", emoji: "🍚", color: COLORS.primary },
          ].map(s => (
            <div key={s.step} style={{ ...styles.card, display: "flex", alignItems: "center", gap: 14, padding: 14, marginBottom: 0, borderLeft: `4px solid ${s.color}` }}>
              <span style={{ fontSize: 28 }}>{s.emoji}</span>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={styles.badge(`${s.color}15`, s.color)}>{s.step}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{s.title}</span>
                </div>
                <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: "2px 0 0" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipes */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}><span style={{ fontSize: 18 }}>👨‍🍳</span> Receitas para Diabéticos</h3>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {["Todas", "Café da manhã", "Almoço", "Lanche", "Jantar", "Sobremesa"].map(cat => (
            <button key={cat} onClick={() => setFoodSearch(cat === "Todas" ? "receita_all" : `receita_${cat}`)} style={{
              padding: "6px 10px", borderRadius: 14, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              background: (foodSearch === `receita_${cat}` || (cat === "Todas" && foodSearch === "receita_all")) ? COLORS.success : COLORS.bg,
              color: (foodSearch === `receita_${cat}` || (cat === "Todas" && foodSearch === "receita_all")) ? "#fff" : COLORS.textSecondary,
              border: "none",
            }}>{cat}</button>
          ))}
        </div>
        {(foodSearch?.startsWith("receita_") ? allRecipes.filter(r => foodSearch === "receita_all" || r.category === foodSearch.replace("receita_", "")) : allRecipes.slice(0, 4)).map(recipe => (
          <div key={recipe.id} style={{ ...styles.card, padding: 0, overflow: "hidden", marginBottom: 10, cursor: "pointer" }} onClick={() => setExpandedArticle(expandedArticle === `recipe-${recipe.id}` ? null : `recipe-${recipe.id}`)}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14 }}>
              <span style={{ fontSize: 32 }}>{recipe.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: 0 }}>{recipe.name}</p>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <span style={styles.badge(COLORS.bg, COLORS.textSecondary)}>⏱️ {recipe.time}</span>
                  <span style={styles.badge(COLORS.primaryBg, COLORS.primary)}>{recipe.carbs}g carbs</span>
                  <span style={styles.badge(recipe.gi === "baixo" ? COLORS.successBg : COLORS.warningBg, recipe.gi === "baixo" ? COLORS.success : COLORS.warning)}>IG {recipe.gi}</span>
                </div>
              </div>
              {expandedArticle === `recipe-${recipe.id}` ? <ChevronUp size={16} color={COLORS.textLight} /> : <ChevronDown size={16} color={COLORS.textLight} />}
            </div>
            {expandedArticle === `recipe-${recipe.id}` && (
              <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${COLORS.border}` }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.primary, margin: "10px 0 4px" }}>🧾 Ingredientes:</p>
                <p style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6, margin: 0 }}>{recipe.ingredients}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.primary, margin: "10px 0 4px" }}>👩‍🍳 Modo de preparo:</p>
                <p style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6, margin: 0 }}>{recipe.steps}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Substitutions */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}><span style={{ fontSize: 18 }}>🔄</span> Substituições Inteligentes</h3>
        <p style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 12 }}>Troque alimentos por opções de menor índice glicêmico:</p>
        {SUBSTITUTIONS_DATA.slice(0, 5).map((sub, i) => (
          <div key={i} style={{ ...styles.card, padding: 0, overflow: "hidden", marginBottom: 8, cursor: "pointer" }} onClick={() => setExpandedArticle(expandedArticle === `sub-${i}` ? null : `sub-${i}`)}>
            <div style={{ display: "flex", alignItems: "center", padding: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.danger, textDecoration: "line-through" }}>{sub.original}</span>
                  <span style={{ fontSize: 16 }}>→</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.success }}>{sub.substitute}</span>
                </div>
                <span style={styles.badge(COLORS.successBg, COLORS.success)}>IG: {sub.igChange}</span>
              </div>
              {expandedArticle === `sub-${i}` ? <ChevronUp size={14} color={COLORS.textLight} /> : <ChevronDown size={14} color={COLORS.textLight} />}
            </div>
            {expandedArticle === `sub-${i}` && (
              <div style={{ padding: "0 12px 12px", borderTop: `1px solid ${COLORS.border}` }}>
                <p style={{ fontSize: 12, color: COLORS.text, margin: "8px 0 0", lineHeight: 1.6 }}>💡 {sub.tip}</p>
              </div>
            )}
          </div>
        ))}
        <button onClick={() => setModal("allSubstitutions")} style={{ ...styles.button("secondary"), marginTop: 4 }}>Ver todas as substituições</button>
      </div>

      {/* Insulin dose calculator */}
      <div style={styles.section}>
        <div style={{ ...styles.card, background: `linear-gradient(135deg, #F5F3FF, #EDE9FE)`, border: `1px solid #8B5CF620` }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#8B5CF6", margin: "0 0 4px" }}>💉 Calculadora de Dose de Insulina</h3>
          <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: "0 0 12px" }}>Estime a dose com base na sua glicemia e carboidratos</p>
          <button onClick={() => setModal("insulinCalc")} style={{ ...styles.button("primary"), background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}>
            Abrir Calculadora
          </button>
        </div>
      </div>
    </>
  );

  // ==================== TAB: ROUTINE (Phase 2 Enhanced) ====================
  const addMedication = () => {
    if (!medForm.name || !medForm.dose) return;
    const med = { id: uid(), ...medForm, date: today(), time: new Date().toISOString() };
    save({ ...data, medications: [...(data.medications || []), med] });
    setMedForm({ name: "", dose: "", type: "insulina", time: "", notes: "" });
    setModal(null);
  };
  const todayMeds = (data.medications || []).filter(m => m.date === today());
  const PLAN_DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  const PLAN_MEALS = ["café da manhã", "almoço", "lanche", "jantar"];
  const saveMealPlan = () => {
    if (!mealPlanForm.description) return;
    const key = `${mealPlanForm.day}-${mealPlanForm.meal}`;
    save({ ...data, mealPlan: { ...(data.mealPlan || {}), [key]: mealPlanForm.description } });
    setMealPlanForm({ day: "Segunda", meal: "café da manhã", description: "" });
    setModal(null);
  };

  const renderRoutine = () => {
  const goals = data.goals || [];
  const habits = data.habits || [];
  const todayHabitLog = data.habitLog || {};

  const addGoal = () => {
    if (!goalForm.name) return;
    const goal = { id: uid(), ...goalForm, done: false, createdAt: today() };
    save({ ...data, goals: [...goals, goal] });
    setGoalForm({ name: "", category: "saúde", target: "" });
    setModal(null);
  };

  const toggleGoal = (id) => {
    const goal = goals.find(g => g.id === id);
    if (goal && !goal.done) triggerConfetti();
    save({ ...data, goals: goals.map(g => g.id === id ? { ...g, done: !g.done } : g) });
  };

  const deleteGoal = (id) => {
    save({ ...data, goals: goals.filter(g => g.id !== id) });
  };

  const addHabit = () => {
    if (!habitForm.name) return;
    const habit = { id: uid(), ...habitForm, createdAt: today() };
    save({ ...data, habits: [...habits, habit] });
    setHabitForm({ name: "", icon: "💧", target: "diário" });
    setModal(null);
  };

  const toggleHabitToday = (id) => {
    const key = `${today()}-${id}`;
    const newLog = { ...todayHabitLog, [key]: !todayHabitLog[key] };
    save({ ...data, habitLog: newLog });
    // Check if all habits done after toggle
    const allDone = habits.every(h => h.id === id ? !todayHabitLog[key] : !!todayHabitLog[`${today()}-${h.id}`]);
    if (allDone && habits.length > 0) triggerConfetti();
  };

  const isHabitDoneToday = (id) => !!todayHabitLog[`${today()}-${id}`];

  const getHabitStreak = (id) => {
    let streak = 0;
    const d = new Date();
    for (let i = 0; i < 30; i++) {
      const dateStr = d.toISOString().split("T")[0];
      if (todayHabitLog[`${dateStr}-${id}`]) streak++;
      else if (i > 0) break;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  };

  const completedGoals = goals.filter(g => g.done).length;
  const totalGoals = goals.length;
  const completedHabitsToday = habits.filter(h => isHabitDoneToday(h.id)).length;

  return (
    <>
      <div style={{ ...styles.header, paddingBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>📋 Rotina</h1>
        <p style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Checklist, medicação, metas e planejamento</p>
      </div>

      {/* Quick actions */}
      <div style={{ padding: "16px 20px 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
        <button onClick={() => setModal("addMedication")} style={{ ...styles.card, padding: 10, textAlign: "center", cursor: "pointer", border: `2px solid #8B5CF620`, marginBottom: 0 }}>
          <Pill size={20} color="#8B5CF6" />
          <p style={{ fontSize: 10, fontWeight: 700, color: COLORS.text, margin: "4px 0 0" }}>Medicação</p>
        </button>
        <button onClick={() => setModal("addGoal")} style={{ ...styles.card, padding: 10, textAlign: "center", cursor: "pointer", border: `2px solid ${COLORS.success}20`, marginBottom: 0 }}>
          <Target size={20} color={COLORS.success} />
          <p style={{ fontSize: 10, fontWeight: 700, color: COLORS.text, margin: "4px 0 0" }}>Meta</p>
        </button>
        <button onClick={() => setModal("addHabit")} style={{ ...styles.card, padding: 10, textAlign: "center", cursor: "pointer", border: `2px solid ${COLORS.accent}20`, marginBottom: 0 }}>
          <Flame size={20} color={COLORS.accent} />
          <p style={{ fontSize: 10, fontWeight: 700, color: COLORS.text, margin: "4px 0 0" }}>Hábito</p>
        </button>
        <button onClick={() => setModal("travel")} style={{ ...styles.card, padding: 10, textAlign: "center", cursor: "pointer", border: `2px solid #3B82F620`, marginBottom: 0 }}>
          <span style={{ fontSize: 20 }}>✈️</span>
          <p style={{ fontSize: 10, fontWeight: 700, color: COLORS.text, margin: "4px 0 0" }}>Viagem</p>
        </button>
      </div>

      {/* Checklist */}
      <div style={styles.section}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ ...styles.sectionTitle, marginBottom: 0 }}>✅ Checklist Diário</h3>
          <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.primary }}>{completedToday}/{totalChecklist}</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: COLORS.bg, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryLight})`, width: `${totalChecklist ? (completedToday/totalChecklist)*100 : 0}%`, transition: "width 0.5s" }} />
        </div>
        {checklistItems.map(item => (
          <div key={item.id} onClick={() => {
            const updated = checklistItems.map(c => c.id === item.id ? { ...c, done: !c.done } : c);
            saveChecklist(updated);
          }} style={{ ...styles.card, display: "flex", alignItems: "center", gap: 12, padding: 14, cursor: "pointer", marginBottom: 8, border: item.done ? `1px solid ${COLORS.success}30` : `1px solid ${COLORS.border}`, background: item.done ? COLORS.successBg : COLORS.card }}>
            {item.done ? <CheckCircle size={22} color={COLORS.success} /> : <Circle size={22} color={COLORS.textLight} />}
            <span style={{ fontSize: 14, fontWeight: 600, color: item.done ? COLORS.success : COLORS.text, textDecoration: item.done ? "line-through" : "none" }}>{item.text}</span>
          </div>
        ))}
        {completedToday === totalChecklist && totalChecklist > 0 && (
          <div style={{ ...styles.card, background: `linear-gradient(135deg, ${COLORS.successBg}, #D1FAE5)`, textAlign: "center", padding: 20, marginTop: 8 }}>
            <span style={{ fontSize: 40 }}>🎉</span>
            <p style={{ fontSize: 16, fontWeight: 800, color: COLORS.success, margin: "8px 0 0" }}>Parabéns!</p>
            <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: "4px 0 0" }}>Você completou todas as tarefas de hoje!</p>
          </div>
        )}
      </div>

      {/* Medication history */}
      <div style={styles.section}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ ...styles.sectionTitle, marginBottom: 0 }}>💊 Medicação de Hoje</h3>
          <button onClick={() => setModal("addMedication")} style={{ background: "none", border: "none", color: COLORS.primary, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>+ Adicionar</button>
        </div>
        {todayMeds.length === 0 ? (
          <div style={{ ...styles.card, textAlign: "center", padding: 20, color: COLORS.textLight }}>
            <Pill size={24} style={{ opacity: 0.3, marginBottom: 6 }} />
            <p style={{ fontSize: 13, margin: 0 }}>Nenhuma medicação registrada hoje</p>
          </div>
        ) : (
          todayMeds.map(m => (
            <div key={m.id} style={{ ...styles.card, display: "flex", alignItems: "center", gap: 12, padding: 14, marginBottom: 8, borderLeft: `4px solid ${m.type === "insulina" ? "#8B5CF6" : COLORS.accent}` }}>
              <span style={{ fontSize: 22 }}>{m.type === "insulina" ? "💉" : "💊"}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: 0 }}>{m.name}</p>
                <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: "2px 0 0" }}>Dose: {m.dose} · {formatTime(m.time)}{m.notes ? ` · ${m.notes}` : ""}</p>
              </div>
              <button onClick={() => save({...data, medications: (data.medications||[]).filter(x => x.id !== m.id)})} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textLight }}><Trash2 size={14} /></button>
            </div>
          ))
        )}
        {/* Medication history */}
        {(data.medications || []).filter(m => m.date !== today()).length > 0 && (
          <>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, margin: "16px 0 8px" }}>Histórico recente</h4>
            {[...(data.medications || [])].filter(m => m.date !== today()).reverse().slice(0, 5).map(m => (
              <div key={m.id} style={{ ...styles.card, display: "flex", alignItems: "center", gap: 10, padding: 12, marginBottom: 6, opacity: 0.7 }}>
                <span style={{ fontSize: 18 }}>{m.type === "insulina" ? "💉" : "💊"}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, margin: 0 }}>{m.name} — {m.dose}</p>
                  <p style={{ fontSize: 11, color: COLORS.textLight, margin: 0 }}>{formatDate(m.date)} · {formatTime(m.time)}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Weekly meal plan preview */}
      <div style={styles.section}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ ...styles.sectionTitle, marginBottom: 0 }}>🎯 Minhas Metas</h3>
          <button onClick={() => setModal("addGoal")} style={{ background: "none", border: "none", color: COLORS.primary, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>+ Adicionar</button>
        </div>
        {totalGoals > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1, background: COLORS.successBg, borderRadius: 12, padding: 10, textAlign: "center" }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: COLORS.success, margin: 0 }}>{completedGoals}</p>
              <p style={{ fontSize: 10, color: COLORS.textSecondary, margin: 0, fontWeight: 600 }}>Concluídas</p>
            </div>
            <div style={{ flex: 1, background: COLORS.primaryBg, borderRadius: 12, padding: 10, textAlign: "center" }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: COLORS.primary, margin: 0 }}>{totalGoals - completedGoals}</p>
              <p style={{ fontSize: 10, color: COLORS.textSecondary, margin: 0, fontWeight: 600 }}>Em andamento</p>
            </div>
          </div>
        )}
        {goals.length === 0 ? (
          <div style={{ ...styles.card, textAlign: "center", padding: 20, color: COLORS.textLight }}>
            <Target size={24} style={{ opacity: 0.3, marginBottom: 6 }} />
            <p style={{ fontSize: 13, margin: "0 0 8px" }}>Defina metas para se manter motivado</p>
            <p style={{ fontSize: 11, color: COLORS.textLight, margin: 0 }}>Ex: medir glicemia 4x por dia, caminhar 20 min, beber mais água</p>
          </div>
        ) : (
          goals.map(g => (
            <div key={g.id} onClick={() => toggleGoal(g.id)} style={{
              ...styles.card, display: "flex", alignItems: "center", gap: 12, padding: 14, cursor: "pointer", marginBottom: 8,
              border: g.done ? `1px solid ${COLORS.success}30` : `1px solid ${COLORS.border}`,
              background: g.done ? COLORS.successBg : COLORS.card,
            }}>
              {g.done ? <CheckCircle size={22} color={COLORS.success} /> : <Circle size={22} color={COLORS.textLight} />}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: g.done ? COLORS.success : COLORS.text, margin: 0, textDecoration: g.done ? "line-through" : "none" }}>{g.name}</p>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <span style={styles.badge(
                    g.category === "saúde" ? COLORS.successBg : g.category === "alimentação" ? COLORS.accentLight : g.category === "exercício" ? COLORS.primaryBg : "#F5F3FF",
                    g.category === "saúde" ? COLORS.success : g.category === "alimentação" ? COLORS.accent : g.category === "exercício" ? COLORS.primary : "#8B5CF6",
                  )}>
                    {g.category === "saúde" ? "❤️" : g.category === "alimentação" ? "🍎" : g.category === "exercício" ? "🏃" : "📋"} {g.category}
                  </span>
                  {g.target && <span style={styles.badge(COLORS.bg, COLORS.textSecondary)}>{g.target}</span>}
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); deleteGoal(g.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textLight, padding: 4 }}><Trash2 size={14} /></button>
            </div>
          ))
        )}
      </div>

      {/* Habits */}
      <div style={styles.section}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ ...styles.sectionTitle, marginBottom: 0 }}>🔥 Hábitos Diários</h3>
          <button onClick={() => setModal("addHabit")} style={{ background: "none", border: "none", color: COLORS.primary, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>+ Adicionar</button>
        </div>
        {habits.length > 0 && (
          <div style={{ height: 8, borderRadius: 4, background: COLORS.bg, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${COLORS.accent}, #F97316)`, width: `${habits.length ? (completedHabitsToday/habits.length)*100 : 0}%`, transition: "width 0.5s" }} />
          </div>
        )}
        {habits.length === 0 ? (
          <div style={{ ...styles.card, textAlign: "center", padding: 20, color: COLORS.textLight }}>
            <Flame size={24} style={{ opacity: 0.3, marginBottom: 6 }} />
            <p style={{ fontSize: 13, margin: "0 0 8px" }}>Crie hábitos para manter a constância</p>
            <p style={{ fontSize: 11, color: COLORS.textLight, margin: 0 }}>Marque todos os dias e acompanhe sua sequência</p>
          </div>
        ) : (
          habits.map(h => {
            const done = isHabitDoneToday(h.id);
            const streak = getHabitStreak(h.id);
            return (
              <div key={h.id} onClick={() => toggleHabitToday(h.id)} style={{
                ...styles.card, display: "flex", alignItems: "center", gap: 12, padding: 14, cursor: "pointer", marginBottom: 8,
                border: done ? `1px solid ${COLORS.accent}30` : `1px solid ${COLORS.border}`,
                background: done ? COLORS.accentLight : COLORS.card,
              }}>
                <span style={{ fontSize: 28 }}>{h.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: done ? COLORS.accent : COLORS.text, margin: 0 }}>{h.name}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: COLORS.textSecondary }}>{h.target}</span>
                    {streak > 0 && (
                      <span style={styles.badge(COLORS.accentLight, COLORS.accent)}>🔥 {streak} {streak === 1 ? "dia" : "dias"}</span>
                    )}
                  </div>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: 8, border: `2px solid ${done ? COLORS.accent : COLORS.border}`, background: done ? COLORS.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                  {done && <Check size={16} color="#fff" />}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Weekly meal plan */}
      <div style={styles.section}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ ...styles.sectionTitle, marginBottom: 0 }}>📅 Planejador Semanal</h3>
          <button onClick={() => setModal("mealPlanner")} style={{ background: "none", border: "none", color: COLORS.primary, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>+ Planejar</button>
        </div>
        {Object.keys(data.mealPlan || {}).length === 0 ? (
          <div style={{ ...styles.card, textAlign: "center", padding: 20, color: COLORS.textLight }}>
            <ClipboardList size={24} style={{ opacity: 0.3, marginBottom: 6 }} />
            <p style={{ fontSize: 13, margin: 0 }}>Planeje suas refeições da semana</p>
          </div>
        ) : (
          PLAN_DAYS.filter(d => PLAN_MEALS.some(m => (data.mealPlan||{})[`${d}-${m}`])).slice(0, 3).map(day => (
            <div key={day} style={{ ...styles.card, padding: 14, marginBottom: 8 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: COLORS.primary, margin: "0 0 8px" }}>{day}</p>
              {PLAN_MEALS.filter(m => (data.mealPlan||{})[`${day}-${m}`]).map(meal => (
                <div key={meal} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                  <span style={{ fontSize: 12 }}>{meal === "café da manhã" ? "☕" : meal === "almoço" ? "🍽️" : meal === "lanche" ? "🍎" : "🌙"}</span>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textSecondary, textTransform: "capitalize" }}>{meal}</span>
                    <p style={{ fontSize: 12, color: COLORS.text, margin: 0 }}>{(data.mealPlan||{})[`${day}-${meal}`]}</p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Reminders */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}><Bell size={18} color={COLORS.accent} /> Meus Lembretes</h3>
        {(data.reminders || DEFAULT_REMINDERS).map(r => (
          <div key={r.id} style={{ ...styles.card, display: "flex", alignItems: "center", gap: 12, padding: 14, marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>{r.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, margin: 0 }}>{r.title}</p>
              <p style={{ fontSize: 12, color: COLORS.textLight, margin: 0 }}>{r.time}</p>
            </div>
            <div style={{ width: 40, height: 24, borderRadius: 12, background: r.active ? COLORS.success : COLORS.border, cursor: "pointer", position: "relative", transition: "background 0.2s" }} onClick={() => {
              const updated = (data.reminders || DEFAULT_REMINDERS).map(rem => rem.id === r.id ? { ...rem, active: !rem.active } : rem);
              save({ ...data, reminders: updated });
            }}>
              <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", position: "absolute", top: 2, left: r.active ? 18 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
  };

  // ==================== TAB: LEARN ====================
  const renderLearn = () => (
    <>
      <div style={{ ...styles.header, paddingBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>📚 Aprender</h1>
        <p style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Dicas rápidas e conteúdos educativos</p>
      </div>

      <div style={styles.section}>
        {EDUCATIONAL_CONTENT.map(article => (
          <div key={article.id} style={{ ...styles.card, cursor: "pointer", padding: 0, overflow: "hidden", marginBottom: 12 }} onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: article.bgColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 24 }}>
                {article.icon}
              </div>
              <div style={{ flex: 1 }}>
                <span style={styles.badge(article.bgColor, article.color)}>{article.category}</span>
                <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: "4px 0 0" }}>{article.title}</p>
              </div>
              {expandedArticle === article.id ? <ChevronUp size={18} color={COLORS.textLight} /> : <ChevronDown size={18} color={COLORS.textLight} />}
            </div>
            {expandedArticle === article.id && (
              <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${COLORS.border}` }}>
                <p style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.7, margin: "12px 0 0" }}>{article.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}><span style={{ fontSize: 18 }}>❓</span> Perguntas Frequentes (FAQ)</h3>
        {FAQ_DATA.map((faq, i) => (
          <div key={i} style={{ ...styles.card, cursor: "pointer", padding: 0, overflow: "hidden", marginBottom: 8 }} onClick={() => setExpandedArticle(expandedArticle === `faq-${i}` ? null : `faq-${i}`)}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: COLORS.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, fontWeight: 800, color: COLORS.primary }}>{i+1}</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: 0, flex: 1 }}>{faq.q}</p>
              {expandedArticle === `faq-${i}` ? <ChevronUp size={16} color={COLORS.textLight} /> : <ChevronDown size={16} color={COLORS.textLight} />}
            </div>
            {expandedArticle === `faq-${i}` && (
              <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${COLORS.border}` }}>
                <p style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.7, margin: "10px 0 0" }}>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Glossary */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}><span style={{ fontSize: 18 }}>📖</span> Glossário Médico</h3>
        <p style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 12 }}>Termos importantes explicados de forma simples:</p>
        {GLOSSARY_DATA.slice(0, 6).map((g, i) => (
          <div key={i} style={{ ...styles.card, padding: 0, overflow: "hidden", marginBottom: 6, cursor: "pointer" }} onClick={() => setExpandedArticle(expandedArticle === `glos-${i}` ? null : `glos-${i}`)}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: COLORS.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontSize: 14 }}>📖</span></div>
              <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: 0, flex: 1 }}>{g.term}</p>
              {expandedArticle === `glos-${i}` ? <ChevronUp size={14} color={COLORS.textLight} /> : <ChevronDown size={14} color={COLORS.textLight} />}
            </div>
            {expandedArticle === `glos-${i}` && (
              <div style={{ padding: "0 12px 12px", borderTop: `1px solid ${COLORS.border}` }}>
                <p style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6, margin: "8px 0 0" }}>{g.def}</p>
              </div>
            )}
          </div>
        ))}
        <button onClick={() => setModal("glossary")} style={{ ...styles.button("secondary"), marginTop: 4 }}>Ver glossário completo ({GLOSSARY_DATA.length} termos)</button>
      </div>
    </>
  );

  // ==================== TAB: PROFILE (Phase 3 Enhanced) ====================
  const renderProfile = () => {
    const daysUsing = Math.max(1, Math.ceil((Date.now() - new Date(data.user.createdAt).getTime()) / 86400000));
    const totalGlucose = data.glucoseRecords.length;
    const totalMeals = (data.foodDiary || []).length;
    const totalMeds = (data.medications || []).length;
    const goalsCompleted = (data.goals || []).filter(g => g.done).length;

    // === ACHIEVEMENTS SYSTEM ===
    const ACHIEVEMENTS = [
      { id: "first_glucose", icon: "💧", title: "Primeira Medição", desc: "Registrou sua primeira glicemia", unlocked: totalGlucose >= 1 },
      { id: "glucose_10", icon: "🩸", title: "Monitoramento Constante", desc: "10 registros de glicemia", unlocked: totalGlucose >= 10 },
      { id: "glucose_50", icon: "📊", title: "Mestre do Monitoramento", desc: "50 registros de glicemia", unlocked: totalGlucose >= 50 },
      { id: "first_meal", icon: "🍽️", title: "Diário Iniciado", desc: "Registrou sua primeira refeição", unlocked: totalMeals >= 1 },
      { id: "meals_20", icon: "📝", title: "Diário Dedicado", desc: "20 refeições registradas", unlocked: totalMeals >= 20 },
      { id: "first_med", icon: "💊", title: "Medicação em Dia", desc: "Primeiro registro de medicação", unlocked: totalMeds >= 1 },
      { id: "goal_1", icon: "🎯", title: "Meta Cumprida", desc: "Completou sua primeira meta", unlocked: goalsCompleted >= 1 },
      { id: "goals_5", icon: "🏆", title: "Realizador", desc: "5 metas concluídas", unlocked: goalsCompleted >= 5 },
      { id: "days_7", icon: "📅", title: "Uma Semana!", desc: "7 dias usando o GlicoVida", unlocked: daysUsing >= 7 },
      { id: "days_30", icon: "🌟", title: "Um Mês!", desc: "30 dias usando o GlicoVida", unlocked: daysUsing >= 30 },
      { id: "days_90", icon: "👑", title: "Lenda!", desc: "90 dias usando o GlicoVida", unlocked: daysUsing >= 90 },
      { id: "explorer", icon: "🗺️", title: "Explorador", desc: "Usou a seção de viagem", unlocked: Object.keys(data.travelChecked || {}).length > 0 },
    ];
    const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;
    const userLevel = unlockedCount <= 2 ? "Iniciante" : unlockedCount <= 5 ? "Dedicado" : unlockedCount <= 8 ? "Avançado" : "Expert";
    const levelEmoji = unlockedCount <= 2 ? "🌱" : unlockedCount <= 5 ? "🌿" : unlockedCount <= 8 ? "🌳" : "👑";

    // === INSIGHTS ENGINE ===
    const generateInsights = () => {
      const insights = [];
      const recs = data.glucoseRecords;
      if (recs.length >= 5) {
        const avg = Math.round(recs.reduce((s,r) => s+r.value, 0) / recs.length);
        if (avg > 180) insights.push({ icon: "⚠️", color: COLORS.danger, text: `Sua média de glicemia está em ${avg} mg/dL — acima do ideal. Converse com seu médico sobre ajustar o tratamento.` });
        else if (avg <= 130) insights.push({ icon: "✅", color: COLORS.success, text: `Ótimo! Sua média de glicemia está em ${avg} mg/dL — dentro da faixa ideal. Continue assim!` });
        else insights.push({ icon: "💡", color: COLORS.warning, text: `Sua média de glicemia está em ${avg} mg/dL — um pouco elevada. Tente reforçar a ordem dos alimentos no prato.` });

        const afterMeal = recs.filter(r => r.context === "após refeição");
        const beforeMeal = recs.filter(r => r.context === "antes refeição" || r.context === "jejum");
        if (afterMeal.length >= 3 && beforeMeal.length >= 3) {
          const avgAfter = Math.round(afterMeal.reduce((s,r) => s+r.value, 0) / afterMeal.length);
          const avgBefore = Math.round(beforeMeal.reduce((s,r) => s+r.value, 0) / beforeMeal.length);
          if (avgAfter - avgBefore > 60) insights.push({ icon: "🍽️", color: COLORS.accent, text: `Seus picos pós-refeição são altos (média ${avgAfter} mg/dL). Tente comer vegetais e proteínas antes dos carboidratos.` });
        }

        const nightRecs = recs.filter(r => r.context === "antes dormir" || r.context === "madrugada");
        if (nightRecs.length >= 2) {
          const nightAvg = Math.round(nightRecs.reduce((s,r) => s+r.value, 0) / nightRecs.length);
          if (nightAvg < 80) insights.push({ icon: "🌙", color: "#8B5CF6", text: `Suas glicemias noturnas estão baixas (média ${nightAvg} mg/dL). Considere um lanche leve antes de dormir.` });
        }

        const hypoCount = recs.filter(r => r.value < 70).length;
        if (hypoCount >= 3) insights.push({ icon: "🚨", color: COLORS.danger, text: `Você teve ${hypoCount} episódios de hipoglicemia. Converse com seu médico sobre ajuste de dose.` });

        const last7 = recs.filter(r => { const d = new Date(); d.setDate(d.getDate()-7); return r.date >= d.toISOString().split("T")[0]; });
        if (last7.length < 7 && recs.length > 0) insights.push({ icon: "📉", color: COLORS.warning, text: `Você fez apenas ${last7.length} medições nos últimos 7 dias. Tente medir pelo menos 3-4 vezes por dia.` });
      }
      if (insights.length === 0) insights.push({ icon: "📊", color: COLORS.primary, text: "Continue registrando suas glicemias para receber insights personalizados. Quanto mais dados, melhores as análises!" });
      return insights;
    };
    const insights = generateInsights();

    return (
    <>
      <div style={{ ...styles.header, paddingBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>👤 Perfil</h1>
        <p style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Conquistas, insights e relatórios</p>
      </div>

      <div style={styles.section}>
        {/* User info with level */}
        <div style={{ ...styles.card, display: "flex", alignItems: "center", gap: 16, padding: 20 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 26, fontWeight: 800 }}>
              {data.user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span style={{ position: "absolute", bottom: -4, right: -4, fontSize: 20 }}>{levelEmoji}</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: COLORS.text, margin: 0 }}>{data.user.name}</p>
            <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: "2px 0 0" }}>{data.user.email}</p>
            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
              <span style={styles.badge(COLORS.primaryBg, COLORS.primary)}>Diabetes {data.user.diabetesType}</span>
              <span style={styles.badge(COLORS.accentLight, COLORS.accent)}>Nível: {userLevel}</span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
          <button onClick={() => setModal("report")} style={{ ...styles.card, padding: 14, textAlign: "center", cursor: "pointer", border: `2px solid ${COLORS.primary}20`, marginBottom: 0 }}>
            <BarChart3 size={24} color={COLORS.primary} />
            <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, margin: "6px 0 0" }}>📋 Relatório Médico</p>
          </button>
          <button onClick={() => { if (adminUnlocked) { setModal("admin"); } else { setAdminPassword(""); setAdminError(""); setModal("adminLogin"); } }} style={{ ...styles.card, padding: 14, textAlign: "center", cursor: "pointer", border: `2px solid #8B5CF620`, marginBottom: 0 }}>
            <Activity size={24} color="#8B5CF6" />
            <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, margin: "6px 0 0" }}>📊 Painel Admin</p>
          </button>
        </div>

        {/* Achievements */}
        <h3 style={{ ...styles.sectionTitle, marginTop: 20 }}><Award size={18} color={COLORS.accent} /> Conquistas ({unlockedCount}/{ACHIEVEMENTS.length})</h3>
        <div style={{ height: 8, borderRadius: 4, background: COLORS.bg, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg, #F59E0B, #F97316)`, width: `${(unlockedCount/ACHIEVEMENTS.length)*100}%`, transition: "width 0.5s" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {ACHIEVEMENTS.map(a => (
            <div key={a.id} style={{
              ...styles.card, padding: 12, textAlign: "center", marginBottom: 0,
              opacity: a.unlocked ? 1 : 0.4,
              background: a.unlocked ? COLORS.accentLight : COLORS.bg,
              border: a.unlocked ? `1px solid ${COLORS.accent}30` : `1px solid ${COLORS.border}`,
            }}>
              <span style={{ fontSize: 28, filter: a.unlocked ? "none" : "grayscale(1)" }}>{a.icon}</span>
              <p style={{ fontSize: 11, fontWeight: 700, color: a.unlocked ? COLORS.text : COLORS.textLight, margin: "4px 0 0" }}>{a.title}</p>
              <p style={{ fontSize: 9, color: COLORS.textSecondary, margin: "2px 0 0" }}>{a.desc}</p>
            </div>
          ))}
        </div>

        {/* Insights */}
        <h3 style={{ ...styles.sectionTitle, marginTop: 20 }}><Lightbulb size={18} color={COLORS.warning} /> Insights Automáticos</h3>
        {insights.map((ins, i) => (
          <div key={i} style={{ ...styles.card, display: "flex", alignItems: "flex-start", gap: 12, padding: 14, marginBottom: 8, borderLeft: `4px solid ${ins.color}` }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{ins.icon}</span>
            <p style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6, margin: 0 }}>{ins.text}</p>
          </div>
        ))}

        {/* Stats */}
        {/* Weekly Ranking */}
        <h3 style={{ ...styles.sectionTitle, marginTop: 20 }}><span style={{ fontSize: 18 }}>🏅</span> Ranking Semanal</h3>
        <div style={{ ...styles.card, background: `linear-gradient(135deg, #FFFBEB, #FEF3C7)`, border: `1px solid #F59E0B30`, padding: 20, textAlign: "center" }}>
          <span style={{ fontSize: 48 }}>{scoreLevelEmoji}</span>
          <p style={{ fontSize: 28, fontWeight: 800, color: COLORS.accent, margin: "8px 0 0" }}>{weeklyScore} pts</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: "4px 0 0" }}>Nível {scoreLevel}</p>
          <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: "8px 0 0" }}>Pontuação baseada nos seus registros dos últimos 7 dias</p>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
            <span style={styles.badge(COLORS.bg, COLORS.textSecondary)}>Glicemia: 5pts</span>
            <span style={styles.badge(COLORS.bg, COLORS.textSecondary)}>Refeição: 3pts</span>
            <span style={styles.badge(COLORS.bg, COLORS.textSecondary)}>Medicação: 4pts</span>
            <span style={styles.badge(COLORS.bg, COLORS.textSecondary)}>Checklist: 10pts</span>
            <span style={styles.badge(COLORS.bg, COLORS.textSecondary)}>Meta: 15pts</span>
          </div>
        </div>

        {/* Stats */}
        <h3 style={{ ...styles.sectionTitle, marginTop: 20 }}><BarChart3 size={18} color={COLORS.primary} /> Resumo Geral</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { label: "Glicemias", value: totalGlucose, icon: "💧" },
            { label: "Refeições", value: totalMeals, icon: "🍽️" },
            { label: "Medicações", value: totalMeds, icon: "💊" },
            { label: "Metas", value: goalsCompleted, icon: "🎯" },
            { label: "Dias no app", value: daysUsing, icon: "📅" },
            { label: "Conquistas", value: unlockedCount, icon: "🏆" },
          ].map(s => (
            <div key={s.label} style={{ ...styles.card, textAlign: "center", padding: 12, marginBottom: 0 }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <p style={{ fontSize: 18, fontWeight: 800, color: COLORS.primary, margin: "4px 0 0" }}>{s.value}</p>
              <p style={{ fontSize: 10, color: COLORS.textSecondary, margin: 0, fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Emergency */}
        <h3 style={{ ...styles.sectionTitle, marginTop: 20 }}><AlertTriangle size={18} color={COLORS.danger} /> Emergência</h3>
        <div style={{ ...styles.card, borderLeft: `4px solid ${COLORS.danger}` }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: "0 0 8px" }}>⚡ Em caso de Hipoglicemia:</p>
          <p style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6, margin: 0 }}>
            1. Consuma 15g de carboidrato rápido{"\n"}2. Espere 15 minutos{"\n"}3. Meça novamente{"\n"}4. Se continuar baixa, repita{"\n"}5. Procure ajuda se não melhorar
          </p>
        </div>
        <div style={{ ...styles.card, borderLeft: `4px solid ${COLORS.warning}` }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: "0 0 8px" }}>⬆️ Em caso de Hiperglicemia:</p>
          <p style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6, margin: 0 }}>
            1. Beba bastante água{"\n"}2. Verifique a medicação{"\n"}3. Evite carboidratos{"\n"}4. Caminhada leve se possível{"\n"}5. Se acima de 300 mg/dL, procure médico
          </p>
        </div>

        {/* Bonuses */}
        <h3 style={{ ...styles.sectionTitle, marginTop: 20 }}><Star size={18} color="#F59E0B" /> Seus Bônus</h3>
        <div style={{ ...styles.card, background: `linear-gradient(135deg, ${COLORS.accentLight}, #FFF7ED)`, border: `1px solid ${COLORS.accent}20`, padding: 16, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: 0 }}>Parabéns! Com o GlicoVida você tem acesso a todos esses materiais exclusivos:</p>
        </div>
        {BONUSES_DATA.map((bonus, i) => (
          <div key={i} style={{ ...styles.card, display: "flex", alignItems: "flex-start", gap: 12, padding: 14, marginBottom: 8, borderLeft: `4px solid ${COLORS.accent}` }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>{bonus.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: 0 }}>{bonus.title}</p>
              </div>
              <span style={styles.badge(COLORS.accentLight, COLORS.accent)}>{bonus.tag}</span>
              <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: "6px 0 0", lineHeight: 1.5 }}>{bonus.desc}</p>
            </div>
          </div>
        ))}

        {/* About GlicoVida */}
        <h3 style={{ ...styles.sectionTitle, marginTop: 20 }}><Heart size={18} color={COLORS.danger} /> Sobre o GlicoVida</h3>
        <div style={{ ...styles.card, padding: 0, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #0D9488)`, padding: 24, textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: 22, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", backdropFilter: "blur(10px)" }}>
              <Droplets size={36} color="#fff" />
            </div>
            <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: 0 }}>GlicoVida</h3>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, margin: "4px 0 0" }}>Seu controle, sua liberdade</p>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <img src="data:image/jpeg;base64,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" style={{ width: 90, height: 90, borderRadius: 50, objectFit: "cover", border: "3px solid #14B8A6", boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }} alt="Gabriel Bartulici" />
              <p style={{ fontSize: 18, fontWeight: 800, color: COLORS.text, margin: "12px 0 0" }}>Gabriel Bartulici</p>
              <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: "2px 0 0" }}>Criador do GlicoVida</p>
            </div>

            <p style={{ fontSize: 14, fontWeight: 800, color: COLORS.primary, margin: "0 0 8px" }}>A história por trás do GlicoVida</p>
            <p style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.8, margin: "0 0 12px" }}>
              Há mais de 10 anos eu convivo com a diabetes tipo 1. Durante todo esse tempo, passei por todos os desafios que um diabético enfrenta: o medo de comer, as restrições desnecessárias, a falta de informação e a dificuldade de manter uma rotina organizada.
            </p>
            <p style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.8, margin: "0 0 12px" }}>
              Com o tempo, aprendi que é possível viver com liberdade, comer de tudo e manter a glicemia sob controle — sem sofrimento e sem medo. Essa experiência real me motivou a criar o GlicoVida: um app que reúne tudo o que eu gostaria de ter tido quando recebi meu diagnóstico.
            </p>
            <p style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.8, margin: "0 0 16px" }}>
              O GlicoVida não foi criado em um laboratório ou por uma empresa distante. Ele nasceu da vivência real de alguém que entende o que você sente, porque vive a mesma coisa todos os dias. Cada funcionalidade, cada dica, cada conteúdo foi pensado para facilitar a sua vida e te dar o controle de volta.
            </p>

            <div style={{ ...styles.card, background: COLORS.primaryBg, border: `1px solid ${COLORS.primary}20`, padding: 16, marginBottom: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: COLORS.primary, margin: "0 0 8px" }}>🎯 Nossa missão</p>
              <p style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.7, margin: 0 }}>
                Ajudar pessoas com diabetes tipo 1 e tipo 2 a viverem com mais leveza, organização e liberdade. Acreditamos que ninguém precisa viver refém da diabetes — com informação, ferramentas e apoio, o controle está nas suas mãos.
              </p>
            </div>
          </div>
        </div>

        <div style={{ ...styles.card, padding: 14, marginBottom: 12 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, margin: "0 0 8px" }}>📬 Contato e Suporte</p>
          <p style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.7, margin: 0 }}>
            Tem alguma dúvida, sugestão ou precisa de ajuda? Entre em contato:{"\n\n"}
            📧 E-mail: glicovida.contato@gmail.com{"\n"}
            💬 Responderemos o mais rápido possível!
          </p>
        </div>

        <div style={{ textAlign: "center", padding: "8px 0 0" }}>
          <p style={{ fontSize: 11, color: COLORS.textLight, margin: 0 }}>GlicoVida © 2025 — Todos os direitos reservados</p>
          <p style={{ fontSize: 10, color: COLORS.textLight, margin: "4px 0 0" }}>Feito com ❤️ por Gabriel Bartulici</p>
        </div>

        {/* Dark Mode Toggle */}
        <div style={{ ...styles.card, display: "flex", alignItems: "center", gap: 12, padding: 16, marginTop: 20 }}>
          <Moon size={22} color="#8B5CF6" />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: 0 }}>Modo Escuro</p>
            <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: "2px 0 0" }}>Ideal para uso noturno</p>
          </div>
          <div style={{ width: 48, height: 28, borderRadius: 14, background: darkMode ? "#8B5CF6" : COLORS.border, cursor: "pointer", position: "relative", transition: "background 0.3s" }} onClick={toggleDarkMode}>
            <div style={{ width: 24, height: 24, borderRadius: 12, background: "#fff", position: "absolute", top: 2, left: darkMode ? 22 : 2, transition: "left 0.3s", boxShadow: "0 2px 4px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 12 }}>{darkMode ? "🌙" : "☀️"}</span>
            </div>
          </div>
        </div>

        <button onClick={() => save(defaultData)} style={{ ...styles.button("danger"), marginTop: 16 }}>
          Sair da conta
        </button>
      </div>
    </>
  );
  };

  // ==================== MODALS ====================
  const renderModals = () => (
    <>
      {/* Add Glucose Modal */}
      <Modal open={modal === "addGlucose"} onClose={() => setModal(null)} title="Registrar Glicemia">
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>Valor (mg/dL)</label>
          <input style={{ ...styles.input, fontSize: 28, fontWeight: 800, textAlign: "center", color: COLORS.primary }} type="number" placeholder="120" value={glucoseForm.value} onChange={e => setGlucoseForm({...glucoseForm, value: e.target.value})} autoFocus />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 8 }}>Contexto</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["jejum", "antes refeição", "após refeição", "antes dormir", "madrugada", "outro"].map(c => (
              <button key={c} onClick={() => setGlucoseForm({...glucoseForm, context: c})} style={{
                padding: "8px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                background: glucoseForm.context === c ? COLORS.primary : COLORS.bg,
                color: glucoseForm.context === c ? "#fff" : COLORS.textSecondary,
                border: `1.5px solid ${glucoseForm.context === c ? COLORS.primary : COLORS.border}`,
              }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>Observações (opcional)</label>
          <input style={styles.input} placeholder="Ex: após exercício, estresse..." value={glucoseForm.notes} onChange={e => setGlucoseForm({...glucoseForm, notes: e.target.value})} />
        </div>
        <button onClick={addGlucoseRecord} style={styles.button("primary")}>
          <Check size={18} /> Salvar Registro
        </button>
      </Modal>

      {/* Calculator Modal */}
      <Modal open={modal === "calculator"} onClose={() => { setModal(null); setCarbCalcItems([]); }} title="Calculadora de Carboidratos">
        <div style={{ marginBottom: 16 }}>
          <div style={{ position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: COLORS.textLight }} />
            <input style={{ ...styles.input, paddingLeft: 40 }} placeholder="Buscar alimento..." value={foodSearch} onChange={e => setFoodSearch(e.target.value)} />
          </div>
        </div>

        {/* Selected items */}
        {carbCalcItems.length > 0 && (
          <div style={{ ...styles.card, background: COLORS.primaryBg, border: `1px solid ${COLORS.primary}20`, marginBottom: 16, padding: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.primary, margin: "0 0 8px" }}>Sua refeição:</p>
            {carbCalcItems.map(f => (
              <div key={f.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
                <span style={{ fontSize: 13, color: COLORS.text }}>{f.name} x{f.qty}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.primary }}>{f.carbs * f.qty}g</span>
                  <button onClick={() => setCarbCalcItems(carbCalcItems.filter(i => i.name !== f.name))} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textLight }}>
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${COLORS.primary}30`, marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: COLORS.primary }}>Total de carboidratos</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.primary }}>{totalCarbs}g</span>
            </div>
          </div>
        )}

        {/* Food list */}
        <div style={{ maxHeight: 300, overflow: "auto" }}>
          {filteredFoods.map(f => (
            <div key={f.name} onClick={() => addToCarbCalc(f)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, margin: 0 }}>{f.name}</p>
                <span style={styles.badge(
                  f.gi === "baixo" ? COLORS.successBg : f.gi === "médio" ? COLORS.warningBg : COLORS.dangerBg,
                  f.gi === "baixo" ? COLORS.success : f.gi === "médio" ? COLORS.warning : COLORS.danger,
                )}>IG {f.gi}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 16, fontWeight: 800, color: COLORS.primary, margin: 0 }}>{f.carbs}g</p>
                <p style={{ fontSize: 10, color: COLORS.textLight, margin: 0 }}>carbs</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Food Library Modal */}
      <Modal open={modal === "foodLibrary"} onClose={() => setModal(null)} title="Biblioteca de Alimentos">
        <div style={{ marginBottom: 16 }}>
          <input style={styles.input} placeholder="Buscar alimento..." value={foodSearch} onChange={e => setFoodSearch(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {["Todos", ...new Set(FOOD_DATABASE.map(f => f.category))].map(cat => (
            <button key={cat} onClick={() => setFoodSearch(cat === "Todos" ? "" : cat)} style={{
              padding: "6px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: (foodSearch === cat || (cat === "Todos" && !foodSearch)) ? COLORS.primary : COLORS.bg,
              color: (foodSearch === cat || (cat === "Todos" && !foodSearch)) ? "#fff" : COLORS.textSecondary,
              border: "none", fontFamily: "inherit",
            }}>
              {cat}
            </button>
          ))}
        </div>
        <div style={{ maxHeight: 400, overflow: "auto" }}>
          {filteredFoods.map(f => (
            <div key={f.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, margin: 0 }}>{f.name}</p>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <span style={styles.badge(COLORS.bg, COLORS.textSecondary)}>{f.category}</span>
                  <span style={styles.badge(
                    f.gi === "baixo" ? COLORS.successBg : f.gi === "médio" ? COLORS.warningBg : COLORS.dangerBg,
                    f.gi === "baixo" ? COLORS.success : f.gi === "médio" ? COLORS.warning : COLORS.danger,
                  )}>IG {f.gi}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: COLORS.primary, margin: 0 }}>{f.carbs}g</p>
                <p style={{ fontSize: 10, color: COLORS.textLight, margin: 0 }}>carboidratos</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Food Diary Modal */}
      <Modal open={modal === "addFoodDiary"} onClose={() => setModal(null)} title="Registrar Refeição">
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 8 }}>Refeição</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              { id: "café da manhã", emoji: "☕" },
              { id: "almoço", emoji: "🍽️" },
              { id: "lanche", emoji: "🍎" },
              { id: "jantar", emoji: "🌙" },
              { id: "ceia", emoji: "🫖" },
            ].map(m => (
              <button key={m.id} onClick={() => setFoodDiaryForm({...foodDiaryForm, meal: m.id})} style={{
                padding: "8px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                background: foodDiaryForm.meal === m.id ? COLORS.primary : COLORS.bg,
                color: foodDiaryForm.meal === m.id ? "#fff" : COLORS.textSecondary,
                border: `1.5px solid ${foodDiaryForm.meal === m.id ? COLORS.primary : COLORS.border}`,
              }}>
                {m.emoji} {m.id}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>O que você comeu?</label>
          <textarea style={{ ...styles.input, minHeight: 80, resize: "vertical" }} placeholder="Ex: Arroz integral, feijão, frango grelhado e salada..." value={foodDiaryForm.foods} onChange={e => setFoodDiaryForm({...foodDiaryForm, foods: e.target.value})} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>Total de carboidratos estimado (g)</label>
          <input style={styles.input} type="number" placeholder="Ex: 45" value={foodDiaryForm.carbs} onChange={e => setFoodDiaryForm({...foodDiaryForm, carbs: e.target.value})} />
          <p style={{ fontSize: 11, color: COLORS.textLight, marginTop: 4 }}>💡 Use a calculadora de carboidratos para estimar</p>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>Observações (opcional)</label>
          <input style={styles.input} placeholder="Ex: comi fora de casa, porção pequena..." value={foodDiaryForm.notes} onChange={e => setFoodDiaryForm({...foodDiaryForm, notes: e.target.value})} />
        </div>
        <button onClick={addFoodDiaryEntry} style={styles.button("primary")}>
          <Check size={18} /> Salvar Refeição
        </button>
      </Modal>

      {/* Add Medication Modal */}
      <Modal open={modal === "addMedication"} onClose={() => setModal(null)} title="Registrar Medicação">
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 8 }}>Tipo</label>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { id: "insulina", label: "💉 Insulina" },
              { id: "oral", label: "💊 Medicamento Oral" },
            ].map(t => (
              <button key={t.id} onClick={() => setMedForm({...medForm, type: t.id})} style={{
                flex: 1, padding: "12px 0", borderRadius: 12, border: `2px solid ${medForm.type === t.id ? "#8B5CF6" : COLORS.border}`,
                background: medForm.type === t.id ? "#F5F3FF" : "#fff",
                color: medForm.type === t.id ? "#8B5CF6" : COLORS.textSecondary,
                fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>Nome do medicamento</label>
          <input style={styles.input} placeholder={medForm.type === "insulina" ? "Ex: Insulina NPH, Humalog..." : "Ex: Metformina, Gliclazida..."} value={medForm.name} onChange={e => setMedForm({...medForm, name: e.target.value})} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>Dose</label>
          <input style={styles.input} placeholder={medForm.type === "insulina" ? "Ex: 10 unidades" : "Ex: 850mg"} value={medForm.dose} onChange={e => setMedForm({...medForm, dose: e.target.value})} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>Observações (opcional)</label>
          <input style={styles.input} placeholder="Ex: antes do almoço, antes de dormir..." value={medForm.notes} onChange={e => setMedForm({...medForm, notes: e.target.value})} />
        </div>
        <button onClick={addMedication} style={styles.button("primary")}>
          <Check size={18} /> Salvar Medicação
        </button>
      </Modal>

      {/* Meal Planner Modal */}
      <Modal open={modal === "mealPlanner"} onClose={() => setModal(null)} title="Planejador Semanal">
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 8 }}>Dia da semana</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {PLAN_DAYS.map(d => (
              <button key={d} onClick={() => setMealPlanForm({...mealPlanForm, day: d})} style={{
                padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                background: mealPlanForm.day === d ? COLORS.primary : COLORS.bg,
                color: mealPlanForm.day === d ? "#fff" : COLORS.textSecondary,
                border: `1.5px solid ${mealPlanForm.day === d ? COLORS.primary : COLORS.border}`,
              }}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 8 }}>Refeição</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PLAN_MEALS.map(m => (
              <button key={m} onClick={() => setMealPlanForm({...mealPlanForm, meal: m})} style={{
                padding: "8px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                background: mealPlanForm.meal === m ? COLORS.accent : COLORS.bg,
                color: mealPlanForm.meal === m ? "#fff" : COLORS.textSecondary,
                border: `1.5px solid ${mealPlanForm.meal === m ? COLORS.accent : COLORS.border}`,
              }}>
                {m === "café da manhã" ? "☕" : m === "almoço" ? "🍽️" : m === "lanche" ? "🍎" : "🌙"} {m}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>O que planeja comer?</label>
          <textarea style={{ ...styles.input, minHeight: 80, resize: "vertical" }} placeholder="Ex: Omelete com espinafre, fatia de pão integral, café sem açúcar..." value={mealPlanForm.description} onChange={e => setMealPlanForm({...mealPlanForm, description: e.target.value})} />
          {(data.mealPlan||{})[`${mealPlanForm.day}-${mealPlanForm.meal}`] && (
            <div style={{ marginTop: 8, padding: 10, borderRadius: 8, background: COLORS.warningBg, border: `1px solid ${COLORS.warning}30` }}>
              <p style={{ fontSize: 12, color: COLORS.warning, fontWeight: 700, margin: "0 0 2px" }}>Já planejado:</p>
              <p style={{ fontSize: 12, color: COLORS.text, margin: 0 }}>{(data.mealPlan||{})[`${mealPlanForm.day}-${mealPlanForm.meal}`]}</p>
            </div>
          )}
        </div>
        <button onClick={saveMealPlan} style={styles.button("primary")}>
          <Check size={18} /> Salvar Planejamento
        </button>
        {Object.keys(data.mealPlan || {}).length > 0 && (
          <button onClick={() => save({...data, mealPlan: {}})} style={{ ...styles.button("ghost"), marginTop: 8 }}>
            <Trash2 size={14} /> Limpar planejamento
          </button>
        )}
      </Modal>

      {/* Add Goal Modal */}
      <Modal open={modal === "addGoal"} onClose={() => setModal(null)} title="Nova Meta">
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>Qual é sua meta?</label>
          <input style={styles.input} placeholder="Ex: Medir glicemia 4x por dia, Caminhar 20 minutos..." value={goalForm.name} onChange={e => setGoalForm({...goalForm, name: e.target.value})} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 8 }}>Categoria</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              { id: "saúde", emoji: "❤️", color: COLORS.success },
              { id: "alimentação", emoji: "🍎", color: COLORS.accent },
              { id: "exercício", emoji: "🏃", color: COLORS.primary },
              { id: "organização", emoji: "📋", color: "#8B5CF6" },
            ].map(c => (
              <button key={c.id} onClick={() => setGoalForm({...goalForm, category: c.id})} style={{
                padding: "8px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                background: goalForm.category === c.id ? `${c.color}15` : COLORS.bg,
                color: goalForm.category === c.id ? c.color : COLORS.textSecondary,
                border: `1.5px solid ${goalForm.category === c.id ? c.color : COLORS.border}`,
              }}>
                {c.emoji} {c.id}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>Detalhes ou prazo (opcional)</label>
          <input style={styles.input} placeholder="Ex: Até o final do mês, 3x por semana..." value={goalForm.target} onChange={e => setGoalForm({...goalForm, target: e.target.value})} />
        </div>
        <button onClick={() => { if (!goalForm.name) return; const goal = { id: uid(), ...goalForm, done: false, createdAt: today() }; save({ ...data, goals: [...(data.goals||[]), goal] }); setGoalForm({ name: "", category: "saúde", target: "" }); setModal(null); }} style={styles.button("primary")}>
          <Target size={18} /> Criar Meta
        </button>
        {/* Suggestions */}
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 8 }}>💡 Sugestões de metas:</p>
          {[
            { name: "Medir glicemia 4x por dia", cat: "saúde" },
            { name: "Beber 2 litros de água por dia", cat: "saúde" },
            { name: "Caminhar 30 minutos por dia", cat: "exercício" },
            { name: "Organizar refeições da semana", cat: "alimentação" },
            { name: "Dormir 8 horas por noite", cat: "saúde" },
            { name: "Registrar todas as refeições no app", cat: "organização" },
          ].map(s => (
            <button key={s.name} onClick={() => setGoalForm({ name: s.name, category: s.cat, target: "" })} style={{
              display: "block", width: "100%", textAlign: "left", padding: "10px 12px", marginBottom: 6,
              borderRadius: 10, border: `1px solid ${COLORS.border}`, background: COLORS.bg,
              cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: COLORS.text,
            }}>
              {s.cat === "saúde" ? "❤️" : s.cat === "alimentação" ? "🍎" : s.cat === "exercício" ? "🏃" : "📋"} {s.name}
            </button>
          ))}
        </div>
      </Modal>

      {/* Add Habit Modal */}
      <Modal open={modal === "addHabit"} onClose={() => setModal(null)} title="Novo Hábito Diário">
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>Nome do hábito</label>
          <input style={styles.input} placeholder="Ex: Beber água, Caminhar, Meditar..." value={habitForm.name} onChange={e => setHabitForm({...habitForm, name: e.target.value})} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 8 }}>Ícone</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["💧", "🏃", "🧘", "💊", "🩸", "🥗", "😴", "📝", "🍎", "💪", "🧠", "🫀"].map(icon => (
              <button key={icon} onClick={() => setHabitForm({...habitForm, icon})} style={{
                width: 44, height: 44, borderRadius: 12, fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                background: habitForm.icon === icon ? COLORS.accentLight : COLORS.bg,
                border: `2px solid ${habitForm.icon === icon ? COLORS.accent : COLORS.border}`,
              }}>
                {icon}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 8 }}>Frequência</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["diário", "dias úteis", "3x por semana"].map(t => (
              <button key={t} onClick={() => setHabitForm({...habitForm, target: t})} style={{
                flex: 1, padding: "10px 0", borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                background: habitForm.target === t ? COLORS.accent : COLORS.bg,
                color: habitForm.target === t ? "#fff" : COLORS.textSecondary,
                border: `1.5px solid ${habitForm.target === t ? COLORS.accent : COLORS.border}`,
              }}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => { if (!habitForm.name) return; const habit = { id: uid(), ...habitForm, createdAt: today() }; save({ ...data, habits: [...(data.habits||[]), habit] }); setHabitForm({ name: "", icon: "💧", target: "diário" }); setModal(null); }} style={styles.button("primary")}>
          <Flame size={18} /> Criar Hábito
        </button>
        {/* Suggestions */}
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 8 }}>💡 Sugestões de hábitos:</p>
          {[
            { name: "Beber 2L de água", icon: "💧", target: "diário" },
            { name: "Caminhar 30 minutos", icon: "🏃", target: "diário" },
            { name: "Medir glicemia", icon: "🩸", target: "diário" },
            { name: "Meditar 10 minutos", icon: "🧘", target: "diário" },
            { name: "Comer salada no almoço", icon: "🥗", target: "dias úteis" },
            { name: "Tomar medicação", icon: "💊", target: "diário" },
          ].map(s => (
            <button key={s.name} onClick={() => setHabitForm({ ...s })} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", padding: "10px 12px", marginBottom: 6,
              borderRadius: 10, border: `1px solid ${COLORS.border}`, background: COLORS.bg,
              cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: COLORS.text,
            }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span> {s.name}
            </button>
          ))}
        </div>
      </Modal>

      {/* Travel Modal */}
      <Modal open={modal === "travel"} onClose={() => setModal(null)} title={`✈️ Viagem — Diabetes ${data.user?.diabetesType || "Tipo 1"}`}>
        {/* Tab selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, background: COLORS.bg, borderRadius: 12, padding: 4 }}>
          {[
            { id: "checklist", label: "📋 Checklist", color: "#3B82F6" },
            { id: "emergencia", label: "🚨 Kit Emergência", color: COLORS.danger },
            { id: "dicas", label: "💡 Dicas", color: COLORS.success },
          ].map(t => (
            <button key={t.id} onClick={() => setTravelTab(t.id)} style={{
              flex: 1, padding: "10px 4px", borderRadius: 10, border: "none", cursor: "pointer",
              fontWeight: 700, fontSize: 11, fontFamily: "inherit", transition: "all 0.2s",
              background: travelTab === t.id ? t.color : "transparent",
              color: travelTab === t.id ? "#fff" : COLORS.textSecondary,
            }}>{t.label}</button>
          ))}
        </div>

        {/* CHECKLIST TAB */}
        {travelTab === "checklist" && (() => {
          const isType1 = data.user?.diabetesType === "Tipo 1";
          const baseItems = isType1 ? TRAVEL_CHECKLIST_TYPE1 : TRAVEL_CHECKLIST_TYPE2;
          const customItems = (data.travelCustomItems || []);
          const allItems = [...baseItems, ...customItems];
          const travelChecked = data.travelChecked || {};
          const checkedCount = allItems.filter(i => travelChecked[i.id]).length;
          const categories = [...new Set(allItems.map(i => i.category))];

          return (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: 0 }}>Itens para levar na viagem</p>
                <span style={styles.badge(COLORS.primaryBg, COLORS.primary)}>{checkedCount}/{allItems.length}</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: COLORS.bg, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #3B82F6, #60A5FA)", width: `${allItems.length ? (checkedCount/allItems.length)*100 : 0}%`, transition: "width 0.3s" }} />
              </div>

              {categories.map(cat => (
                <div key={cat} style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: COLORS.primary, margin: "0 0 8px" }}>{cat}</p>
                  {allItems.filter(i => i.category === cat).map(item => (
                    <div key={item.id} onClick={() => {
                      const newChecked = { ...travelChecked, [item.id]: !travelChecked[item.id] };
                      save({ ...data, travelChecked: newChecked });
                    }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer" }}>
                      {travelChecked[item.id] ? <CheckCircle size={20} color={COLORS.success} /> : <Circle size={20} color={COLORS.textLight} />}
                      <span style={{ fontSize: 13, color: travelChecked[item.id] ? COLORS.textLight : COLORS.text, textDecoration: travelChecked[item.id] ? "line-through" : "none", fontWeight: 500 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              ))}

              {/* Add custom item */}
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <input style={{ ...styles.input, flex: 1 }} placeholder="Adicionar item personalizado..." value={travelCustomItem} onChange={e => setTravelCustomItem(e.target.value)} />
                <button onClick={() => {
                  if (!travelCustomItem) return;
                  const item = { id: `custom-${uid()}`, text: travelCustomItem, category: "✏️ Meus itens", done: false };
                  save({ ...data, travelCustomItems: [...(data.travelCustomItems || []), item] });
                  setTravelCustomItem("");
                }} style={{ padding: "0 16px", borderRadius: 12, border: "none", background: COLORS.primary, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 18 }}>+</button>
              </div>

              {/* Reset */}
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button onClick={() => save({ ...data, travelChecked: {} })} style={{ ...styles.button("secondary"), flex: 1 }}>
                  Desmarcar todos
                </button>
                {(data.travelCustomItems || []).length > 0 && (
                  <button onClick={() => save({ ...data, travelCustomItems: [] })} style={{ ...styles.button("ghost"), flex: 1 }}>
                    <Trash2 size={14} /> Limpar personalizados
                  </button>
                )}
              </div>
            </div>
          );
        })()}

        {/* EMERGENCY KIT TAB */}
        {travelTab === "emergencia" && (
          <div>
            <div style={{ ...styles.card, background: COLORS.dangerBg, border: `1px solid ${COLORS.danger}20`, marginBottom: 16, padding: 14 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.danger, margin: "0 0 4px" }}>🚨 Kit de Emergência — Diabetes {data.user?.diabetesType}</p>
              <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: 0 }}>Itens essenciais para ter sempre com você em caso de crise. Monte esse kit e leve em toda viagem.</p>
            </div>
            {(EMERGENCY_KIT[data.user?.diabetesType] || EMERGENCY_KIT["Tipo 1"]).map((item, i) => (
              <div key={i} style={{ ...styles.card, display: "flex", alignItems: "flex-start", gap: 12, padding: 14, marginBottom: 8, borderLeft: `4px solid ${COLORS.danger}` }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: 0 }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: "4px 0 0", lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
            <div style={{ ...styles.card, background: COLORS.warningBg, border: `1px solid ${COLORS.warning}20`, marginTop: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.warning, margin: "0 0 4px" }}>📞 Números de emergência</p>
              <p style={{ fontSize: 13, color: COLORS.text, margin: 0, lineHeight: 1.8 }}>
                🚑 SAMU: 192{"\n"}
                🏥 Bombeiros: 193{"\n"}
                📞 Disque Saúde (SUS): 136{"\n"}
                🆘 Emergência geral: 190
              </p>
            </div>
          </div>
        )}

        {/* TIPS TAB */}
        {travelTab === "dicas" && (
          <div>
            {[
              { emoji: "✈️", title: "No avião", tips: data.user?.diabetesType === "Tipo 1"
                ? "Leve TODA a insulina e insumos na bagagem de mão — nunca despache! O porão do avião pode congelar a insulina. Peça uma declaração médica para passar com seringas e agulhas na segurança do aeroporto. Ajuste os horários de insulina conforme o fuso horário."
                : "Leve todos os medicamentos na bagagem de mão. Mantenha a receita médica junto com os remédios. Levante-se e caminhe pelo corredor a cada 2 horas para melhorar a circulação."
              },
              { emoji: "🚗", title: "De carro", tips: data.user?.diabetesType === "Tipo 1"
                ? "Meça a glicemia antes de dirigir — nunca dirija com glicemia abaixo de 100 mg/dL. Pare a cada 2 horas para medir novamente. Tenha sachês de glicose sempre no porta-luvas. A insulina deve ficar em bolsa térmica, nunca no porta-malas quente."
                : "Meça a glicemia antes de viagens longas. Pare a cada 2-3 horas para se movimentar. Leve lanches saudáveis e água. Tome os medicamentos nos horários habituais."
              },
              { emoji: "🏖️", title: "Na praia / calor", tips: "A insulina e medicamentos não podem ficar expostos ao calor. Use bolsa térmica com isolamento. Proteja os pés com calçados mesmo na areia — diabéticos têm sensibilidade reduzida nos pés. Beba muita água para evitar desidratação, que pode elevar a glicemia." },
              { emoji: "🏔️", title: "No frio / montanha", tips: "O frio intenso também pode afetar a insulina — mantenha-a próxima ao corpo. Em altitudes elevadas, a glicemia pode variar mais. Meça com mais frequência. Use meias grossas e calçados confortáveis para proteger os pés." },
              { emoji: "⏰", title: "Fuso horário", tips: data.user?.diabetesType === "Tipo 1"
                ? "Viajando para LESTE (adiantando relógio): o dia fica mais curto, pode precisar de menos insulina basal. Viajando para OESTE (atrasando relógio): o dia fica mais longo, pode precisar de dose extra. Consulte seu médico antes da viagem para ajustar as doses."
                : "Mantenha os horários dos medicamentos conforme o fuso do destino. Se a diferença for grande (mais de 6h), consulte seu médico antes da viagem para ajustar."
              },
              { emoji: "🍽️", title: "Alimentação em viagem", tips: "Tente manter os horários habituais de refeições. Quando comer fora, aplique a regra do prato (50% vegetais, 25% proteína, 25% carbs). Sempre tenha um lanche de emergência na bolsa. Em restaurantes, não tenha medo de pedir adaptações nos pratos." },
            ].map((tip, i) => (
              <div key={i} style={{ ...styles.card, padding: 14, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 28 }}>{tip.emoji}</span>
                  <p style={{ fontSize: 15, fontWeight: 800, color: COLORS.text, margin: 0 }}>{tip.title}</p>
                </div>
                <p style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.7, margin: 0 }}>{tip.tips}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Report for Doctor Modal */}
      <Modal open={modal === "report"} onClose={() => setModal(null)} title="📋 Relatório para o Médico">
        {(() => {
          const recs = data.glucoseRecords;
          const meds = data.medications || [];
          const diary = data.foodDiary || [];
          const avg = recs.length > 0 ? Math.round(recs.reduce((s,r) => s+r.value, 0) / recs.length) : 0;
          const minG = recs.length > 0 ? Math.min(...recs.map(r => r.value)) : 0;
          const maxG = recs.length > 0 ? Math.max(...recs.map(r => r.value)) : 0;
          const hypoCount = recs.filter(r => r.value < 70).length;
          const hyperCount = recs.filter(r => r.value > 180).length;
          const inRange = recs.filter(r => r.value >= 70 && r.value <= 180).length;
          const inRangePct = recs.length > 0 ? Math.round((inRange/recs.length)*100) : 0;
          const last30 = recs.filter(r => { const d = new Date(); d.setDate(d.getDate()-30); return r.date >= d.toISOString().split("T")[0]; });
          const avg30 = last30.length > 0 ? Math.round(last30.reduce((s,r) => s+r.value, 0) / last30.length) : 0;
          const uniqueMeds = [...new Set(meds.map(m => `${m.name} (${m.dose})`))];

          return (
            <div>
              <div style={{ ...styles.card, background: COLORS.primaryBg, border: `1px solid ${COLORS.primary}20`, padding: 16, marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: 0 }}>Este relatório resume seus dados de saúde registrados no GlicoVida. Mostre ao seu médico na próxima consulta para ele ter uma visão completa do seu controle.</p>
              </div>

              {/* Patient info */}
              <div style={{ ...styles.card, padding: 14, marginBottom: 12 }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: COLORS.primary, margin: "0 0 8px" }}>👤 Dados do Paciente</h4>
                <p style={{ fontSize: 13, color: COLORS.text, margin: 0, lineHeight: 1.8 }}>
                  Nome: {data.user.name}{"\n"}
                  Tipo: Diabetes {data.user.diabetesType}{"\n"}
                  Período de uso: {Math.max(1, Math.ceil((Date.now() - new Date(data.user.createdAt).getTime()) / 86400000))} dias{"\n"}
                  Total de medições: {recs.length}
                </p>
              </div>

              {/* Glucose summary */}
              <div style={{ ...styles.card, padding: 14, marginBottom: 12 }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: COLORS.primary, margin: "0 0 12px" }}>📊 Resumo Glicêmico</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { label: "Média geral", value: `${avg} mg/dL` },
                    { label: "Média últimos 30 dias", value: `${avg30} mg/dL` },
                    { label: "Menor valor", value: `${minG} mg/dL` },
                    { label: "Maior valor", value: `${maxG} mg/dL` },
                    { label: "Tempo no alvo (70-180)", value: `${inRangePct}%` },
                    { label: "Total de medições", value: recs.length },
                    { label: "Episódios de hipo (<70)", value: hypoCount },
                    { label: "Episódios de hiper (>180)", value: hyperCount },
                  ].map(s => (
                    <div key={s.label} style={{ padding: 8, background: COLORS.bg, borderRadius: 8 }}>
                      <p style={{ fontSize: 10, color: COLORS.textSecondary, margin: 0, fontWeight: 600 }}>{s.label}</p>
                      <p style={{ fontSize: 16, fontWeight: 800, color: COLORS.primary, margin: "2px 0 0" }}>{s.value || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medications */}
              <div style={{ ...styles.card, padding: 14, marginBottom: 12 }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: COLORS.primary, margin: "0 0 8px" }}>💊 Medicações em Uso</h4>
                {uniqueMeds.length > 0 ? uniqueMeds.map((m, i) => (
                  <p key={i} style={{ fontSize: 13, color: COLORS.text, margin: "4px 0", padding: "6px 10px", background: COLORS.bg, borderRadius: 8 }}>• {m}</p>
                )) : (
                  <p style={{ fontSize: 13, color: COLORS.textLight, margin: 0 }}>Nenhuma medicação registrada</p>
                )}
              </div>

              {/* Last 10 records */}
              <div style={{ ...styles.card, padding: 14, marginBottom: 12 }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: COLORS.primary, margin: "0 0 8px" }}>🩸 Últimas 10 Medições</h4>
                {recs.length > 0 ? [...recs].reverse().slice(0, 10).map(r => (
                  <div key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 12 }}>
                    <span style={{ color: COLORS.textSecondary }}>{formatDate(r.date)} {formatTime(r.time)}</span>
                    <span style={{ fontWeight: 700, color: getGlucoseStatus(r.value).color }}>{r.value} mg/dL ({r.context})</span>
                  </div>
                )) : <p style={{ fontSize: 13, color: COLORS.textLight }}>Sem registros</p>}
              </div>

              <div style={{ ...styles.card, background: COLORS.warningBg, border: `1px solid ${COLORS.warning}20`, padding: 14 }}>
                <p style={{ fontSize: 12, color: COLORS.warning, fontWeight: 700, margin: "0 0 4px" }}>⚠️ Aviso importante</p>
                <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: 0, lineHeight: 1.5 }}>Este relatório é gerado automaticamente com base nos dados inseridos pelo usuário. Não substitui exames laboratoriais. Consulte sempre seu médico para decisões sobre o tratamento.</p>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Insulin Dose Calculator Modal */}
      <Modal open={modal === "insulinCalc"} onClose={() => setModal(null)} title="💉 Calculadora de Dose de Insulina">
        <div style={{ ...styles.card, background: COLORS.warningBg, border: `1px solid ${COLORS.warning}20`, padding: 14, marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: COLORS.warning, fontWeight: 700, margin: "0 0 4px" }}>⚠️ Aviso importante</p>
          <p style={{ fontSize: 11, color: COLORS.textSecondary, margin: 0, lineHeight: 1.5 }}>Esta calculadora é apenas uma ESTIMATIVA para auxiliar. A dose final deve sempre ser validada pelo seu médico. Nunca altere sua dose sem orientação médica.</p>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>Glicemia atual (mg/dL)</label>
          <input style={styles.input} type="number" placeholder="Ex: 200" value={insulinCalc.currentGlucose} onChange={e => setInsulinCalc({...insulinCalc, currentGlucose: e.target.value})} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>Glicemia alvo (mg/dL)</label>
          <input style={styles.input} type="number" placeholder="120" value={insulinCalc.targetGlucose} onChange={e => setInsulinCalc({...insulinCalc, targetGlucose: e.target.value})} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>Carboidratos da refeição (g)</label>
          <input style={styles.input} type="number" placeholder="Ex: 45" value={insulinCalc.carbsEaten} onChange={e => setInsulinCalc({...insulinCalc, carbsEaten: e.target.value})} />
          <p style={{ fontSize: 11, color: COLORS.textLight, marginTop: 4 }}>💡 Use a calculadora de carboidratos para saber esse valor</p>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>Fator de sensibilidade / correção</label>
          <input style={styles.input} type="number" placeholder="Ex: 50" value={insulinCalc.correctionFactor} onChange={e => setInsulinCalc({...insulinCalc, correctionFactor: e.target.value})} />
          <p style={{ fontSize: 11, color: COLORS.textLight, marginTop: 4 }}>Quantos mg/dL 1 unidade de insulina reduz (pergunte ao seu médico)</p>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>Relação insulina/carboidrato (I:C)</label>
          <input style={styles.input} type="number" placeholder="Ex: 15" value={insulinCalc.icRatio} onChange={e => setInsulinCalc({...insulinCalc, icRatio: e.target.value})} />
          <p style={{ fontSize: 11, color: COLORS.textLight, marginTop: 4 }}>1 unidade de insulina cobre quantos gramas de carb (pergunte ao seu médico)</p>
        </div>

        {/* Result */}
        {(() => {
          const cg = parseFloat(insulinCalc.currentGlucose);
          const tg = parseFloat(insulinCalc.targetGlucose) || 120;
          const carbs = parseFloat(insulinCalc.carbsEaten) || 0;
          const cf = parseFloat(insulinCalc.correctionFactor) || 50;
          const ic = parseFloat(insulinCalc.icRatio) || 15;
          if (!cg) return null;
          const correctionDose = Math.max(0, (cg - tg) / cf);
          const carbDose = carbs / ic;
          const totalDose = correctionDose + carbDose;
          return (
            <div style={{ ...styles.card, background: `linear-gradient(135deg, #F5F3FF, #EDE9FE)`, border: `1px solid #8B5CF620`, padding: 16 }}>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: "#8B5CF6", margin: "0 0 12px", textAlign: "center" }}>Resultado Estimado</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                <div style={{ textAlign: "center", padding: 10, background: "#fff", borderRadius: 10 }}>
                  <p style={{ fontSize: 10, color: COLORS.textSecondary, margin: 0, fontWeight: 600 }}>Correção</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: COLORS.accent, margin: "2px 0 0" }}>{correctionDose.toFixed(1)}</p>
                  <p style={{ fontSize: 9, color: COLORS.textLight, margin: 0 }}>unidades</p>
                </div>
                <div style={{ textAlign: "center", padding: 10, background: "#fff", borderRadius: 10 }}>
                  <p style={{ fontSize: 10, color: COLORS.textSecondary, margin: 0, fontWeight: 600 }}>Refeição</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: COLORS.primary, margin: "2px 0 0" }}>{carbDose.toFixed(1)}</p>
                  <p style={{ fontSize: 9, color: COLORS.textLight, margin: 0 }}>unidades</p>
                </div>
                <div style={{ textAlign: "center", padding: 10, background: "#fff", borderRadius: 10, border: `2px solid #8B5CF630` }}>
                  <p style={{ fontSize: 10, color: COLORS.textSecondary, margin: 0, fontWeight: 600 }}>Total</p>
                  <p style={{ fontSize: 24, fontWeight: 800, color: "#8B5CF6", margin: "2px 0 0" }}>{Math.round(totalDose * 2) / 2}</p>
                  <p style={{ fontSize: 9, color: COLORS.textLight, margin: 0 }}>unidades</p>
                </div>
              </div>
              <p style={{ fontSize: 11, color: COLORS.textSecondary, textAlign: "center", margin: 0, lineHeight: 1.5 }}>
                ⚠️ Este cálculo é apenas uma estimativa. Valide sempre com seu médico antes de aplicar.
              </p>
            </div>
          );
        })()}
      </Modal>

      {/* Admin Login Modal */}
      <Modal open={modal === "adminLogin"} onClose={() => setModal(null)} title="🔒 Acesso Administrativo">
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <Shield size={32} color="#8B5CF6" />
          </div>
          <p style={{ fontSize: 14, color: COLORS.textSecondary, margin: 0 }}>Esta área é exclusiva para o administrador. Digite a senha para acessar.</p>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>Senha do administrador</label>
          <input style={styles.input} type="password" placeholder="Digite a senha..." value={adminPassword} onChange={e => { setAdminPassword(e.target.value); setAdminError(""); }} onKeyDown={e => {
            if (e.key === "Enter") {
              if (adminPassword === ADMIN_PASS) { setAdminUnlocked(true); setModal("admin"); setAdminError(""); }
              else setAdminError("Senha incorreta. Tente novamente.");
            }
          }} autoFocus />
        </div>
        {adminError && <p style={{ color: COLORS.danger, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>❌ {adminError}</p>}
        <button onClick={() => {
          if (adminPassword === ADMIN_PASS) { setAdminUnlocked(true); setModal("admin"); setAdminError(""); }
          else setAdminError("Senha incorreta. Tente novamente.");
        }} style={styles.button("primary")}>
          <Lock size={18} /> Acessar Painel
        </button>
      </Modal>

      {/* Admin Panel Modal */}
      <Modal open={modal === "admin"} onClose={() => setModal(null)} title="📊 Painel Administrativo">
        {(() => {
          const recs = data.glucoseRecords;
          const diary = data.foodDiary || [];
          const meds = data.medications || [];
          const goals = data.goals || [];
          const habits = data.habits || [];
          const daysUsing = Math.max(1, Math.ceil((Date.now() - new Date(data.user.createdAt).getTime()) / 86400000));

          // Usage by feature
          const features = [
            { name: "Glicemia", count: recs.length, icon: "💧", color: COLORS.primary },
            { name: "Diário Alimentar", count: diary.length, icon: "🍽️", color: COLORS.success },
            { name: "Medicações", count: meds.length, icon: "💊", color: "#8B5CF6" },
            { name: "Metas criadas", count: goals.length, icon: "🎯", color: COLORS.accent },
            { name: "Metas concluídas", count: goals.filter(g => g.done).length, icon: "✅", color: COLORS.success },
            { name: "Hábitos criados", count: habits.length, icon: "🔥", color: COLORS.accent },
            { name: "Itens planejados", count: Object.keys(data.mealPlan || {}).length, icon: "📅", color: COLORS.primary },
            { name: "Checklist usado", count: Object.keys(data.checklist || {}).length, icon: "📋", color: COLORS.warning },
          ];

          // Days with activity
          const uniqueDates = new Set([
            ...recs.map(r => r.date),
            ...diary.map(d => d.date),
            ...meds.map(m => m.date),
          ]);
          const activeDays = uniqueDates.size;
          const engagementRate = daysUsing > 0 ? Math.round((activeDays / daysUsing) * 100) : 0;

          // Glucose by context
          const contexts = {};
          recs.forEach(r => { contexts[r.context] = (contexts[r.context] || 0) + 1; });

          // Most logged meal
          const mealCounts = {};
          diary.forEach(d => { mealCounts[d.meal] = (mealCounts[d.meal] || 0) + 1; });
          const topMeal = Object.entries(mealCounts).sort((a,b) => b[1] - a[1])[0];

          return (
            <div>
              <div style={{ ...styles.card, background: `linear-gradient(135deg, #F5F3FF, #EDE9FE)`, border: `1px solid #8B5CF620`, padding: 16, marginBottom: 16 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#8B5CF6", margin: "0 0 4px" }}>🔒 Área exclusiva do administrador</p>
                <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: 0 }}>Métricas de uso e engajamento do usuário com o app.</p>
              </div>

              {/* Engagement metrics */}
              <h4 style={{ fontSize: 14, fontWeight: 800, color: COLORS.text, margin: "0 0 12px" }}>📈 Métricas de Engajamento</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                <div style={{ ...styles.card, textAlign: "center", padding: 12, marginBottom: 0, background: COLORS.primaryBg }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: COLORS.primary, margin: 0 }}>{daysUsing}</p>
                  <p style={{ fontSize: 10, color: COLORS.textSecondary, margin: 0, fontWeight: 600 }}>Dias no app</p>
                </div>
                <div style={{ ...styles.card, textAlign: "center", padding: 12, marginBottom: 0, background: COLORS.successBg }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: COLORS.success, margin: 0 }}>{activeDays}</p>
                  <p style={{ fontSize: 10, color: COLORS.textSecondary, margin: 0, fontWeight: 600 }}>Dias ativos</p>
                </div>
                <div style={{ ...styles.card, textAlign: "center", padding: 12, marginBottom: 0, background: COLORS.accentLight }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: COLORS.accent, margin: 0 }}>{engagementRate}%</p>
                  <p style={{ fontSize: 10, color: COLORS.textSecondary, margin: 0, fontWeight: 600 }}>Engajamento</p>
                </div>
              </div>

              {/* Feature usage */}
              <h4 style={{ fontSize: 14, fontWeight: 800, color: COLORS.text, margin: "0 0 12px" }}>🔧 Uso por Funcionalidade</h4>
              {features.map(f => (
                <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ fontSize: 20 }}>{f.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, margin: 0 }}>{f.name}</p>
                    <div style={{ height: 6, borderRadius: 3, background: COLORS.bg, marginTop: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 3, background: f.color, width: `${Math.min(100, (f.count / Math.max(1, ...features.map(x => x.count))) * 100)}%`, transition: "width 0.5s" }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: f.color, minWidth: 30, textAlign: "right" }}>{f.count}</span>
                </div>
              ))}

              {/* Context distribution */}
              {Object.keys(contexts).length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, color: COLORS.text, margin: "0 0 12px" }}>⏰ Medições por Contexto</h4>
                  {Object.entries(contexts).sort((a,b) => b[1] - a[1]).map(([ctx, count]) => (
                    <div key={ctx} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: COLORS.bg, borderRadius: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: COLORS.text, textTransform: "capitalize" }}>{ctx}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.primary }}>{count}x</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Insights for admin */}
              <div style={{ marginTop: 16 }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: COLORS.text, margin: "0 0 12px" }}>💡 Observações</h4>
                <div style={{ ...styles.card, background: COLORS.bg, padding: 14 }}>
                  {recs.length === 0 && <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: "0 0 6px" }}>• Usuário ainda não registrou glicemias</p>}
                  {recs.length > 0 && recs.length < 10 && <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: "0 0 6px" }}>• Poucos registros de glicemia ({recs.length}) — engajamento inicial</p>}
                  {recs.length >= 10 && <p style={{ fontSize: 13, color: COLORS.success, margin: "0 0 6px" }}>• Bom volume de registros de glicemia ({recs.length}) ✓</p>}
                  {diary.length === 0 && <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: "0 0 6px" }}>• Diário alimentar não utilizado ainda</p>}
                  {diary.length > 0 && <p style={{ fontSize: 13, color: COLORS.success, margin: "0 0 6px" }}>• Diário alimentar ativo ({diary.length} registros) ✓{topMeal ? ` — refeição mais registrada: ${topMeal[0]}` : ""}</p>}
                  {engagementRate >= 70 && <p style={{ fontSize: 13, color: COLORS.success, margin: "0 0 6px" }}>• Engajamento excelente ({engagementRate}%) ✓</p>}
                  {engagementRate < 70 && engagementRate > 30 && <p style={{ fontSize: 13, color: COLORS.warning, margin: "0 0 6px" }}>• Engajamento moderado ({engagementRate}%) — pode melhorar</p>}
                  {engagementRate <= 30 && daysUsing > 3 && <p style={{ fontSize: 13, color: COLORS.danger, margin: "0 0 6px" }}>• Engajamento baixo ({engagementRate}%) — atenção</p>}
                  {habits.length === 0 && <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: "0 0 6px" }}>• Nenhum hábito criado ainda</p>}
                  {habits.length > 0 && <p style={{ fontSize: 13, color: COLORS.success, margin: "0 0 6px" }}>• {habits.length} hábito(s) ativo(s) ✓</p>}
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Emotional Diary Modal */}
      <Modal open={modal === "emotionalDiary"} onClose={() => setModal(null)} title="😊 Como você está se sentindo?">
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 10 }}>Selecione seu humor:</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
            {MOOD_OPTIONS.map(m => (
              <button key={m.label} onClick={() => setMoodForm({...moodForm, mood: m.label})} style={{
                padding: 12, borderRadius: 14, cursor: "pointer", textAlign: "center", transition: "all 0.2s",
                background: moodForm.mood === m.label ? `${m.color}15` : COLORS.bg,
                border: `2px solid ${moodForm.mood === m.label ? m.color : COLORS.border}`,
              }}>
                <span style={{ fontSize: 28, display: "block" }}>{m.emoji}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: moodForm.mood === m.label ? m.color : COLORS.textSecondary, marginTop: 4, display: "block" }}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, display: "block", marginBottom: 6 }}>O que está influenciando seu humor? (opcional)</label>
          <input style={styles.input} placeholder="Ex: dormi mal, estresse no trabalho, dia bom..." value={moodForm.notes} onChange={e => setMoodForm({...moodForm, notes: e.target.value})} />
        </div>
        <button onClick={addEmotionalEntry} style={styles.button("primary")}>
          <Heart size={18} /> Registrar Humor
        </button>

        {/* Mood history */}
        {(data.emotionalDiary || []).length > 0 && (
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 8 }}>Registros recentes:</p>
            {[...(data.emotionalDiary || [])].reverse().slice(0, 7).map(e => {
              const moodObj = MOOD_OPTIONS.find(m => m.label === e.mood) || { emoji: "😐", color: COLORS.textSecondary };
              return (
                <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ fontSize: 22 }}>{moodObj.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, margin: 0 }}>{e.mood}</p>
                    {e.notes && <p style={{ fontSize: 11, color: COLORS.textLight, margin: "2px 0 0" }}>{e.notes}</p>}
                  </div>
                  <span style={{ fontSize: 11, color: COLORS.textLight }}>{formatDate(e.date)}</span>
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      {/* Full Glossary Modal */}
      <Modal open={modal === "glossary"} onClose={() => setModal(null)} title="📖 Glossário Médico Completo">
        <p style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 16 }}>{GLOSSARY_DATA.length} termos explicados de forma simples:</p>
        {GLOSSARY_DATA.map((g, i) => (
          <div key={i} style={{ ...styles.card, padding: 0, overflow: "hidden", marginBottom: 6, cursor: "pointer" }} onClick={() => setExpandedArticle(expandedArticle === `gfull-${i}` ? null : `gfull-${i}`)}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.primary, margin: 0, flex: 1 }}>{g.term}</p>
              {expandedArticle === `gfull-${i}` ? <ChevronUp size={14} color={COLORS.textLight} /> : <ChevronDown size={14} color={COLORS.textLight} />}
            </div>
            {expandedArticle === `gfull-${i}` && (
              <div style={{ padding: "0 12px 12px", borderTop: `1px solid ${COLORS.border}` }}>
                <p style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6, margin: "8px 0 0" }}>{g.def}</p>
              </div>
            )}
          </div>
        ))}
      </Modal>

      {/* All Substitutions Modal */}
      <Modal open={modal === "allSubstitutions"} onClose={() => setModal(null)} title="🔄 Substituições Inteligentes">
        <p style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 16 }}>Troque alimentos de alto IG por opções mais saudáveis:</p>
        {SUBSTITUTIONS_DATA.map((sub, i) => (
          <div key={i} style={{ ...styles.card, padding: 14, marginBottom: 10, borderLeft: `4px solid ${COLORS.success}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.danger, textDecoration: "line-through" }}>{sub.original}</span>
              <span style={{ fontSize: 16 }}>→</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.success }}>{sub.substitute}</span>
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <span style={styles.badge(COLORS.successBg, COLORS.success)}>IG: {sub.igChange}</span>
              <span style={styles.badge(COLORS.primaryBg, COLORS.primary)}>Economia: ~{sub.carbsSaved} carbs</span>
            </div>
            <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: 0, lineHeight: 1.5 }}>💡 {sub.tip}</p>
          </div>
        ))}
      </Modal>
    </>
  );

  // ==================== RENDER ====================
  const renderTab = () => {
    switch(tab) {
      case "home": return renderHome();
      case "glucose": return renderGlucose();
      case "food": return renderFood();
      case "routine": return renderRoutine();
      case "learn": return renderLearn();
      case "profile": return renderProfile();
      default: return renderHome();
    }
  };

  return (
    <div style={{...styles.app, background: DM.bg, transition: "background 0.3s"}}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        body { margin: 0; background: ${DM.bg}; transition: background 0.3s; }
        input:focus { border-color: ${COLORS.primary} !important; }
        input, textarea { background: ${darkMode ? "#0F172A" : "#FAFBFC"} !important; color: ${DM.text} !important; border-color: ${DM.border} !important; }
        button:active { transform: scale(0.97); }
        ::-webkit-scrollbar { width: 0; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes confettiFall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
        @keyframes confettiSway {
          0%, 100% { margin-left: 0; }
          25% { margin-left: 15px; }
          75% { margin-left: -15px; }
        }
        ${darkMode ? `
        div[style*="background: #FFFFFF"], div[style*="background: rgb(255, 255, 255)"] { background: #1E293B !important; }
        ` : ""}
      `}</style>
      {darkMode && <style>{`
        body { background: #0F172A !important; }
        .dm-on { background: #0F172A !important; color: #E2E8F0 !important; }
        .dm-on p, .dm-on span, .dm-on h1, .dm-on h2, .dm-on h3, .dm-on h4, .dm-on label, .dm-on a { color: #CBD5E1 !important; }
        .dm-on input, .dm-on textarea { background: #1E293B !important; color: #E2E8F0 !important; border-color: #475569 !important; }
        .dm-on input::placeholder, .dm-on textarea::placeholder { color: #64748B !important; }
        .dm-on button { color: #CBD5E1 !important; }
        .dm-on button[style*="linear-gradient"] { color: #fff !important; }

        /* Card backgrounds */
        .dm-on div[style*="background: rgb(255, 255, 255)"] { background: #1E293B !important; border-color: #334155 !important; }
        .dm-on div[style*="background: rgb(248, 250, 251)"] { background: #0F172A !important; }
        .dm-on div[style*="background: rgb(250, 251, 252)"] { background: #1E293B !important; }
        
        /* Borders */
        .dm-on div[style*="border: 1px solid rgb(226, 232, 240)"] { border-color: #334155 !important; }
        .dm-on div[style*="border-bottom: 1px solid rgb(226, 232, 240)"] { border-color: #334155 !important; }
        .dm-on div[style*="border-top: 1px solid rgb(226, 232, 240)"] { border-color: #334155 !important; }

        /* Modal background */
        .dm-on div[style*="background: rgba(0, 0, 0, 0.4)"] + div div[style*="background: rgb(255, 255, 255)"] { background: #1E293B !important; }
      `}</style>}
      <div className={darkMode ? "dm-on" : ""} style={{...styles.content, background: DM.bg, filter: darkMode ? "none" : "none"}}>
        {renderTab()}
      </div>

      {/* Tab Bar */}
      <div style={{...styles.tabBar, background: DM.card, borderTop: `1px solid ${DM.border}`}}>
        {TABS.map(t => (
          <button key={t.id} style={{...styles.tab(tab === t.id), color: tab === t.id ? COLORS.primary : darkMode ? "#64748B" : COLORS.textLight}} onClick={() => setTab(t.id)}>
            {tab === t.id && <div style={styles.tabIndicator} />}
            <t.icon size={20} strokeWidth={tab === t.id ? 2.5 : 1.8} />
            <span style={{ fontSize: 10, fontWeight: tab === t.id ? 800 : 600 }}>{t.label}</span>
          </button>
        ))}
      </div>

      {renderModals()}

      {/* Confetti Animation */}
      {showConfetti && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999, overflow: "hidden" }}>
          {Array.from({ length: 50 }).map((_, i) => {
            const colors = ["#F97316", "#10B981", "#3B82F6", "#EF4444", "#8B5CF6", "#F59E0B", "#EC4899", "#14B8A6", "#FFD700", "#FF6B6B"];
            const shapes = ["●", "■", "▲", "★", "♦", "◆"];
            const color = colors[i % colors.length];
            const shape = shapes[i % shapes.length];
            const left = Math.random() * 100;
            const delay = Math.random() * 2;
            const duration = 2 + Math.random() * 2;
            const size = 8 + Math.random() * 12;
            return (
              <div key={i} style={{
                position: "absolute", left: `${left}%`, top: -20,
                fontSize: size, color: color, fontWeight: 900,
                animation: `confettiFall ${duration}s ${delay}s ease-in forwards, confettiSway ${duration * 0.5}s ${delay}s ease-in-out infinite`,
                opacity: 0,
              }}>
                {shape}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
