export const STORAGE_KEY = "bingoAlgebrico.v1";
export const TOAST_DURATION_MS = 2200;
export const EXPORT_VERSIONS = { DADOS: 2, CONFIGURACAO: 1 };
export const EXPORT_TYPES = { DADOS: "dados", CONFIGURACAO: "configuracao" };

export const DEFAULT_DATA_FILES = [
    "src/data/fracoes_soma.json",
    "src/data/fracoes_subtracao.json",
    "src/data/fracoes_multiplicacao.json",
    "src/data/fracoes_divisao.json"
];

export const DEFAULT_VISUAL_THEME = {
    nomeBingo: "BINGO ALGÉBRICO",
    nomeInstituicao: "",
    corPrimaria: "#03233e",
    corDestaque: "#64b0f2",
    corFundo: "#f3f4fa"
};

export const RESPONSE_FORMULA_BY_EQUATION = {
    "Soma de Frações": "(A*D + B*C)/(B*D)",
    "Subtração de Frações": "(A*D - B*C)/(B*D)",
    "Multiplicação de Frações": "(A*C)/(B*D)",
    "Divisão de Frações": "(A*D)/(B*C)"
};

export const FLOW_STEPS = [
    {
        screen: "topicos",
        title: "Selecionar tópicos",
        description: "Escolha os conteúdos que entrarão no bingo e monte a base da atividade."
    },
    {
        screen: "equacoes",
        title: "Selecionar equações",
        description: "Associe modelos de equação aos tópicos já escolhidos e mantenha apenas os formatos necessários."
    },
    {
        screen: "restricoes",
        title: "Definir restrições",
        description: "Controle intervalos e tipos de valores para cada variável antes da geração automática das questões."
    },
    {
        screen: "bingo",
        title: "Configurar distribuição",
        description: "Ajuste quantidades de questões, cartelas e repetições com combinações válidas."
    },
    {
        screen: "questoes",
        title: "Gerar questões",
        description: "Crie o conjunto de questões que alimentará as cartelas do bingo."
    },
    {
        screen: "visual",
        title: "Visual",
        description: "Personalize o tema visual do bingo antes de gerar as cartelas."
    },
    {
        screen: "cartelas",
        title: "Gerar cartelas",
        description: "Monte cartelas nas versões professor e aluno com base nas questões geradas."
    },
    {
        screen: "persistencia",
        title: "Persistência",
        description: "Exporte os tópicos, equações e restrições criados para reutilizá-los depois, ou importe uma configuração anterior."
    }
];
