import { MathUtils } from "../../app/services/math-utils.js";
import { BingoParams } from "../../app/models/BingoParams.js";
import { createBingoParams } from "../ui/bingo-params/bingo-params.js";

export function createTelaBingo({ elements, state, saveState, showToast, getSelectedEquations, navigateTo, renderAll, onManualConfigChange, onBingoParamChange }) {
    // ─── BingoParams widget (lazy-mounted) ───────────────────────────────────────

    let paramsWidget = null;

    function getParamsWidget() {
        if (!paramsWidget && elements.bingoParamsMount) {
            paramsWidget = createBingoParams({
                initialParams: state.bingoParams,
                onChange: (newValues) => {
                    state.bingoParams = new BingoParams(newValues);
                    const error = validateBingoParams();
                    if (error) {
                        paramsWidget.showStatus(error, true);
                    } else {
                        const totalSlots = newValues.numCartelas * newValues.numQuestoesPorCartela;
                        paramsWidget.showStatus(`Parâmetros válidos. Total de espaços estimados: ${totalSlots}.`, false);
                    }
                    saveState();
                    onManualConfigChange?.();
                    onBingoParamChange?.();
                },
            });
            elements.bingoParamsMount.appendChild(paramsWidget.element);
        }
        return paramsWidget;
    }
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
        return new BingoParams(state.bingoParams).validate(getSelectedEquations().length) ?? "";
    }
    // ─── Sincronização de inputs ─────────────────────────────────────────────────

    function syncBingoParamsFromInputs() {
        const widget = getParamsWidget();
        if (widget) {
            state.bingoParams = widget.getValues();
        }
    }

    // ─── Render ──────────────────────────────────────────────────────────────────

    function render() {
        const widget = getParamsWidget();
        if (!widget) return;

        widget.setValues(state.bingoParams);

        const validationError = validateBingoParams();
        if (validationError) {
            widget.showStatus(validationError, true);
        } else {
            const totalSlots = state.bingoParams.numCartelas * state.bingoParams.numQuestoesPorCartela;
            widget.showStatus(`Parâmetros válidos. Total de espaços estimados: ${totalSlots}.`, false);
        }
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
        // Param input events are handled by the BingoParams widget's onChange callback.

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
