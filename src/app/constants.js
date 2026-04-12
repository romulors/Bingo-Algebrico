export const STORAGE_KEY = "bingoAlgebrico.v1";
export const TOAST_DURATION_MS = 2200;
export const EXPORT_VERSIONS = { DADOS: 2, CONFIGURACAO: 1 };
export const EXPORT_TYPES = { DADOS: "dados", CONFIGURACAO: "configuracao" };

export const DEFAULT_DATA_FILES = [
    "src/data/fracoes_soma.json",
    "src/data/fracoes_subtracao.json",
    "src/data/fracoes_multiplicacao.json",
    "src/data/fracoes_divisao.json",
    "src/data/potencia_quadrado.json",
    "src/data/potencia_cubo.json",
    "src/data/porcentagem_valor.json",
    "src/data/porcentagem_acrescimo.json",
    "src/data/equacao_1grau.json",
    "src/data/equacao_2grau_discriminante.json",
    "src/data/pa_termo_geral.json",
    "src/data/pa_soma.json",
    "src/data/pg_termo_geral.json",
    "src/data/pg_soma.json",
    "src/data/juros_simples.json",
    "src/data/juros_montante_simples.json",
    "src/data/juros_compostos.json",
    "src/data/area_quadrado.json",
    "src/data/area_retangulo.json",
    "src/data/area_triangulo.json",
    "src/data/area_trapezio.json",
    "src/data/area_losango.json",
    "src/data/area_circulo.json",
    "src/data/perimetro_quadrado.json",
    "src/data/perimetro_retangulo.json",
    "src/data/comprimento_circunferencia.json",
    "src/data/volume_cubo.json",
    "src/data/volume_paralelepipedo.json",
    "src/data/volume_piramide.json",
    "src/data/volume_cilindro.json",
    "src/data/volume_cone.json",
    "src/data/volume_esfera.json",
    "src/data/media_2valores.json",
    "src/data/media_3valores.json",
    "src/data/media_ponderada.json",
    "src/data/operacoes_soma.json",
    "src/data/operacoes_subtracao.json",
    "src/data/operacoes_multiplicacao.json",
    "src/data/operacoes_divisao.json",
    "src/data/raiz_quadrada.json",
    "src/data/raiz_cubica.json",
    "src/data/trig_seno.json",
    "src/data/trig_cosseno.json",
    "src/data/trig_tangente.json",
    "src/data/pitagoras.json",
    "src/data/funcao_linear.json",
    "src/data/funcao_quadratica.json",
    "src/data/funcao_exponencial.json",
    "src/data/fatorial.json",
    "src/data/arranjo_simples.json",
    "src/data/combinacao_simples.json"
];

export const DEFAULT_VISUAL_THEME = {
    nomeBingo: "BINGO ALGÉBRICO",
    nomeInstituicao: "",
    corPrimaria: "#03233e",
    corDestaque: "#64b0f2",
    corFundo: "#f3f4fa"
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
