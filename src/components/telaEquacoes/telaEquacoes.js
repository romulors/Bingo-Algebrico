import { RESPONSE_FORMULA_BY_EQUATION } from "../../app/constants.js";
import { extractVariables } from "../../app/services/data-loader.js";
import { debounce, renderMath } from "../../app/utils/ui.js";

export function createTelaEquacoes({ elements, state, renderAll, saveState, showToast, navigateTo, onFocusRestricoes, onManualConfigChange }) {
    function updateEquationPreview() {
        if (!elements.equacaoPreviewMath) return;
        const model = (elements.inputNovaEquacaoModelo?.value || "").trim();
        const response = (elements.inputNovaEquacaoResposta?.value || "").trim();
        const content = model || response ? `\\(${model || "?"} = ${response || "?"}\\)` : "&nbsp;";
        elements.equacaoPreviewMath.innerHTML = content;
        renderMath(elements.equacaoPreviewMath);
    }

    const debouncedUpdateEquationPreview = debounce(updateEquationPreview, 80);

    function focusEquationRestrictions(equationId) {
        state.focusedRestrictionEquationId = equationId;
        navigateTo("restricoes");
        if (typeof onFocusRestricoes === "function") {
            onFocusRestricoes();
        }

        requestAnimationFrame(() => {
            const row = elements.restricoesContainer?.querySelector(`[data-equation-id="${equationId}"]`);
            row?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    }

    function startEditingEquation(equationId) {
        const equation = state.equations.find((eq) => eq.id === equationId);
        if (!equation) return;

        state.editingEquationId = equationId;

        if (elements.inputNovaEquacaoTopico) elements.inputNovaEquacaoTopico.value = equation.topicId || "";
        if (elements.inputNovaEquacaoNome) elements.inputNovaEquacaoNome.value = equation.name || "";
        if (elements.inputNovaEquacaoModelo) elements.inputNovaEquacaoModelo.value = equation.model || "";
        if (elements.inputNovaEquacaoResposta) elements.inputNovaEquacaoResposta.value = equation.responseModel || "";
        if (elements.inputNovaEquacaoFormula) elements.inputNovaEquacaoFormula.value = equation.formulaResposta || "";

        if (elements.botaoAdicionarEquacao) elements.botaoAdicionarEquacao.textContent = "Salvar alteração";

        navigateTo("equacoes");

        if (elements.equacaoFormPanel) elements.equacaoFormPanel.style.display = "block";
        if (elements.botaoMostrarFormEquacao) elements.botaoMostrarFormEquacao.textContent = "Fechar formulário";

        requestAnimationFrame(() => {
            updateEquationPreview();
            elements.inputNovaEquacaoNome?.focus();
        });
    }

    function renderEquationTopicOptions() {
        if (!elements.inputNovaEquacaoTopico) return;

        const selectedTopics = state.topics.filter((topic) => topic.selected);

        if (!selectedTopics.length) {
            elements.inputNovaEquacaoTopico.innerHTML = "<option value=\"\">Selecione um tópico antes</option>";
            return;
        }

        const currentValue = elements.inputNovaEquacaoTopico.value;
        elements.inputNovaEquacaoTopico.innerHTML = selectedTopics
            .map((topic) => `<option value="${topic.id}">${topic.name}</option>`)
            .join("");

        const stillExists = selectedTopics.some((topic) => topic.id === currentValue);
        elements.inputNovaEquacaoTopico.value = stillExists ? currentValue : selectedTopics[0].id;
    }

    function render() {
        if (!elements.equationsList) return;

        const selectedTopicIds = new Set(state.topics.filter((t) => t.selected).map((t) => t.id));
        const available = state.equations.filter((equation) => selectedTopicIds.has(equation.topicId));

        elements.equationsList.innerHTML = "";

        if (available.length === 0) {
            elements.equationsList.innerHTML = "<p class=\"empty-state\">Selecione ao menos um tópico para visualizar equações.</p>";
            return;
        }

        available.forEach((equation) => {
            const topic = state.topics.find((topicItem) => topicItem.id === equation.topicId);
            const card = document.createElement("article");
            card.className = `equationCard ${equation.selected ? "selected" : ""}`;

            card.innerHTML = `
                <span class="renderEquation">\\(${equation.model} = ${equation.responseModel}\\)</span>
                <span class="equationName">${equation.name}</span>
                <div class="equationFooter">
                    <span class="badge">${topic ? topic.name : "Sem tópico"}</span>
                    <span class="equationStatus">${equation.selected ? "Adicionada" : "Não adicionada"}</span>
                    <span class="equationActions">
                        <span class="icon-btn primary editEquationRestrictionsButton" title="Editar definição da equação"><i class="fas fa-wrench"></i></span>
                        <span class="icon-btn danger deleteEquationButton" title="Remover equação"><i class="fas fa-xmark"></i></span>
                    </span>
                </div>
                <div class="equationLinkRow">
                    <button class="text-link-button viewRestrictionsLink" type="button">Abrir restrições</button>
                </div>
            `;

            card.addEventListener("click", () => {
                equation.selected = !equation.selected;
                onManualConfigChange?.();
                renderAll();
                saveState();
            });

            card.querySelector(".editEquationRestrictionsButton").addEventListener("click", (event) => {
                event.stopPropagation();
                startEditingEquation(equation.id);
            });

            card.querySelector(".deleteEquationButton").addEventListener("click", (event) => {
                event.stopPropagation();
                removeEquation(equation.id);
            });

            card.querySelector(".viewRestrictionsLink").addEventListener("click", (event) => {
                event.stopPropagation();
                focusEquationRestrictions(equation.id);
            });

            elements.equationsList.appendChild(card);
        });

        renderMath(elements.equationsList);
    }

    function addCustomEquation() {
        const selectedTopics = state.topics.filter((topic) => topic.selected);

        if (selectedTopics.length === 0) {
            showToast("Selecione ao menos um tópico antes de criar equações.");
            return;
        }

        const topicId = elements.inputNovaEquacaoTopico?.value || "";
        const topic = selectedTopics.find((item) => item.id === topicId) || selectedTopics[0];
        const equationName = elements.inputNovaEquacaoNome?.value || "";

        if (!equationName || !equationName.trim()) {
            showToast("Informe o nome da equação.");
            return;
        }

        const model = elements.inputNovaEquacaoModelo?.value || "";
        const responseModel = elements.inputNovaEquacaoResposta?.value || "";

        if (!model || !responseModel) {
            showToast("Preencha modelo e resposta da equação.");
            return;
        }

        const formulaResposta = RESPONSE_FORMULA_BY_EQUATION[equationName] || elements.inputNovaEquacaoFormula?.value || "";

        if (!formulaResposta.trim()) {
            showToast("Preencha a fórmula da resposta. Ex.: (A*D+B*C)/(B*D)");
            return;
        }

        if (state.editingEquationId) {
            const eq = state.equations.find((item) => item.id === state.editingEquationId);
            if (eq) {
                eq.topicId = topic.id;
                eq.name = equationName.trim();
                eq.model = model.trim();
                eq.responseModel = responseModel.trim();
                eq.formulaResposta = formulaResposta.trim();
                eq.variables = extractVariables(`${model} ${responseModel}`);
                eq.selected = true;
                // Promote default equations edited by the user to "custom" so
                // mergeState does not overwrite their changes on the next page load
                if (eq.source === "default") {
                    eq.source = "custom";
                }
                state.editingEquationId = null;
                if (elements.botaoAdicionarEquacao) elements.botaoAdicionarEquacao.textContent = "Adicionar Equação";
                renderAll();
                saveState();
                showToast("Equação atualizada.");
            }
            _clearForm();
            return;
        }

        state.customEquationCounter += 1;

        state.equations.push({
            id: `eq::custom::${state.customEquationCounter}`,
            topicId: topic.id,
            name: equationName.trim(),
            model: model.trim(),
            responseModel: responseModel.trim(),
            formulaResposta: formulaResposta.trim(),
            variables: extractVariables(`${model} ${responseModel}`),
            selected: true,
            source: "custom"
        });

        _clearForm();
        renderAll();
        saveState();
        showToast("Equação adicionada.");
    }

    function removeEquation(equationId) {
        const equation = state.equations.find((item) => item.id === equationId);
        if (!equation) return;

        const confirmed = confirm(`Remover a equação "${equation.name}"?`);
        if (!confirmed) return;

        state.equations = state.equations.filter((item) => item.id !== equationId);

        Object.keys(state.restrictions).forEach((key) => {
            if (key.startsWith(`${equationId}::`)) {
                delete state.restrictions[key];
            }
        });

        renderAll();
        saveState();
        showToast("Equação removida.");
    }

    function _clearForm() {
        if (elements.inputNovaEquacaoNome) elements.inputNovaEquacaoNome.value = "";
        if (elements.inputNovaEquacaoModelo) elements.inputNovaEquacaoModelo.value = "";
        if (elements.inputNovaEquacaoResposta) elements.inputNovaEquacaoResposta.value = "";
        if (elements.inputNovaEquacaoFormula) elements.inputNovaEquacaoFormula.value = "";
        if (elements.equacaoFormPanel) elements.equacaoFormPanel.style.display = "none";
        if (elements.botaoMostrarFormEquacao) elements.botaoMostrarFormEquacao.textContent = "Novo Modelo de Equação";
        if (elements.equacaoPreviewMath) elements.equacaoPreviewMath.innerHTML = "&nbsp;";
    }

    function wireFormActions() {
        elements.botaoAdicionarEquacao?.addEventListener("click", addCustomEquation);

        [
            elements.inputNovaEquacaoNome,
            elements.inputNovaEquacaoModelo,
            elements.inputNovaEquacaoResposta,
            elements.inputNovaEquacaoFormula
        ].forEach((inputElement) => {
            inputElement?.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    addCustomEquation();
                }
            });
        });

        [elements.inputNovaEquacaoModelo, elements.inputNovaEquacaoResposta].forEach((inputEl) => {
            inputEl?.addEventListener("input", () => {
                debouncedUpdateEquationPreview();
                if (inputEl === elements.inputNovaEquacaoModelo && !elements.inputNovaEquacaoFormula?.value) {
                    if (elements.inputNovaEquacaoFormula) {
                        elements.inputNovaEquacaoFormula.value = elements.inputNovaEquacaoModelo.value;
                    }
                }
            });
        });

        elements.botaoSalvarEquacoes?.addEventListener("click", () => {
            saveState();
            showToast("Equações salvas.");
        });

        elements.botaoMostrarFormEquacao?.addEventListener("click", () => {
            if (!elements.equacaoFormPanel) return;
            const isVisible = elements.equacaoFormPanel.style.display !== "none" && elements.equacaoFormPanel.style.display !== "";
            if (isVisible) {
                elements.equacaoFormPanel.style.display = "none";
                state.editingEquationId = null;
                if (elements.botaoAdicionarEquacao) elements.botaoAdicionarEquacao.textContent = "Adicionar Equação";
                if (elements.botaoMostrarFormEquacao) elements.botaoMostrarFormEquacao.textContent = "Novo Modelo de Equação";
            } else {
                elements.equacaoFormPanel.style.display = "block";
                state.editingEquationId = null;
                if (elements.botaoAdicionarEquacao) elements.botaoAdicionarEquacao.textContent = "Adicionar Equação";
                if (elements.botaoMostrarFormEquacao) elements.botaoMostrarFormEquacao.textContent = "Fechar formulário";
                requestAnimationFrame(() => {
                    elements.inputNovaEquacaoNome?.focus();
                    updateEquationPreview();
                });
            }
        });
    }

    return {
        render,
        renderEquationTopicOptions,
        addCustomEquation,
        removeEquation,
        startEditingEquation,
        focusEquationRestrictions,
        updateEquationPreview,
        wireFormActions
    };
}
