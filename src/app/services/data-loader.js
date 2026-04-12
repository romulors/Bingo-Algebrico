import { DEFAULT_DATA_FILES } from "../constants.js";

export async function loadDefaultEquations() {
    const requests = DEFAULT_DATA_FILES.map(async (filePath) => {
        try {
            const response = await fetch(filePath);

            if (!response.ok) {
                console.warn(`Falha ao carregar ${filePath}: status ${response.status}`);
                return null;
            }

            const data = await response.json();
            return normalizeEquationData(data, filePath);
        } catch (error) {
            console.warn(`Erro ao buscar ${filePath}:`, error);
            return null;
        }
    });

    const results = await Promise.all(requests);
    return results.filter(Boolean);
}

export function normalizeEquationData(data, sourceFile) {
    if (Array.isArray(data)) data = data[0];
    const topicName = ((data.nomeTopico || "").trim() || "Tópico");
    const equationName = (data.nomeEquacao || "Equação").trim();
    // `modeloEquacao` aceita tanto notação plain-text ("A/B + C/D") quanto LaTeX puro
    // ("\\frac{A}{B} \\div \\frac{C}{D}"). O valor é armazenado como string e usado de
    // duas formas: (1) renderizado via MathJax envolvido em \[...\] e (2) como template
    // de enunciado onde as variáveis maiúsculas são substituídas por valores numéricos.
    const model = (data.modeloEquacao || data.modelo || "A + B").trim();
    // `resposta` segue o mesmo contrato de `modeloEquacao`: aceita plain-text ou LaTeX.
    // É usado apenas para exibição no card de preview da equação (não em cálculos).
    const responseModel = (data.resposta || "R").trim();
    const formulaResposta = (data.formulaResposta || "").trim() || (() => {
        console.warn(`[data-loader] Campo "formulaResposta" ausente em "${equationName}". Usando "A+B" como fallback.`);
        return "A+B";
    })();
    const variables = extractVariables(`${model} ${responseModel}`);
    const topicId = `topic::${slugify(topicName)}`;
    const equationId = `eq::${slugify(topicName)}::${slugify(equationName)}`;

    return {
        topic: {
            id: topicId,
            name: topicName,
            selected: true,
            source: "default"
        },
        equation: {
            id: equationId,
            topicId,
            name: equationName,
            model,
            responseModel,
            formulaResposta,
            variables,
            selected: true,
            sourceFile,
            source: "default"
        }
    };
}

export function slugify(value) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export function extractVariables(expression) {
    // Extrai todas as letras maiúsculas únicas da expressão como nomes de variável.
    // Invariante assumida: comandos LaTeX usam apenas letras minúsculas (ex: \frac, \div,
    // \cdot), portanto /[A-Z]/g captura exclusivamente variáveis algébricas, mesmo em
    // expressões LaTeX como "\\frac{A}{B} \\div \\frac{C}{D}".
    const matches = expression.match(/[A-Z]/g) || [];
    return [...new Set(matches)];
}
