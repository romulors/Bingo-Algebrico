import { EXPORT_VERSIONS, EXPORT_TYPES } from "../../app/constants.js";

export function createTelaPersistencia({ elements, state, saveState, showToast, renderAll, applyThemeVars, getTelaPresets }) {
    function render() {
        if (!elements.persistenciaFeedback) return;

        const customTopics = state.topics.filter((t) => t.source === "custom");
        const customEquations = state.equations.filter((eq) => eq.source === "custom");
        const restrictionCount = Object.keys(state.restrictions).length;

        elements.persistenciaFeedback.textContent =
            `Dados atuais: ${customTopics.length} tópico(s) customizado(s), ` +
            `${customEquations.length} equação(ões) customizada(s), ` +
            `${restrictionCount} restrição(ões) configurada(s).`;

        if (elements.inputNomeExportacao && !elements.inputNomeExportacao.value) {
            elements.inputNomeExportacao.value = `bingo-algebrico-dados-${new Date().toISOString().slice(0, 10)}`;
        }
    }

    function exportData() {
        const customTopics = state.topics.filter((t) => t.source === "custom");
        const customEquations = state.equations.filter((eq) => eq.source === "custom");

        const payload = {
            exportedAt: new Date().toISOString(),
            app: "BingoAlgebrico",
            type: EXPORT_TYPES.DADOS,
            version: EXPORT_VERSIONS.DADOS,
            presetId: state.activePresetId ?? "customizado",
            activeTopicIds: state.topics.filter((t) => t.selected).map((t) => t.id),
            activeEquationIds: state.equations.filter((eq) => eq.selected).map((eq) => eq.id),
            bingoParams: { ...state.bingoParams },
            visualTheme: { ...state.visualTheme },
            cardDisplayMode: state.cardDisplayMode,            customTopics,
            customEquations,
            restrictions: state.restrictions,
            customTopicCounter: state.customTopicCounter,
            customEquationCounter: state.customEquationCounter
        };

        const defaultName = `bingo-algebrico-dados-${new Date().toISOString().slice(0, 10)}`;
        const fileName = (elements.inputNomeExportacao?.value || defaultName).trim() || defaultName;

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${fileName}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
        showToast("Dados exportados.");
    }

    async function importData(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const parsed = JSON.parse(text);

            if (parsed?.app !== "BingoAlgebrico" || !parsed?.version) {
                showToast("Arquivo inválido ou não reconhecido.");
                return;
            }

            if (parsed.type && parsed.type !== EXPORT_TYPES.DADOS) {
                showToast("Arquivo incorreto: use a tela Visual para importar configurações completas.");
                return;
            }

            if (parsed.version > EXPORT_VERSIONS.DADOS) {
                showToast(`Arquivo de versão ${parsed.version} não suportada (máx: ${EXPORT_VERSIONS.DADOS}). Atualize a aplicação.`);
                return;
            }

            const importedTopics = Array.isArray(parsed.customTopics) ? parsed.customTopics : [];
            const importedEquations = Array.isArray(parsed.customEquations) ? parsed.customEquations : [];
            const importedRestrictions = parsed.restrictions && typeof parsed.restrictions === "object" ? parsed.restrictions : {};

            function isValidTopic(t) {
                return t && typeof t.id === "string" && t.id && typeof t.name === "string" && t.name && t.source === "custom";
            }

            function isValidEquation(eq) {
                return eq &&
                    typeof eq.id === "string" && eq.id &&
                    typeof eq.model === "string" && eq.model &&
                    typeof eq.responseModel === "string" &&
                    typeof eq.formulaResposta === "string" &&
                    Array.isArray(eq.variables) &&
                    eq.source === "custom";
            }

            // Merge topics — validated, skip duplicates by id
            const existingTopicIds = new Set(state.topics.map((t) => t.id));
            let topicsAdded = 0;
            importedTopics.forEach((topic) => {
                if (isValidTopic(topic) && !existingTopicIds.has(topic.id)) {
                    state.topics.push(topic);
                    topicsAdded++;
                }
            });

            // Merge equations — validated, skip duplicates by id
            const existingEquationIds = new Set(state.equations.map((eq) => eq.id));
            let equationsAdded = 0;
            importedEquations.forEach((equation) => {
                if (isValidEquation(equation) && !existingEquationIds.has(equation.id)) {
                    if (!equation.formulaResposta) equation.formulaResposta = equation.model;
                    state.equations.push(equation);
                    equationsAdded++;
                }
            });

            // Merge restrictions — coerce min/max to numbers
            Object.entries(importedRestrictions).forEach(([key, config]) => {
                if (config && typeof config === "object") {
                    state.restrictions[key] = {
                        ...config,
                        min: Number(config.min ?? 1),
                        max: Number(config.max ?? 10)
                    };
                }
            });

            // Update counters to avoid id collisions
            if (parsed.customTopicCounter > state.customTopicCounter) {
                state.customTopicCounter = parsed.customTopicCounter;
            }
            if (parsed.customEquationCounter > state.customEquationCounter) {
                state.customEquationCounter = parsed.customEquationCounter;
            }

            // v2: restore selections, params and theme
            if (parsed.version >= 2) {
                const activeTopicIds = new Set(Array.isArray(parsed.activeTopicIds) ? parsed.activeTopicIds : []);
                const activeEquationIds = new Set(Array.isArray(parsed.activeEquationIds) ? parsed.activeEquationIds : []);

                state.topics.forEach((t) => { t.selected = activeTopicIds.has(t.id); });
                state.equations.forEach((eq) => { eq.selected = activeEquationIds.has(eq.id); });

                if (parsed.bingoParams && typeof parsed.bingoParams === "object") {
                    state.bingoParams = {
                        ...state.bingoParams,
                        numQuestoesUnicas:     Number(parsed.bingoParams.numQuestoesUnicas     ?? state.bingoParams.numQuestoesUnicas),
                        numCartelas:           Number(parsed.bingoParams.numCartelas            ?? state.bingoParams.numCartelas),
                        numQuestoesPorCartela: Number(parsed.bingoParams.numQuestoesPorCartela ?? state.bingoParams.numQuestoesPorCartela),
                        minRepeticoes:         Number(parsed.bingoParams.minRepeticoes          ?? state.bingoParams.minRepeticoes),
                        maxRepeticoes:         Number(parsed.bingoParams.maxRepeticoes          ?? state.bingoParams.maxRepeticoes)
                    };
                }

                if (parsed.visualTheme && typeof parsed.visualTheme === "object") {
                    state.visualTheme = { ...state.visualTheme, ...parsed.visualTheme };
                    applyThemeVars?.(state.visualTheme);
                }

                state.cardDisplayMode = parsed.cardDisplayMode === "aluno" ? "aluno" : "professor";
                state.activePresetId = typeof parsed.presetId === "string" ? parsed.presetId : "customizado";
                getTelaPresets?.().selectById(state.activePresetId);
            }

            saveState();
            renderAll();

            const added = topicsAdded + equationsAdded;
            showToast(`Importação concluída: ${added} item(ns) adicionado(s).`);
        } catch (error) {
            console.error(error);
            showToast("Falha ao importar: arquivo inválido.");
        } finally {
            if (elements.inputImportarDados) {
                elements.inputImportarDados.value = "";
            }
        }
    }

    function wireActions() {
        elements.botaoExportarDados?.addEventListener("click", exportData);

        elements.botaoImportarDados?.addEventListener("click", () => {
            elements.inputImportarDados?.click();
        });

        elements.inputImportarDados?.addEventListener("change", importData);
    }

    return { render, wireActions };
}
