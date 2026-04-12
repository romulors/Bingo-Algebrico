import { MathUtils } from "../../app/services/math-utils.js";
import { extractVariables } from "../../app/services/data-loader.js";

export function createTelaBingo({ elements, state, saveState, showToast, getSelectedEquations, navigateTo, renderAll, onManualConfigChange, onBingoParamChange }) {
    // ─── Utilitários de geração de valores ──────────────────────────────────────

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomRational(min, max) {
        const raw = randomInt(min * 10, max * 10);
        return raw / 10;
    }

    function getRestrictionConfig(equationId, variableName) {
        const key = `${equationId}::${variableName}`;
        const config = state.restrictions[key] || { min: 1, max: 10, tipo: "inteiro" };

        return {
            min: Number.isFinite(Number(config.min)) ? Number(config.min) : 1,
            max: Number.isFinite(Number(config.max)) ? Number(config.max) : 10,
            tipo: config.tipo === "racional" ? "racional" : "inteiro"
        };
    }

    function generateValuesForEquation(equation) {
        const values = {};

        equation.variables.forEach((variableName) => {
            const config = getRestrictionConfig(equation.id, variableName);
            const min = Math.min(config.min, config.max);
            const max = Math.max(config.min, config.max);

            let value = config.tipo === "racional" ? randomRational(min, max) : randomInt(min, max);

            if (value === 0) {
                value = config.tipo === "racional" ? 0.5 : 1;
            }

            values[variableName] = value;
        });

        return values;
    }

    function applyValuesToExpression(expression, values) {
        let result = expression;

        Object.keys(values).forEach((variableName) => {
            const variableRegex = new RegExp(`\\b${variableName}\\b`, "g");
            result = result.replace(variableRegex, String(values[variableName]));
        });

        return result;
    }

    // ─── Construção de questão individual ───────────────────────────────────────

    function buildQuestionFromEquation(equation) {
        for (let attempt = 0; attempt < 40; attempt += 1) {
            const values = generateValuesForEquation(equation);
            const resposta = MathUtils.evaluateFormula(equation.formulaResposta, values);

            if (!resposta || resposta === "Erro" || resposta === "Indefinido") {
                continue;
            }

            const enunciado = applyValuesToExpression(equation.model, values);
            state.questionCounter += 1;

            return {
                id: `q::${state.questionCounter}`,
                equationId: equation.id,
                equationName: equation.name,
                topicId: equation.topicId,
                topicName: state.topics.find((topic) => topic.id === equation.topicId)?.name || "Sem tópico",
                valores: values,
                enunciado,
                resposta
            };
        }

        return null;
    }

    // ─── Validação dos parâmetros ────────────────────────────────────────────────

    function validateBingoParams() {
        const { numQuestoesUnicas, numCartelas, numQuestoesPorCartela, minRepeticoes, maxRepeticoes } = state.bingoParams;
        const selectedEquations = getSelectedEquations();

        if (selectedEquations.length === 0) {
            return "Selecione ao menos uma equação antes de gerar questões.";
        }

        if (numQuestoesUnicas < 1 || numCartelas < 1 || numQuestoesPorCartela < 1) {
            return "Parâmetros numéricos devem ser maiores que zero.";
        }

        if (maxRepeticoes < minRepeticoes) {
            return "Máximo de repetições deve ser maior ou igual ao mínimo.";
        }

        if (numQuestoesPorCartela > numQuestoesUnicas) {
            return "Questões por cartela não pode ser maior que o número de questões únicas.";
        }

        if (minRepeticoes > numCartelas || maxRepeticoes > numCartelas) {
            return "Repetições por questão não pode ultrapassar o número de cartelas.";
        }

        const totalSlots = numCartelas * numQuestoesPorCartela;
        const maxCoverage = numQuestoesUnicas * maxRepeticoes;
        const minCoverage = numQuestoesUnicas * minRepeticoes;

        if (totalSlots > maxCoverage) {
            return "Configuração inconsistente: faltam repetições para preencher todas as cartelas.";
        }

        if (totalSlots < minCoverage) {
            return "Configuração inconsistente: repetições mínimas estão altas para o total de espaços.";
        }

        return "";
    }

    // ─── Sincronização de inputs ─────────────────────────────────────────────────

    function syncBingoParamsFromInputs() {
        state.bingoParams = {
            numQuestoesUnicas: Number(elements.paramNumQuestoesUnicas?.value || 20),
            numCartelas: Number(elements.paramNumCartelas?.value || 20),
            numQuestoesPorCartela: Number(elements.paramNumQuestoesPorCartela?.value || 6),
            minRepeticoes: Number(elements.paramMinRepeticoes?.value || 2),
            maxRepeticoes: Number(elements.paramMaxRepeticoes?.value || 5)
        };
    }

    function applyBingoInputLimits() {
        if (!elements.paramNumQuestoesUnicas || !elements.paramNumCartelas || !elements.paramNumQuestoesPorCartela || !elements.paramMinRepeticoes || !elements.paramMaxRepeticoes) {
            return;
        }

        const numQuestoesUnicas = Math.max(1, Number(elements.paramNumQuestoesUnicas.value || 1));
        const numCartelas = Math.max(1, Number(elements.paramNumCartelas.value || 1));

        elements.paramNumQuestoesPorCartela.max = String(numQuestoesUnicas);
        elements.paramMinRepeticoes.max = String(numCartelas);
        elements.paramMaxRepeticoes.max = String(numCartelas);

        if (Number(elements.paramNumQuestoesPorCartela.value || 0) > numQuestoesUnicas) {
            elements.paramNumQuestoesPorCartela.value = String(numQuestoesUnicas);
        }

        if (Number(elements.paramMinRepeticoes.value || 0) > numCartelas) {
            elements.paramMinRepeticoes.value = String(numCartelas);
        }

        if (Number(elements.paramMaxRepeticoes.value || 0) > numCartelas) {
            elements.paramMaxRepeticoes.value = String(numCartelas);
        }

        syncBingoParamsFromInputs();
    }

    // ─── Render ──────────────────────────────────────────────────────────────────

    function render() {
        if (!elements.paramNumQuestoesUnicas) return;

        elements.paramNumQuestoesUnicas.value = state.bingoParams.numQuestoesUnicas;
        elements.paramNumCartelas.value = state.bingoParams.numCartelas;
        elements.paramNumQuestoesPorCartela.value = state.bingoParams.numQuestoesPorCartela;
        elements.paramMinRepeticoes.value = state.bingoParams.minRepeticoes;
        elements.paramMaxRepeticoes.value = state.bingoParams.maxRepeticoes;

        applyBingoInputLimits();

        const validationError = validateBingoParams();

        if (validationError) {
            elements.bingoValidationMessage.textContent = validationError;
            elements.bingoValidationMessage.className = "section-description validation-error";
            return;
        }

        const totalSlots = state.bingoParams.numCartelas * state.bingoParams.numQuestoesPorCartela;
        elements.bingoValidationMessage.textContent = `Parâmetros válidos. Total de espaços estimados: ${totalSlots}.`;
        elements.bingoValidationMessage.className = "section-description validation-success";
    }

    // ─── Geração de questões ─────────────────────────────────────────────────────

    function generateQuestions() {
        syncBingoParamsFromInputs();
        const validationError = validateBingoParams();

        if (validationError) {
            render();
            showToast(validationError);
            return;
        }

        const selectedEquations = state.equations.filter((equation) => equation.selected);
        const targetCount = state.bingoParams.numQuestoesUnicas;
        const generated = [];
        const maxAttempts = targetCount * 10;
        let attempts = 0;
        let equationIndex = 0;

        while (generated.length < targetCount && attempts < maxAttempts) {
            attempts += 1;
            const equation = selectedEquations[equationIndex % selectedEquations.length];
            equationIndex += 1;
            const question = buildQuestionFromEquation(equation);

            if (question) {
                generated.push(question);
            }
        }

        state.generatedQuestions = generated;
        state.generatedCards = [];
        saveState();
        renderAll();
        navigateTo("questoes");
        showToast(`${generated.length} questões geradas.`);
    }

    // ─── Wiring de ações ─────────────────────────────────────────────────────────

    function wireActions() {
        [
            elements.paramNumQuestoesUnicas,
            elements.paramNumCartelas,
            elements.paramNumQuestoesPorCartela,
            elements.paramMinRepeticoes,
            elements.paramMaxRepeticoes
        ].forEach((inputElement) => {
            inputElement?.addEventListener("input", () => {
                applyBingoInputLimits();
                render();
                saveState();
                onManualConfigChange?.();
                onBingoParamChange?.();
            });
        });

        elements.botaoSalvarParametrosBingo?.addEventListener("click", () => {
            syncBingoParamsFromInputs();
            const validationError = validateBingoParams();

            if (validationError) {
                render();
                showToast(validationError);
                return;
            }

            saveState();
            render();
            showToast("Parâmetros do bingo salvos.");
        });

        elements.botaoGerarQuestoes?.addEventListener("click", generateQuestions);
    }

    return {
        render,
        validateBingoParams,
        syncBingoParamsFromInputs,
        buildQuestionFromEquation,
        generateQuestions,
        wireActions
    };
}
