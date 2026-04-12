export function createTelaImportExport({ elements, state, saveState, showToast, renderAll }) {
    function render() {
        if (!elements.importExportFeedback) return;

        const customTopics = state.topics.filter((t) => t.source === "custom");
        const customEquations = state.equations.filter((eq) => eq.source === "custom");
        const restrictionCount = Object.keys(state.restrictions).length;

        elements.importExportFeedback.textContent =
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
            version: 1,
            customTopics,
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
                showToast("Arquivo inválido ou de versão incompatível.");
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
