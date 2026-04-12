import { createPresetCard } from "../ui/preset-card/preset-card.js";
import { BingoParams } from "../../app/models/BingoParams.js";

// ─── Definição dos presets ────────────────────────────────────────────────────────
//
// equations: array de nomes de equações a selecionar (match por eq.name)
// restrictions: { "NomeEquação": { "VAR": { min, max, tipo } } }
// bingoParams: sobrescreve os parâmetros do bingo
// customSelection: true = não altera estado, apenas marca como ativo

const PRESETS = [
    {
        id: "fracoes-completo",
        title: "Bingo das Frações",
        description: "Todas as operações com frações: soma, subtração, multiplicação e divisão.",
        icon: "fa-divide",
        equations: ["Soma de Frações", "Subtração de Frações", "Multiplicação de Frações", "Divisão de Frações"],
        restrictions: {
            "Soma de Frações":         { A: { min: 1, max: 9, tipo: "inteiro" }, B: { min: 2, max: 10, tipo: "inteiro" }, C: { min: 1, max: 9, tipo: "inteiro" }, D: { min: 2, max: 10, tipo: "inteiro" } },
            "Subtração de Frações":    { A: { min: 1, max: 9, tipo: "inteiro" }, B: { min: 2, max: 10, tipo: "inteiro" }, C: { min: 1, max: 9, tipo: "inteiro" }, D: { min: 2, max: 10, tipo: "inteiro" } },
            "Multiplicação de Frações":{ A: { min: 1, max: 9, tipo: "inteiro" }, B: { min: 2, max: 10, tipo: "inteiro" }, C: { min: 1, max: 9, tipo: "inteiro" }, D: { min: 2, max: 10, tipo: "inteiro" } },
            "Divisão de Frações":      { A: { min: 1, max: 9, tipo: "inteiro" }, B: { min: 2, max: 10, tipo: "inteiro" }, C: { min: 1, max: 9, tipo: "inteiro" }, D: { min: 2, max: 10, tipo: "inteiro" } }
        },
        bingoParams: { numQuestoesUnicas: 30, numCartelas: 10, numQuestoesPorCartela: 6, minRepeticoes: 1, maxRepeticoes: 3 }
    },
    {
        id: "fracoes-soma",
        title: "Bingo da Soma de Frações",
        description: "Focado na operação de soma de frações com denominadores variados.",
        icon: "fa-plus",
        equations: ["Soma de Frações"],
        restrictions: {
            "Soma de Frações": { A: { min: 1, max: 9, tipo: "inteiro" }, B: { min: 2, max: 12, tipo: "inteiro" }, C: { min: 1, max: 9, tipo: "inteiro" }, D: { min: 2, max: 12, tipo: "inteiro" } }
        },
        bingoParams: { numQuestoesUnicas: 20, numCartelas: 8, numQuestoesPorCartela: 5, minRepeticoes: 1, maxRepeticoes: 3 }
    },
    {
        id: "fracoes-subtracao",
        title: "Bingo da Subtração de Frações",
        description: "Focado na operação de subtração de frações, incluindo resultados negativos.",
        icon: "fa-minus",
        equations: ["Subtração de Frações"],
        restrictions: {
            "Subtração de Frações": { A: { min: 1, max: 9, tipo: "inteiro" }, B: { min: 2, max: 12, tipo: "inteiro" }, C: { min: 1, max: 9, tipo: "inteiro" }, D: { min: 2, max: 12, tipo: "inteiro" } }
        },
        bingoParams: { numQuestoesUnicas: 20, numCartelas: 8, numQuestoesPorCartela: 5, minRepeticoes: 1, maxRepeticoes: 3 }
    },
    {
        id: "fracoes-multiplicacao-divisao",
        title: "Multiplicação e Divisão de Frações",
        description: "Combina as operações de multiplicação e divisão de frações.",
        icon: "fa-xmark",
        equations: ["Multiplicação de Frações", "Divisão de Frações"],
        restrictions: {
            "Multiplicação de Frações": { A: { min: 1, max: 9, tipo: "inteiro" }, B: { min: 2, max: 10, tipo: "inteiro" }, C: { min: 1, max: 9, tipo: "inteiro" }, D: { min: 2, max: 10, tipo: "inteiro" } },
            "Divisão de Frações":       { A: { min: 1, max: 9, tipo: "inteiro" }, B: { min: 2, max: 10, tipo: "inteiro" }, C: { min: 1, max: 9, tipo: "inteiro" }, D: { min: 2, max: 10, tipo: "inteiro" } }
        },
        bingoParams: { numQuestoesUnicas: 24, numCartelas: 8, numQuestoesPorCartela: 6, minRepeticoes: 1, maxRepeticoes: 3 }
    },
    {
        id: "operacoes-basicas",
        title: "Bingo das Operações Básicas",
        description: "Operações básicas com números inteiros: soma, subtração, multiplicação e divisão.",
        icon: "fa-calculator",
        equations: ["Soma", "Subtração", "Multiplicação", "Divisão"],
        restrictions: {
            "Soma":         { A: { min: 1, max: 15, tipo: "inteiro" }, B: { min: 1, max: 15, tipo: "inteiro" } },
            "Subtração":    { A: { min: 1, max: 15, tipo: "inteiro" }, B: { min: 1, max: 15, tipo: "inteiro" } },
            "Multiplicação":{ A: { min: 1, max: 12, tipo: "inteiro" }, B: { min: 1, max: 12, tipo: "inteiro" } },
            "Divisão":      { A: { min: 1, max: 15, tipo: "inteiro" }, B: { min: 1, max: 10, tipo: "inteiro" } }
        },
        bingoParams: { numQuestoesUnicas: 24, numCartelas: 8, numQuestoesPorCartela: 5, minRepeticoes: 1, maxRepeticoes: 3 }
    },
    // ─── Presets BNCC por faixa educacional ───────────────────────────────────────
    {
        id: "bncc-ef-anos-iniciais",
        title: "BNCC – EF Anos Iniciais (1°–5°)",
        description: "Operações aritméticas e geometria básica alinhados à BNCC do Ensino Fundamental – Anos Iniciais.",
        icon: "fa-child",
        equations: ["Soma", "Subtração", "Multiplicação", "Divisão", "Perímetro do Quadrado", "Perímetro do Retângulo"],
        restrictions: {
            "Soma":                  { A: { min: 1, max: 20, tipo: "inteiro" }, B: { min: 1, max: 20, tipo: "inteiro" } },
            "Subtração":             { A: { min: 1, max: 20, tipo: "inteiro" }, B: { min: 1, max: 20, tipo: "inteiro" } },
            "Multiplicação":         { A: { min: 1, max: 10, tipo: "inteiro" }, B: { min: 1, max: 10, tipo: "inteiro" } },
            "Divisão":               { A: { min: 1, max: 20, tipo: "inteiro" }, B: { min: 1, max: 10, tipo: "inteiro" } },
            "Perímetro do Quadrado": { A: { min: 1, max: 15, tipo: "inteiro" } },
            "Perímetro do Retângulo":{ A: { min: 1, max: 15, tipo: "inteiro" }, B: { min: 1, max: 15, tipo: "inteiro" } }
        },
        bingoParams: { numQuestoesUnicas: 24, numCartelas: 10, numQuestoesPorCartela: 5, minRepeticoes: 1, maxRepeticoes: 3 }
    },
    {
        id: "bncc-ef-6",
        title: "BNCC – EF 6° Ano",
        description: "Frações, potenciação, áreas básicas e média conforme a BNCC do EF 6° ano.",
        icon: "fa-divide",
        equations: [
            "Soma de Frações", "Subtração de Frações", "Multiplicação de Frações", "Divisão de Frações",
            "Quadrado de um Número", "Cubo de um Número",
            "Área do Quadrado", "Área do Retângulo", "Área do Triângulo",
            "Média de Dois Valores"
        ],
        restrictions: {
            "Soma de Frações":          { A: { min: 1, max: 9, tipo: "inteiro" }, B: { min: 2, max: 10, tipo: "inteiro" }, C: { min: 1, max: 9, tipo: "inteiro" }, D: { min: 2, max: 10, tipo: "inteiro" } },
            "Subtração de Frações":     { A: { min: 1, max: 9, tipo: "inteiro" }, B: { min: 2, max: 10, tipo: "inteiro" }, C: { min: 1, max: 9, tipo: "inteiro" }, D: { min: 2, max: 10, tipo: "inteiro" } },
            "Multiplicação de Frações": { A: { min: 1, max: 9, tipo: "inteiro" }, B: { min: 2, max: 10, tipo: "inteiro" }, C: { min: 1, max: 9, tipo: "inteiro" }, D: { min: 2, max: 10, tipo: "inteiro" } },
            "Divisão de Frações":       { A: { min: 1, max: 9, tipo: "inteiro" }, B: { min: 2, max: 10, tipo: "inteiro" }, C: { min: 1, max: 9, tipo: "inteiro" }, D: { min: 2, max: 10, tipo: "inteiro" } },
            "Quadrado de um Número":    { A: { min: 1, max: 15, tipo: "inteiro" } },
            "Cubo de um Número":        { A: { min: 1, max: 8,  tipo: "inteiro" } },
            "Área do Quadrado":         { A: { min: 1, max: 15, tipo: "inteiro" } },
            "Área do Retângulo":        { A: { min: 1, max: 15, tipo: "inteiro" }, B: { min: 1, max: 15, tipo: "inteiro" } },
            "Área do Triângulo":        { A: { min: 2, max: 20, tipo: "inteiro" }, B: { min: 2, max: 20, tipo: "inteiro" } },
            "Média de Dois Valores":    { A: { min: 1, max: 20, tipo: "inteiro" }, B: { min: 1, max: 20, tipo: "inteiro" } }
        },
        bingoParams: { numQuestoesUnicas: 25, numCartelas: 10, numQuestoesPorCartela: 5, minRepeticoes: 1, maxRepeticoes: 3 }
    },
    {
        id: "bncc-ef-7",
        title: "BNCC – EF 7° Ano",
        description: "Equação do 1° grau, porcentagem e geometria do círculo conforme a BNCC do EF 7° ano.",
        icon: "fa-percent",
        equations: [
            "Solução de Equação do 1º Grau",
            "Porcentagem de um Valor", "Acréscimo Percentual",
            "Área do Trapézio", "Área do Losango", "Área do Círculo",
            "Comprimento da Circunferência"
        ],
        restrictions: {
            "Solução de Equação do 1º Grau": { A: { min: 1, max: 10, tipo: "inteiro" }, B: { min: 1, max: 20, tipo: "inteiro" } },
            "Porcentagem de um Valor":        { A: { min: 1, max: 75, tipo: "inteiro" }, B: { min: 100, max: 1000, tipo: "inteiro" } },
            "Acréscimo Percentual":           { A: { min: 1, max: 50, tipo: "inteiro" }, B: { min: 100, max: 500, tipo: "inteiro" } },
            "Área do Trapézio":               { A: { min: 1, max: 15, tipo: "inteiro" }, B: { min: 1, max: 15, tipo: "inteiro" }, H: { min: 1, max: 15, tipo: "inteiro" } },
            "Área do Losango":                { A: { min: 2, max: 20, tipo: "inteiro" }, B: { min: 2, max: 20, tipo: "inteiro" } },
            "Área do Círculo":                { A: { min: 1, max: 10, tipo: "inteiro" } },
            "Comprimento da Circunferência":  { A: { min: 1, max: 10, tipo: "inteiro" } }
        },
        bingoParams: { numQuestoesUnicas: 21, numCartelas: 8, numQuestoesPorCartela: 5, minRepeticoes: 1, maxRepeticoes: 3 }
    },
    {
        id: "bncc-ef-8",
        title: "BNCC – EF 8° Ano",
        description: "Radiciação, teorema de Pitágoras, volumes e estatística conforme a BNCC do EF 8° ano.",
        icon: "fa-shapes",
        equations: [
            "Raiz Quadrada", "Raiz Cúbica",
            "Quadrado da Hipotenusa (Pitágoras)",
            "Volume do Cubo", "Volume do Paralelepípedo", "Volume da Pirâmide",
            "Média de Três Valores", "Média Ponderada de Dois Valores"
        ],
        restrictions: {
            "Raiz Quadrada":                  { A: { min: 1, max: 100, tipo: "inteiro" } },
            "Raiz Cúbica":                    { A: { min: 1, max: 125, tipo: "inteiro" } },
            "Quadrado da Hipotenusa (Pitágoras)": { A: { min: 1, max: 12, tipo: "inteiro" }, B: { min: 1, max: 12, tipo: "inteiro" } },
            "Volume do Cubo":                 { A: { min: 1, max: 10, tipo: "inteiro" } },
            "Volume do Paralelepípedo":        { A: { min: 1, max: 10, tipo: "inteiro" }, B: { min: 1, max: 10, tipo: "inteiro" }, C: { min: 1, max: 10, tipo: "inteiro" } },
            "Volume da Pirâmide":              { A: { min: 2, max: 15, tipo: "inteiro" }, B: { min: 2, max: 15, tipo: "inteiro" }, H: { min: 1, max: 10, tipo: "inteiro" } },
            "Média de Três Valores":           { A: { min: 1, max: 20, tipo: "inteiro" }, B: { min: 1, max: 20, tipo: "inteiro" }, C: { min: 1, max: 20, tipo: "inteiro" } },
            "Média Ponderada de Dois Valores": { A: { min: 1, max: 20, tipo: "inteiro" }, P: { min: 1, max: 5, tipo: "inteiro" }, B: { min: 1, max: 20, tipo: "inteiro" }, Q: { min: 1, max: 5, tipo: "inteiro" } }
        },
        bingoParams: { numQuestoesUnicas: 25, numCartelas: 8, numQuestoesPorCartela: 5, minRepeticoes: 1, maxRepeticoes: 3 }
    },
    {
        id: "bncc-ef-9",
        title: "BNCC – EF 9° Ano",
        description: "Trigonometria, volumes de corpos redondos, equação do 2° grau e progressões conforme a BNCC do EF 9° ano.",
        icon: "fa-compass",
        equations: [
            "Seno no Triângulo Retângulo", "Cosseno no Triângulo Retângulo", "Tangente no Triângulo Retângulo",
            "Volume do Cilindro", "Volume do Cone", "Volume da Esfera",
            "Discriminante de Equação do 2º Grau",
            "Termo Geral da PA", "Soma dos Termos da PA",
            "Termo Geral da PG", "Soma dos Termos da PG"
        ],
        restrictions: {
            "Seno no Triângulo Retângulo":    { A: { min: 1, max: 5, tipo: "inteiro" }, C: { min: 6, max: 10, tipo: "inteiro" } },
            "Cosseno no Triângulo Retângulo": { A: { min: 1, max: 5, tipo: "inteiro" }, C: { min: 6, max: 10, tipo: "inteiro" } },
            "Tangente no Triângulo Retângulo":{ A: { min: 1, max: 9, tipo: "inteiro" }, B: { min: 1, max: 9, tipo: "inteiro" } },
            "Volume do Cilindro":             { A: { min: 1, max: 8, tipo: "inteiro" }, B: { min: 1, max: 10, tipo: "inteiro" } },
            "Volume do Cone":                 { A: { min: 1, max: 8, tipo: "inteiro" }, B: { min: 1, max: 10, tipo: "inteiro" } },
            "Volume da Esfera":               { A: { min: 1, max: 6, tipo: "inteiro" } },
            "Discriminante de Equação do 2º Grau": { A: { min: 1, max: 5, tipo: "inteiro" }, B: { min: -10, max: 10, tipo: "inteiro" }, C: { min: -10, max: 10, tipo: "inteiro" } },
            "Termo Geral da PA":              { A: { min: 1, max: 10, tipo: "inteiro" }, B: { min: 2, max: 8, tipo: "inteiro" }, C: { min: 1, max: 5, tipo: "inteiro" } },
            "Soma dos Termos da PA":          { A: { min: 1, max: 10, tipo: "inteiro" }, L: { min: 1, max: 30, tipo: "inteiro" }, N: { min: 2, max: 10, tipo: "inteiro" } },
            "Termo Geral da PG":              { A: { min: 1, max: 5, tipo: "inteiro" }, Q: { min: 2, max: 4, tipo: "inteiro" }, N: { min: 2, max: 6, tipo: "inteiro" } },
            "Soma dos Termos da PG":          { A: { min: 1, max: 5, tipo: "inteiro" }, B: { min: 2, max: 3, tipo: "inteiro" }, C: { min: 2, max: 5, tipo: "inteiro" } }
        },
        bingoParams: { numQuestoesUnicas: 30, numCartelas: 10, numQuestoesPorCartela: 6, minRepeticoes: 1, maxRepeticoes: 3 }
    },
    {
        id: "bncc-em",
        title: "BNCC – Ensino Médio",
        description: "Funções, análise combinatória e matemática financeira conforme a BNCC do Ensino Médio.",
        icon: "fa-graduation-cap",
        equations: [
            "Valor da Função Linear", "Valor da Função Quadrática", "Valor da Função Exponencial",
            "Fatorial de um Número", "Arranjo Simples", "Combinação Simples",
            "Juros Simples", "Montante com Juros Simples", "Montante com Juros Compostos"
        ],
        restrictions: {
            "Valor da Função Linear":       { A: { min: 1, max: 5, tipo: "inteiro" }, X: { min: -5, max: 10, tipo: "inteiro" }, B: { min: -10, max: 10, tipo: "inteiro" } },
            "Valor da Função Quadrática":   { A: { min: 1, max: 3, tipo: "inteiro" }, X: { min: -5, max: 5, tipo: "inteiro" }, B: { min: -5, max: 5, tipo: "inteiro" }, C: { min: -10, max: 10, tipo: "inteiro" } },
            "Valor da Função Exponencial":  { A: { min: 1, max: 3, tipo: "inteiro" }, B: { min: 2, max: 3, tipo: "inteiro" }, X: { min: 1, max: 4, tipo: "inteiro" } },
            "Fatorial de um Número":        { A: { min: 1, max: 7, tipo: "inteiro" } },
            "Arranjo Simples":              { A: { min: 4, max: 8, tipo: "inteiro" }, B: { min: 1, max: 3, tipo: "inteiro" } },
            "Combinação Simples":           { A: { min: 4, max: 8, tipo: "inteiro" }, B: { min: 1, max: 3, tipo: "inteiro" } },
            "Juros Simples":                { C: { min: 100, max: 1000, tipo: "inteiro" }, A: { min: 1, max: 10, tipo: "inteiro" }, B: { min: 1, max: 12, tipo: "inteiro" } },
            "Montante com Juros Simples":   { C: { min: 100, max: 1000, tipo: "inteiro" }, A: { min: 1, max: 10, tipo: "inteiro" }, B: { min: 1, max: 12, tipo: "inteiro" } },
            "Montante com Juros Compostos": { A: { min: 100, max: 2000, tipo: "inteiro" }, B: { min: 1, max: 10, tipo: "inteiro" }, C: { min: 1, max: 5, tipo: "inteiro" } }
        },
        bingoParams: { numQuestoesUnicas: 25, numCartelas: 8, numQuestoesPorCartela: 5, minRepeticoes: 1, maxRepeticoes: 3 }
    },
    // ─── Presets temáticos ────────────────────────────────────────────────────────
    {
        id: "geometria-plana-completo",
        title: "Geometria Plana Completa",
        description: "Todas as áreas, perímetros e comprimento de circunferência disponíveis.",
        icon: "fa-draw-polygon",
        equations: [
            "Área do Quadrado", "Área do Retângulo", "Área do Triângulo",
            "Área do Trapézio", "Área do Losango", "Área do Círculo",
            "Perímetro do Quadrado", "Perímetro do Retângulo",
            "Comprimento da Circunferência"
        ],
        restrictions: {
            "Área do Quadrado":              { A: { min: 1, max: 15, tipo: "inteiro" } },
            "Área do Retângulo":             { A: { min: 1, max: 15, tipo: "inteiro" }, B: { min: 1, max: 15, tipo: "inteiro" } },
            "Área do Triângulo":             { A: { min: 2, max: 20, tipo: "inteiro" }, B: { min: 2, max: 20, tipo: "inteiro" } },
            "Área do Trapézio":              { A: { min: 1, max: 15, tipo: "inteiro" }, B: { min: 1, max: 15, tipo: "inteiro" }, H: { min: 1, max: 15, tipo: "inteiro" } },
            "Área do Losango":               { A: { min: 2, max: 20, tipo: "inteiro" }, B: { min: 2, max: 20, tipo: "inteiro" } },
            "Área do Círculo":               { A: { min: 1, max: 10, tipo: "inteiro" } },
            "Perímetro do Quadrado":         { A: { min: 1, max: 20, tipo: "inteiro" } },
            "Perímetro do Retângulo":        { A: { min: 1, max: 20, tipo: "inteiro" }, B: { min: 1, max: 20, tipo: "inteiro" } },
            "Comprimento da Circunferência": { A: { min: 1, max: 10, tipo: "inteiro" } }
        },
        bingoParams: { numQuestoesUnicas: 25, numCartelas: 10, numQuestoesPorCartela: 5, minRepeticoes: 1, maxRepeticoes: 3 }
    },
    {
        id: "geometria-espacial-completo",
        title: "Geometria Espacial Completa",
        description: "Volumes de cubos, paralelepípedos, pirâmides, cilindros, cones e esferas.",
        icon: "fa-cube",
        equations: [
            "Volume do Cubo", "Volume do Paralelepípedo", "Volume da Pirâmide",
            "Volume do Cilindro", "Volume do Cone", "Volume da Esfera"
        ],
        restrictions: {
            "Volume do Cubo":          { A: { min: 1, max: 10, tipo: "inteiro" } },
            "Volume do Paralelepípedo":{ A: { min: 1, max: 10, tipo: "inteiro" }, B: { min: 1, max: 10, tipo: "inteiro" }, C: { min: 1, max: 10, tipo: "inteiro" } },
            "Volume da Pirâmide":      { A: { min: 2, max: 15, tipo: "inteiro" }, B: { min: 2, max: 15, tipo: "inteiro" }, H: { min: 1, max: 10, tipo: "inteiro" } },
            "Volume do Cilindro":      { A: { min: 1, max: 8,  tipo: "inteiro" }, B: { min: 1, max: 10, tipo: "inteiro" } },
            "Volume do Cone":          { A: { min: 1, max: 8,  tipo: "inteiro" }, B: { min: 1, max: 10, tipo: "inteiro" } },
            "Volume da Esfera":        { A: { min: 1, max: 6,  tipo: "inteiro" } }
        },
        bingoParams: { numQuestoesUnicas: 24, numCartelas: 8, numQuestoesPorCartela: 5, minRepeticoes: 1, maxRepeticoes: 3 }
    },
    {
        id: "trigonometria",
        title: "Bingo de Trigonometria",
        description: "Razões trigonométricas no triângulo retângulo e teorema de Pitágoras.",
        icon: "fa-drafting-compass",
        equations: [
            "Seno no Triângulo Retângulo", "Cosseno no Triângulo Retângulo",
            "Tangente no Triângulo Retângulo", "Quadrado da Hipotenusa (Pitágoras)"
        ],
        restrictions: {
            "Seno no Triângulo Retângulo":    { A: { min: 1, max: 5, tipo: "inteiro" }, C: { min: 6, max: 10, tipo: "inteiro" } },
            "Cosseno no Triângulo Retângulo": { A: { min: 1, max: 5, tipo: "inteiro" }, C: { min: 6, max: 10, tipo: "inteiro" } },
            "Tangente no Triângulo Retângulo":{ A: { min: 1, max: 9, tipo: "inteiro" }, B: { min: 1, max: 9, tipo: "inteiro" } },
            "Quadrado da Hipotenusa (Pitágoras)": { A: { min: 1, max: 12, tipo: "inteiro" }, B: { min: 1, max: 12, tipo: "inteiro" } }
        },
        bingoParams: { numQuestoesUnicas: 20, numCartelas: 8, numQuestoesPorCartela: 4, minRepeticoes: 1, maxRepeticoes: 3 }
    },
    {
        id: "funcoes",
        title: "Bingo das Funções",
        description: "Cálculo de imagens em funções lineares, quadráticas e exponenciais.",
        icon: "fa-chart-line",
        equations: [
            "Valor da Função Linear", "Valor da Função Quadrática", "Valor da Função Exponencial"
        ],
        restrictions: {
            "Valor da Função Linear":      { A: { min: 1, max: 5, tipo: "inteiro" }, X: { min: -5, max: 10, tipo: "inteiro" }, B: { min: -10, max: 10, tipo: "inteiro" } },
            "Valor da Função Quadrática":  { A: { min: 1, max: 3, tipo: "inteiro" }, X: { min: -5, max: 5, tipo: "inteiro" }, B: { min: -5, max: 5, tipo: "inteiro" }, C: { min: -10, max: 10, tipo: "inteiro" } },
            "Valor da Função Exponencial": { A: { min: 1, max: 3, tipo: "inteiro" }, B: { min: 2, max: 3, tipo: "inteiro" }, X: { min: 1, max: 4, tipo: "inteiro" } }
        },
        bingoParams: { numQuestoesUnicas: 20, numCartelas: 8, numQuestoesPorCartela: 4, minRepeticoes: 1, maxRepeticoes: 3 }
    },
    {
        id: "combinatoria",
        title: "Bingo de Combinatória",
        description: "Fatorial, arranjos e combinações simples.",
        icon: "fa-project-diagram",
        equations: ["Fatorial de um Número", "Arranjo Simples", "Combinação Simples"],
        restrictions: {
            "Fatorial de um Número": { A: { min: 1, max: 7, tipo: "inteiro" } },
            "Arranjo Simples":       { A: { min: 4, max: 8, tipo: "inteiro" }, B: { min: 1, max: 3, tipo: "inteiro" } },
            "Combinação Simples":    { A: { min: 4, max: 8, tipo: "inteiro" }, B: { min: 1, max: 3, tipo: "inteiro" } }
        },
        bingoParams: { numQuestoesUnicas: 18, numCartelas: 8, numQuestoesPorCartela: 4, minRepeticoes: 1, maxRepeticoes: 3 }
    },
    {
        id: "matematica-financeira",
        title: "Matemática Financeira",
        description: "Porcentagem, juros simples e juros compostos.",
        icon: "fa-coins",
        equations: [
            "Porcentagem de um Valor", "Acréscimo Percentual",
            "Juros Simples", "Montante com Juros Simples", "Montante com Juros Compostos"
        ],
        restrictions: {
            "Porcentagem de um Valor":      { A: { min: 1, max: 75, tipo: "inteiro" }, B: { min: 100, max: 1000, tipo: "inteiro" } },
            "Acréscimo Percentual":         { A: { min: 1, max: 50, tipo: "inteiro" }, B: { min: 100, max: 500, tipo: "inteiro" } },
            "Juros Simples":                { C: { min: 100, max: 1000, tipo: "inteiro" }, A: { min: 1, max: 10, tipo: "inteiro" }, B: { min: 1, max: 12, tipo: "inteiro" } },
            "Montante com Juros Simples":   { C: { min: 100, max: 1000, tipo: "inteiro" }, A: { min: 1, max: 10, tipo: "inteiro" }, B: { min: 1, max: 12, tipo: "inteiro" } },
            "Montante com Juros Compostos": { A: { min: 100, max: 2000, tipo: "inteiro" }, B: { min: 1, max: 10, tipo: "inteiro" }, C: { min: 1, max: 5, tipo: "inteiro" } }
        },
        bingoParams: { numQuestoesUnicas: 20, numCartelas: 8, numQuestoesPorCartela: 4, minRepeticoes: 1, maxRepeticoes: 3 }
    },
    {
        id: "customizado",
        title: "Configuração Customizada",
        description: "Configure manualmente tópicos, equações, restrições e parâmetros nas abas correspondentes.",
        icon: "fa-sliders",
        equations: [],
        restrictions: {},
        bingoParams: null,
        customSelection: true
    }
];

// ─── Componente ───────────────────────────────────────────────────────────────────

export function createTelaPresets({ elements, state, saveState, showToast, renderAll }) {

    let activePresetId = state.activePresetId ?? "customizado";
    let cardElements = new Map();

    function getTopicNamesForPreset(preset) {
        const topicIds = new Set();
        preset.equations.forEach((eqName) => {
            const eq = state.equations.find((e) => e.name === eqName);
            if (eq) topicIds.add(eq.topicId);
        });
        return [...topicIds].map((id) => {
            const topic = state.topics.find((t) => t.id === id);
            return topic ? topic.name : null;
        }).filter(Boolean);
    }

    function updateSelectedVisual() {
        cardElements.forEach((card, presetId) => {
            card.classList.toggle("selected", presetId === activePresetId);
        });
    }

    function applyPreset(preset) {
        activePresetId = preset.id;
        state.activePresetId = preset.id;
        updateSelectedVisual();

        if (preset.customSelection) {
            showToast("Configuração customizada selecionada. Ajuste as opções nas abas.");
            return;
        }

        // 1. Desmarca todos (sem remover)
        state.topics.forEach((t) => { t.selected = false; });
        state.equations.forEach((eq) => { eq.selected = false; });

        // 2. Seleciona equações por nome e os tópicos pai
        const matchedTopicIds = new Set();
        preset.equations.forEach((eqName) => {
            const eq = state.equations.find((e) => e.name === eqName);
            if (eq) {
                eq.selected = true;
                matchedTopicIds.add(eq.topicId);
            }
        });
        matchedTopicIds.forEach((topicId) => {
            const topic = state.topics.find((t) => t.id === topicId);
            if (topic) topic.selected = true;
        });

        // 3. Aplica restrições
        Object.entries(preset.restrictions).forEach(([eqName, varRestrictions]) => {
            const eq = state.equations.find((e) => e.name === eqName);
            if (!eq) return;
            Object.entries(varRestrictions).forEach(([varName, config]) => {
                state.restrictions[`${eq.id}::${varName}`] = {
                    min: config.min,
                    max: config.max,
                    tipo: config.tipo
                };
            });
        });

        // 4. Aplica parâmetros do bingo
        if (preset.bingoParams) {
            state.bingoParams = new BingoParams({ ...state.bingoParams, ...preset.bingoParams });
        }

        // 5. Limpa questões/cartelas geradas anteriormente
        state.generatedQuestions = [];
        state.generatedCards = [];

        saveState();
        renderAll();
        showToast(`Preset "${preset.title}" aplicado.`);
    }

    function render() {
        if (!elements.presetsContainer) return;

        cardElements = new Map();

        const cards = PRESETS.map((preset) => {
            const topicNames = getTopicNamesForPreset(preset);
            const card = createPresetCard({
                preset,
                isSelected: preset.id === activePresetId,
                topicNames,
                onClick: () => applyPreset(preset),
            });
            cardElements.set(preset.id, card);
            return card;
        });

        elements.presetsContainer.innerHTML = "";
        cards.forEach((card) => elements.presetsContainer.appendChild(card));
    }

    function selectCustom() {
        activePresetId = "customizado";
        state.activePresetId = "customizado";
        updateSelectedVisual();
    }

    function selectById(id) {
        activePresetId = id ?? "customizado";
        updateSelectedVisual();
    }

    return { render, selectCustom, selectById };
}
