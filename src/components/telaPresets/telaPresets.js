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
        description: "Operações básicas com números inteiros: soma e divisão.",
        icon: "fa-calculator",
        equations: ["Soma", "Divisão"],
        restrictions: {
            "Soma":    { A: { min: 1, max: 15, tipo: "inteiro" }, B: { min: 1, max: 15, tipo: "inteiro" } },
            "Divisão": { A: { min: 1, max: 15, tipo: "inteiro" }, B: { min: 1, max: 10, tipo: "inteiro" } }
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

    let activePresetId = null;
    let cardElements = [];

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
        cardElements.forEach(({ card, preset }) => {
            card.classList.toggle("selected", preset.id === activePresetId);
        });
    }

    function applyPreset(preset) {
        activePresetId = preset.id;
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
            state.bingoParams = { ...state.bingoParams, ...preset.bingoParams };
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

        cardElements = PRESETS.map((preset) => {
            const topicNames = getTopicNamesForPreset(preset);
            const badges = topicNames.map((name) => `<span class="badge">${name}</span>`).join("");

            const card = document.createElement("article");
            card.className = `presetCard${preset.id === activePresetId ? " selected" : ""}`;

            if (preset.customSelection) {
                card.innerHTML = `
                    <div class="presetIcon"><i class="fas ${preset.icon}"></i></div>
                    <span class="presetTitle">${preset.title}</span>
                    <p class="presetDescription">${preset.description}</p>
                    <div class="presetFooter">
                        <div class="presetTags"></div>
                        <span class="presetAction">Selecionar <i class="fas fa-arrow-right"></i></span>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="presetIcon"><i class="fas ${preset.icon}"></i></div>
                    <span class="presetTitle">${preset.title}</span>
                    <p class="presetDescription">${preset.description}</p>
                    <div class="presetFooter">
                        <div class="presetTags">${badges}</div>
                        <span class="presetAction">Aplicar <i class="fas fa-arrow-right"></i></span>
                    </div>
                `;
            }

            card.addEventListener("click", () => applyPreset(preset));
            return { card, preset };
        });

        elements.presetsContainer.innerHTML = "";
        cardElements.forEach(({ card }) => elements.presetsContainer.appendChild(card));
    }

    function selectCustom() {
        activePresetId = "customizado";
        updateSelectedVisual();
    }

    return { render, selectCustom };
}
