import { DEFAULT_VISUAL_THEME, EXPORT_VERSIONS, EXPORT_TYPES } from "../../app/constants.js";

export function createTelaVisual({ elements, state, saveState, showToast, navigateTo, renderAll, applyThemeVars }) {
    // ─── Tema visual ─────────────────────────────────────────────────────────────

    function applyThemeToUI() {
        applyThemeVars(state.visualTheme);

        const logoTitle = document.querySelector("#logo p");
        if (logoTitle) {
            logoTitle.textContent = state.visualTheme.nomeBingo || "BINGO ALGÉBRICO";
        }
    }

    function syncThemeFromInputs() {
        state.visualTheme = {
            nomeBingo: (elements.temaNomeBingo?.value || "BINGO ALGÉBRICO").trim() || "BINGO ALGÉBRICO",
            nomeInstituicao: (elements.temaNomeInstituicao?.value || "").trim(),
            corPrimaria: elements.temaCorPrimaria?.value || "#03233e",
            corDestaque: elements.temaCorDestaque?.value || "#64b0f2",
            corFundo: elements.temaCorFundo?.value || "#f3f4fa"
        };
    }

    // ─── Render ──────────────────────────────────────────────────────────────────

    function render() {
        if (!elements.temaNomeBingo || !elements.visualResumo) return;

        elements.temaNomeBingo.value = state.visualTheme.nomeBingo;
        if (elements.temaNomeInstituicao) elements.temaNomeInstituicao.value = state.visualTheme.nomeInstituicao;
        if (elements.temaCorPrimaria) elements.temaCorPrimaria.value = state.visualTheme.corPrimaria;
        if (elements.temaCorDestaque) elements.temaCorDestaque.value = state.visualTheme.corDestaque;
        if (elements.temaCorFundo) elements.temaCorFundo.value = state.visualTheme.corFundo;

        elements.visualResumo.textContent = `Tópicos: ${state.topics.length} | Equações: ${state.equations.length} | Questões: ${state.generatedQuestions.length} | Cartelas: ${state.generatedCards.length}`;
    }

    // ─── Exportação / importação ─────────────────────────────────────────────────

    function exportConfiguration() {
        const payload = {
            exportedAt: new Date().toISOString(),
            app: "BingoAlgebrico",
            type: EXPORT_TYPES.CONFIGURACAO,
            version: EXPORT_VERSIONS.CONFIGURACAO,
            data: { ...state }
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `bingo-algebrico-config-${new Date().toISOString().slice(0, 10)}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
        showToast("Configuração exportada.");
    }

    function hydrateStateFromImportedData(data) {
        if (!data || typeof data !== "object") return false;

        // Restore only non-structural fields; topics/equations are managed by mergeState on load
        state.restrictions = data.restrictions && typeof data.restrictions === "object" ? data.restrictions : {};
        state.bingoParams = {
            ...state.bingoParams,
            numQuestoesUnicas: Number(data.bingoParams?.numQuestoesUnicas ?? state.bingoParams.numQuestoesUnicas),
            numCartelas: Number(data.bingoParams?.numCartelas ?? state.bingoParams.numCartelas),
            numQuestoesPorCartela: Number(data.bingoParams?.numQuestoesPorCartela ?? state.bingoParams.numQuestoesPorCartela),
            minRepeticoes: Number(data.bingoParams?.minRepeticoes ?? state.bingoParams.minRepeticoes),
            maxRepeticoes: Number(data.bingoParams?.maxRepeticoes ?? state.bingoParams.maxRepeticoes)
        };
        state.generatedQuestions = Array.isArray(data.generatedQuestions) ? data.generatedQuestions : [];
        state.generatedCards = Array.isArray(data.generatedCards) ? data.generatedCards : [];
        state.cardDisplayMode = data.cardDisplayMode === "aluno" ? "aluno" : "professor";
        state.visualTheme = { ...state.visualTheme, ...(data.visualTheme || {}) };
        state.customTopicCounter = Number(data.customTopicCounter || 0);
        state.customEquationCounter = Number(data.customEquationCounter || 0);
        state.questionCounter = Number(data.questionCounter || 0);

        return true;
    }

    async function importConfiguration(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const parsed = JSON.parse(text);

            if (parsed?.app !== "BingoAlgebrico" || !parsed?.version) {
                showToast("Arquivo inválido ou não reconhecido.");
                return;
            }

            if (parsed.type && parsed.type !== EXPORT_TYPES.CONFIGURACAO) {
                showToast("Arquivo incorreto: use a tela Persistência para importar apenas dados customizados.");
                return;
            }

            if (parsed.version > EXPORT_VERSIONS.CONFIGURACAO) {
                showToast(`Arquivo de versão ${parsed.version} não suportada (máx: ${EXPORT_VERSIONS.CONFIGURACAO}). Atualize a aplicação.`);
                return;
            }

            const importedData = parsed?.data;

            if (!hydrateStateFromImportedData(importedData)) {
                showToast("Arquivo inválido para importação.");
                return;
            }

            applyThemeToUI();
            saveState();
            renderAll();
            navigateTo(state.currentScreen || "inicio");
            showToast("Configuração importada com sucesso.");
        } catch (error) {
            console.error(error);
            showToast("Falha ao importar configuração.");
        } finally {
            if (elements.inputImportarConfiguracao) {
                elements.inputImportarConfiguracao.value = "";
            }
        }
    }

    // ─── Wiring de ações ─────────────────────────────────────────────────────────

    function wireActions() {
        [
            elements.temaNomeBingo,
            elements.temaNomeInstituicao,
            elements.temaCorPrimaria,
            elements.temaCorDestaque,
            elements.temaCorFundo
        ].forEach((inputElement) => {
            inputElement?.addEventListener("input", () => {
                syncThemeFromInputs();
                applyThemeToUI();
                saveState();
                render();
            });
        });

        elements.botaoAplicarTema?.addEventListener("click", () => {
            syncThemeFromInputs();
            applyThemeToUI();
            saveState();
            render();
            showToast("Tema aplicado.");
        });

        elements.botaoRestaurarTema?.addEventListener("click", () => {
            state.visualTheme = { ...DEFAULT_VISUAL_THEME };
            applyThemeToUI();
            saveState();
            renderAll();
            showToast("Tema restaurado para o padr\u00e3o.");
        });

        elements.botaoExportarConfiguracao?.addEventListener("click", exportConfiguration);

        elements.botaoImportarConfiguracao?.addEventListener("click", () => {
            elements.inputImportarConfiguracao?.click();
        });

        elements.inputImportarConfiguracao?.addEventListener("change", importConfiguration);
    }

    return { render, applyThemeToUI, syncThemeFromInputs, exportConfiguration, importConfiguration, wireActions };
}
