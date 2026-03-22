"use strict";

const STORAGE_KEY = "bingoAlgebrico.v1";
const TOAST_DURATION_MS = 2200;

const DEFAULT_DATA_FILES = [
    "src/data/fracoes_soma.json",
    "src/data/fracoes_subtracao.json",
    "src/data/fracoes_multiplicacao.json",
    "src/data/fracoes_divisao.json"
];

const RESPONSE_FORMULA_BY_EQUATION = {
    "Soma de Frações": "(A*D + B*C)/(B*D)",
    "Subtração de Frações": "(A*D - B*C)/(B*D)",
    "Multiplicação de Frações": "(A*C)/(B*D)",
    "Divisão de Frações": "(A*D)/(B*C)"
};

const FLOW_STEPS = [
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
        screen: "cartelas",
        title: "Gerar cartelas",
        description: "Monte cartelas nas versões professor e aluno com base nas questões geradas."
    },
    {
        screen: "final",
        title: "Finalizar visual",
        description: "Personalize o tema e exporte ou importe a configuração do bingo quando necessário."
    }
];

const state = {
    currentScreen: "inicio",
    topics: [],
    equations: [],
    restrictions: {},
    bingoParams: {
        numQuestoesUnicas: 20,
        numCartelas: 20,
        numQuestoesPorCartela: 6,
        minRepeticoes: 2,
        maxRepeticoes: 5
    },
    generatedQuestions: [],
    generatedCards: [],
    cardDisplayMode: "professor",
    visualTheme: {
        nomeBingo: "BINGO ALGÉBRICO",
        nomeInstituicao: "",
        corPrimaria: "#03233e",
        corDestaque: "#64b0f2",
        corFundo: "#f3f4fa"
    },
    customTopicCounter: 0,
    customEquationCounter: 0,
    questionCounter: 0,
    focusedRestrictionEquationId: ""
    ,editingEquationId: null
};

const elements = {
    // Will be initialized in `initialize()` to ensure DOM is ready
    navMenu: null,
    navItems: null,
    screens: null,
    inicioStatus: null,
    inicioFlow: null,
    botaoIrTopicos: null,

    topicsList: null,
    inputNovoTopicoNome: null,
    botaoAdicionarNovoTopico: null,
    botaoSalvarTopicos: null,

    equationsList: null,
    inputNovaEquacaoTopico: null,
    inputNovaEquacaoNome: null,
    inputNovaEquacaoModelo: null,
    inputNovaEquacaoResposta: null,
    inputNovaEquacaoFormula: null,
    botaoAdicionarEquacao: null,
    botaoMostrarFormEquacao: null,
    equacaoFormPanel: null,
    equacaoPreview: null,
    equacaoPreviewMath: null,
    botaoSalvarEquacoes: null,

    restricoesContainer: null,
    botaoSalvarRestricoes: null,

    paramNumQuestoesUnicas: null,
    paramNumCartelas: null,
    paramNumQuestoesPorCartela: null,
    paramMinRepeticoes: null,
    paramMaxRepeticoes: null,
    bingoValidationMessage: null,
    botaoSalvarParametrosBingo: null,
    botaoGerarQuestoes: null,

    questoesResumo: null,
    questoesContainer: null,
    botaoRegenerarQuestoes: null,

    cartelasResumo: null,
    cartelasContainer: null,
    botaoGerarCartelas: null,
    botaoAlternarModoCartela: null,
    botaoImprimirCartelas: null,

    temaNomeBingo: null,
    temaNomeInstituicao: null,
    temaCorPrimaria: null,
    temaCorDestaque: null,
    temaCorFundo: null,
    finalResumo: null,
    botaoAplicarTema: null,
    botaoExportarConfiguracao: null,
    botaoImportarConfiguracao: null,
    inputImportarConfiguracao: null
};

function bindDOMElements() {
    elements.navMenu = document.getElementById("nav-menu");
    elements.navItems = Array.from(document.querySelectorAll(".nav-menu-item"));
    elements.screens = Array.from(document.querySelectorAll(".page-content"));
    elements.inicioStatus = document.getElementById("inicioStatus");
    elements.inicioFlow = document.getElementById("inicioFlow");
    elements.botaoIrTopicos = document.getElementById("botaoIrTopicos");

    elements.topicsList = document.getElementById("topicsList");
    elements.inputNovoTopicoNome = document.getElementById("inputNovoTopicoNome");
    elements.botaoAdicionarNovoTopico = document.getElementById("botaoAdicionarNovoTopico");
    elements.botaoSalvarTopicos = document.getElementById("botaoSalvarTopicos");

    elements.equationsList = document.getElementById("equationsList");
    elements.inputNovaEquacaoTopico = document.getElementById("inputNovaEquacaoTopico");
    elements.inputNovaEquacaoNome = document.getElementById("inputNovaEquacaoNome");
    elements.inputNovaEquacaoModelo = document.getElementById("inputNovaEquacaoModelo");
    elements.inputNovaEquacaoResposta = document.getElementById("inputNovaEquacaoResposta");
    elements.inputNovaEquacaoFormula = document.getElementById("inputNovaEquacaoFormula");
    elements.botaoAdicionarEquacao = document.getElementById("botaoAdicionarEquacao");
    elements.botaoMostrarFormEquacao = document.getElementById("botaoMostrarFormEquacao");
    elements.equacaoFormPanel = document.getElementById("equacaoFormPanel");
    elements.equacaoPreview = document.getElementById("equacaoPreview");
    elements.equacaoPreviewMath = document.getElementById("equacaoPreviewMath");
    elements.botaoSalvarEquacoes = document.getElementById("botaoSalvarEquacoes");

    elements.restricoesContainer = document.getElementById("restricoesContainer");
    elements.botaoSalvarRestricoes = document.getElementById("botaoSalvarRestricoes");

    elements.paramNumQuestoesUnicas = document.getElementById("paramNumQuestoesUnicas");
    elements.paramNumCartelas = document.getElementById("paramNumCartelas");
    elements.paramNumQuestoesPorCartela = document.getElementById("paramNumQuestoesPorCartela");
    elements.paramMinRepeticoes = document.getElementById("paramMinRepeticoes");
    elements.paramMaxRepeticoes = document.getElementById("paramMaxRepeticoes");
    elements.bingoValidationMessage = document.getElementById("bingoValidationMessage");
    elements.botaoSalvarParametrosBingo = document.getElementById("botaoSalvarParametrosBingo");
    elements.botaoGerarQuestoes = document.getElementById("botaoGerarQuestoes");

    elements.questoesResumo = document.getElementById("questoesResumo");
    elements.questoesContainer = document.getElementById("questoesContainer");
    elements.botaoRegenerarQuestoes = document.getElementById("botaoRegenerarQuestoes");

    elements.cartelasResumo = document.getElementById("cartelasResumo");
    elements.cartelasContainer = document.getElementById("cartelasContainer");
    elements.botaoGerarCartelas = document.getElementById("botaoGerarCartelas");
    elements.botaoAlternarModoCartela = document.getElementById("botaoAlternarModoCartela");
    elements.botaoImprimirCartelas = document.getElementById("botaoImprimirCartelas");

    elements.temaNomeBingo = document.getElementById("temaNomeBingo");
    elements.temaNomeInstituicao = document.getElementById("temaNomeInstituicao");
    elements.temaCorPrimaria = document.getElementById("temaCorPrimaria");
    elements.temaCorDestaque = document.getElementById("temaCorDestaque");
    elements.temaCorFundo = document.getElementById("temaCorFundo");
    elements.finalResumo = document.getElementById("finalResumo");
    elements.botaoAplicarTema = document.getElementById("botaoAplicarTema");
    elements.botaoExportarConfiguracao = document.getElementById("botaoExportarConfiguracao");
    elements.botaoImportarConfiguracao = document.getElementById("botaoImportarConfiguracao");
    elements.inputImportarConfiguracao = document.getElementById("inputImportarConfiguracao");
    elements.appMessage = document.getElementById("appMessage");
    elements.appMessageText = document.getElementById("appMessageText");
    elements.appMessageAction = document.getElementById("appMessageAction");

    // Ensure nav items are focusable for keyboard support
    elements.navItems.forEach((item) => {
        if (!item.hasAttribute("tabindex")) item.setAttribute("tabindex", "0");
        if (!item.hasAttribute("role")) item.setAttribute("role", "button");
    });
}

function showPersistentMessage(text, actionLabel, actionCallback) {
    if (!elements.appMessage) return;
    elements.appMessageText.textContent = text;
    if (actionLabel && actionCallback) {
        elements.appMessageAction.style.display = "inline-block";
        elements.appMessageAction.textContent = actionLabel;
        elements.appMessageAction.onclick = actionCallback;
    } else {
        elements.appMessageAction.style.display = "none";
        elements.appMessageAction.onclick = null;
    }
    elements.appMessage.style.display = "block";
}

function clearPersistentMessage() {
    if (!elements.appMessage) return;
    elements.appMessage.style.display = "none";
    elements.appMessageText.textContent = "";
    elements.appMessageAction.onclick = null;
}

function parseHash(hash) {
    const raw = (hash || "").replace(/^#/, "");
    if (!raw) return { screen: "", params: {} };
    const [screenPart, query] = raw.split("?");
    const params = {};
    if (query) {
        const pairs = new URLSearchParams(query);
        for (const [k, v] of pairs.entries()) params[k] = v;
    }
    return { screen: screenPart, params };
}

const MathUtils = {
    gcd(a, b) {
        let x = Math.abs(a);
        let y = Math.abs(b);

        while (y !== 0) {
            const t = y;
            y = x % y;
            x = t;
        }

        return x || 1;
    },

    simplifyFraction(numerator, denominator) {
        if (denominator === 0) {
            return "Indefinido";
        }

        const divisor = this.gcd(numerator, denominator);
        const simplifiedNumerator = numerator / divisor;
        const simplifiedDenominator = denominator / divisor;

        if (simplifiedDenominator === 1) {
            return `${simplifiedNumerator}`;
        }

        return `${simplifiedNumerator}/${simplifiedDenominator}`;
    },

    evaluateFormula(formula, values) {
        try {
            const result = math.evaluate(formula, values);

            if (typeof result === "number") {
                if (Number.isInteger(result)) {
                    return String(result);
                }

                const tolerance = 1e-10;
                const denominatorLimit = 1000;

                for (let denominator = 1; denominator <= denominatorLimit; denominator += 1) {
                    const numerator = result * denominator;

                    if (Math.abs(numerator - Math.round(numerator)) < tolerance) {
                        return this.simplifyFraction(Math.round(numerator), denominator);
                    }
                }

                return result.toFixed(2).replace(".", ",");
            }

            return String(result);
        } catch (error) {
            console.error("Erro ao avaliar fórmula:", error);
            return "Erro";
        }
    }
};

const DataLoader = {
    async loadDefaultEquations() {
        const requests = DEFAULT_DATA_FILES.map(async (filePath) => {
            try {
                const response = await fetch(filePath);

                if (!response.ok) {
                    console.warn(`Falha ao carregar ${filePath}: status ${response.status}`);
                    return null;
                }

                const data = await response.json();
                return this.normalizeEquationData(data, filePath);
            } catch (error) {
                console.warn(`Erro ao buscar ${filePath}:`, error);
                return null;
            }
        });

        const results = await Promise.all(requests);
        return results.filter(Boolean);
    },

    normalizeEquationData(data, sourceFile) {
        const topicName = (data.nomeTopico || "Tópico").trim();
        const equationName = (data.nomeEquacao || "Equação").trim();
        const model = (data.modeloEquacao || data.modelo || "A + B").trim();
        const responseModel = (data.resposta || "R").trim();
        const formulaResposta = RESPONSE_FORMULA_BY_EQUATION[equationName] || "A+B";
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
};

function slugify(value) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

function extractVariables(expression) {
    const matches = expression.match(/[A-Z]/g) || [];
    return [...new Set(matches)];
}

function saveState() {
    const payload = {
        currentScreen: state.currentScreen,
        topics: state.topics,
        equations: state.equations,
        restrictions: state.restrictions,
        bingoParams: state.bingoParams,
        generatedQuestions: state.generatedQuestions,
        generatedCards: state.generatedCards,
        cardDisplayMode: state.cardDisplayMode,
        visualTheme: state.visualTheme,
        customTopicCounter: state.customTopicCounter,
        customEquationCounter: state.customEquationCounter,
        questionCounter: state.questionCounter
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadSavedState() {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        console.warn("Falha ao carregar estado salvo:", error);
        return null;
    }
}

function mergeState(defaultTopics, defaultEquations) {
    const saved = loadSavedState();
    const defaultTopicMap = new Map(defaultTopics.map((topic) => [topic.id, topic]));
    const defaultEquationMap = new Map(defaultEquations.map((equation) => [equation.id, equation]));

    if (!saved) {
        state.topics = defaultTopics;
        state.equations = defaultEquations;
        return;
    }

    const mergedTopics = [];

    defaultTopics.forEach((topic) => {
        const savedTopic = (saved.topics || []).find((item) => item.id === topic.id);

        mergedTopics.push(savedTopic ? { ...topic, ...savedTopic } : topic);
    });

    (saved.topics || [])
        .filter((topic) => topic.source === "custom")
        .forEach((topic) => mergedTopics.push(topic));

    const mergedEquations = [];

    defaultEquations.forEach((equation) => {
        const savedEquation = (saved.equations || []).find((item) => item.id === equation.id);

        mergedEquations.push(savedEquation ? { ...equation, ...savedEquation } : equation);
    });

    (saved.equations || [])
        .filter((equation) => equation.source === "custom")
        .forEach((equation) => mergedEquations.push(equation));

    state.topics = mergedTopics.filter((topic) => topic && topic.id && !isDuplicateById(topic.id, mergedTopics, topic));
    state.equations = mergedEquations.filter((equation) => equation && equation.id && !isDuplicateById(equation.id, mergedEquations, equation));
    state.restrictions = saved.restrictions || {};
    state.bingoParams = {
        ...state.bingoParams,
        ...(saved.bingoParams || {})
    };
    state.generatedQuestions = Array.isArray(saved.generatedQuestions) ? saved.generatedQuestions : [];
    state.generatedCards = Array.isArray(saved.generatedCards) ? saved.generatedCards : [];
    state.cardDisplayMode = saved.cardDisplayMode === "aluno" ? "aluno" : "professor";
    state.visualTheme = {
        ...state.visualTheme,
        ...(saved.visualTheme || {})
    };
    state.currentScreen = saved.currentScreen || "inicio";
    state.customTopicCounter = Number(saved.customTopicCounter || 0);
    state.customEquationCounter = Number(saved.customEquationCounter || 0);
    state.questionCounter = Number(saved.questionCounter || state.generatedQuestions.length || 0);

    defaultTopicMap.clear();
    defaultEquationMap.clear();
}

function isDuplicateById(id, list, currentItem) {
    const first = list.find((item) => item.id === id);
    return first !== currentItem;
}

function setupNavigation() {
    if (!elements.navMenu) {
        return;
    }

    // Delegate clicks on the nav container to avoid per-item listeners
    const onNavClick = (ev) => {
        // prevent anchor default to centralize navigation handling
        if (ev.defaultPrevented) return;
        ev.preventDefault();

        const item = ev.target.closest?.(".nav-menu-item");
        if (!item || !elements.navMenu.contains(item)) return;

        const target = item.dataset.target;
        if (!target) return;

        navigateTo(target);
        try {
            history.pushState({ screen: target }, "", `#${target}`);
        } catch (e) {
            location.hash = `#${target}`;
        }
    };

    elements.navMenu.removeEventListener("click", onNavClick);
    elements.navMenu.addEventListener("click", onNavClick);

    // keyboard accessibility: activate with Enter/Space
    const onNavKey = (ev) => {
        if (ev.key !== "Enter" && ev.key !== " ") return;
        const item = ev.target.closest?.(".nav-menu-item");
        if (!item) return;
        ev.preventDefault();
        const target = item.dataset.target;
        if (target) {
            navigateTo(target);
            try {
                history.pushState({ screen: target }, "", `#${target}`);
            } catch (e) {
                location.hash = `#${target}`;
            }
        }
    };

    elements.navMenu.removeEventListener("keydown", onNavKey);
    elements.navMenu.addEventListener("keydown", onNavKey);

    // react to hash changes (back/forward)
    window.removeEventListener("hashchange", onHashChange);
    window.addEventListener("hashchange", onHashChange);

    // Wire quick action button to navigate via the same flow
    if (elements.botaoIrTopicos) {
        elements.botaoIrTopicos.removeEventListener("click", onBotaoIrTopicos);
        elements.botaoIrTopicos.addEventListener("click", onBotaoIrTopicos);
    }
}

function navigateTo(screenName) {
    state.currentScreen = screenName;

    // Update visual active classes
    if (elements.navItems) {
        elements.navItems.forEach((item) => {
            const isActive = item.dataset.target === screenName;
            item.classList.toggle("active", isActive);
            if (isActive) {
                item.setAttribute("aria-current", "page");
            } else {
                item.removeAttribute("aria-current");
            }
        });
    }

    if (elements.screens) {
        elements.screens.forEach((screen) => {
            const show = screen.dataset.screen === screenName;
            screen.classList.toggle("active", show);
            screen.setAttribute("aria-hidden", show ? "false" : "true");
        });
    }

    // Move focus to the main heading of the newly shown screen for accessibility
    if (elements.screens) {
        const activeScreen = elements.screens.find((s) => s.dataset.screen === screenName);
        if (activeScreen) {
            let focusTarget = activeScreen.querySelector("h2") || activeScreen.querySelector("button, [tabindex], a, input, select, textarea");
            if (focusTarget) {
                if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
                focusTarget.focus();
            }
        }
    }

    if (screenName !== "restricoes") {
        state.focusedRestrictionEquationId = "";
    }

    saveState();
}

function onHashChange() {
    const { screen, params } = parseHash(location.hash);
    if (screen && screen !== state.currentScreen) {
        navigateTo(screen);
        if (params.mode && screen === "cartelas") {
            state.cardDisplayMode = params.mode;
            renderCartelas();
        }
    }
}

function onBotaoIrTopicos() {
    navigateTo("topicos");
    try {
        history.pushState({ screen: "topicos" }, "", "#topicos");
    } catch (e) {
        location.hash = "#topicos";
    }
}

function showToast(message) {
    let toast = document.querySelector(".toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("visible");

    setTimeout(() => {
        toast.classList.remove("visible");
    }, TOAST_DURATION_MS);
}

function renderInicioStatus() {
    if (!elements.inicioStatus) {
        return;
    }

    const selectedTopics = state.topics.filter((topic) => topic.selected).length;
    const selectedEquations = state.equations.filter((equation) => equation.selected).length;
    const restrictedVars = Object.keys(state.restrictions).length;
    const generatedQuestions = state.generatedQuestions.length;
    const generatedCards = state.generatedCards.length;

    elements.inicioStatus.innerHTML = `
        <div class="status-card">
            <span class="label">Tópicos selecionados</span>
            <span class="value">${selectedTopics}</span>
        </div>
        <div class="status-card">
            <span class="label">Equações selecionadas</span>
            <span class="value">${selectedEquations}</span>
        </div>
        <div class="status-card">
            <span class="label">Variáveis com restrição</span>
            <span class="value">${restrictedVars}</span>
        </div>
        <div class="status-card">
            <span class="label">Questões geradas</span>
            <span class="value">${generatedQuestions}</span>
        </div>
        <div class="status-card">
            <span class="label">Cartelas geradas</span>
            <span class="value">${generatedCards}</span>
        </div>
    `;
}

function getSelectedEquations() {
    return state.equations.filter((equation) => equation.selected);
}

function countConfiguredRestrictions() {
    return getSelectedEquations().reduce((total, equation) => {
        const configured = Object.keys(state.restrictions).filter((key) => key.startsWith(`${equation.id}::`)).length;
        return total + configured;
    }, 0);
}

function countRequiredRestrictions() {
    return getSelectedEquations().reduce((total, equation) => total + equation.variables.length, 0);
}

function getFlowStepState(screenName) {
    const selectedTopics = state.topics.filter((topic) => topic.selected).length;
    const selectedEquations = getSelectedEquations().length;
    const configuredRestrictions = countConfiguredRestrictions();
    const requiredRestrictions = countRequiredRestrictions();
    const bingoError = validateBingoParams();

    switch (screenName) {
        case "topicos":
            return selectedTopics > 0
                ? { label: "Concluida", tone: "done" }
                : { label: "Pendente", tone: "pending" };
        case "equacoes":
            return selectedEquations > 0
                ? { label: "Concluida", tone: "done" }
                : { label: "Pendente", tone: "pending" };
        case "restricoes":
            if (requiredRestrictions === 0) {
                return { label: "Aguardando equacoes", tone: "pending" };
            }

            if (configuredRestrictions >= requiredRestrictions) {
                return { label: "Concluida", tone: "done" };
            }

            if (configuredRestrictions > 0) {
                return { label: "Em andamento", tone: "in-progress" };
            }

            return { label: "Pendente", tone: "pending" };
        case "bingo":
            return bingoError
                ? { label: "Revisar parametros", tone: "warning" }
                : { label: "Concluida", tone: "done" };
        case "questoes":
            return state.generatedQuestions.length > 0
                ? { label: "Concluida", tone: "done" }
                : { label: "Pendente", tone: "pending" };
        case "cartelas":
            return state.generatedCards.length > 0
                ? { label: "Concluida", tone: "done" }
                : { label: "Pendente", tone: "pending" };
        case "final":
            return { label: "Opcional", tone: "optional" };
        default:
            return { label: "Pendente", tone: "pending" };
    }
}

function renderInicioFlow() {
    if (!elements.inicioFlow) {
        return;
    }

    const firstPendingScreen = FLOW_STEPS.find((step) => getFlowStepState(step.screen).tone !== "done")?.screen;

    elements.inicioFlow.innerHTML = FLOW_STEPS.map((step, index) => {
        const status = getFlowStepState(step.screen);
        const isOpen = firstPendingScreen ? firstPendingScreen === step.screen : index === 0;

        return `
            <details class="flow-step flow-step-${status.tone}" ${isOpen ? "open" : ""}>
                <summary>
                    <span class="flow-index">${String(index + 1).padStart(2, "0")}</span>
                    <span class="flow-main">
                        <strong>${step.title}</strong>
                        <span>${status.label}</span>
                    </span>
                </summary>
                <p>${step.description}</p>
                <button class="botao botao-secundario flow-link-button" type="button" data-screen="${step.screen}">
                    Abrir etapa
                </button>
            </details>
        `;
    }).join("");

    elements.inicioFlow.querySelectorAll(".flow-link-button").forEach((button) => {
        button.addEventListener("click", () => {
            const target = button.dataset.screen;
            if (target) {
                navigateTo(target);
            }
        });
    });
}

function renderTopics() {
    if (!elements.topicsList) {
        return;
    }

    elements.topicsList.innerHTML = "";

    state.topics.forEach((topic) => {
        const totalEquations = state.equations.filter((equation) => equation.topicId === topic.id).length;
        const card = document.createElement("article");
        card.className = `topicCard ${topic.selected ? "selected" : ""}`;

        card.innerHTML = `
            <span class="topicName">${topic.name}</span>
            <span class="topicNumberOfQuestions">${totalEquations} Equações</span>
            <div class="topicFooter">
                <span class="icon-btn success editTopicButton" title="Editar tópico"><i class="fas fa-wrench"></i></span>
                <span class="topicStatus">${topic.selected ? "Adicionado" : "Não adicionado"}</span>
                <span class="icon-btn danger deleteTopicButton" title="Remover tópico"><i class="fas fa-xmark"></i></span>
            </div>
        `;

        card.addEventListener("click", () => {
            topic.selected = !topic.selected;

            if (!topic.selected) {
                state.equations
                    .filter((equation) => equation.topicId === topic.id)
                    .forEach((equation) => {
                        equation.selected = false;
                    });
            }

            renderAll();
            saveState();
        });

        const editButton = card.querySelector(".editTopicButton");
        const deleteButton = card.querySelector(".deleteTopicButton");

        editButton.addEventListener("click", (event) => {
            event.stopPropagation();
            editTopic(topic.id);
        });

        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();
            removeTopic(topic.id);
        });

        elements.topicsList.appendChild(card);
    });
}

function addTopic() {
    const name = elements.inputNovoTopicoNome?.value || "";

    if (!name || !name.trim()) {
        showToast("Informe um nome para o tópico.");
        return;
    }

    state.customTopicCounter += 1;

    const topic = {
        id: `topic::custom::${state.customTopicCounter}`,
        name: name.trim(),
        selected: true,
        source: "custom"
    };

    state.topics.push(topic);
    if (elements.inputNovoTopicoNome) {
        elements.inputNovoTopicoNome.value = "";
    }
    renderAll();
    saveState();
    showToast("Tópico adicionado.");
}

function editTopic(topicId) {
    const topic = state.topics.find((item) => item.id === topicId);

    if (!topic) {
        return;
    }

    const newName = prompt("Editar nome do tópico:", topic.name);

    if (!newName || !newName.trim()) {
        return;
    }

    topic.name = newName.trim();
    renderAll();
    saveState();
    showToast("Tópico atualizado.");
}

function removeTopic(topicId) {
    const topic = state.topics.find((item) => item.id === topicId);

    if (!topic) {
        return;
    }

    const confirmed = confirm(`Remover o tópico "${topic.name}" e suas equações?`);

    if (!confirmed) {
        return;
    }

    state.topics = state.topics.filter((item) => item.id !== topicId);
    state.equations = state.equations.filter((equation) => equation.topicId !== topicId);

    Object.keys(state.restrictions).forEach((restrictionKey) => {
        if (restrictionKey.startsWith(`${topicId}::`)) {
            delete state.restrictions[restrictionKey];
        }
    });

    renderAll();
    saveState();
    showToast("Tópico removido.");
}

function getSelectedTopicIds() {
    return new Set(state.topics.filter((topic) => topic.selected).map((topic) => topic.id));
}

function focusEquationRestrictions(equationId) {
    state.focusedRestrictionEquationId = equationId;
    navigateTo("restricoes");
    renderRestricoes();

    requestAnimationFrame(() => {
        const row = elements.restricoesContainer?.querySelector(`[data-equation-id="${equationId}"]`);
        row?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
}

function startEditingEquation(equationId) {
    const equation = state.equations.find((eq) => eq.id === equationId);
    if (!equation) return;

    state.editingEquationId = equationId;

    // Populate form inputs
    if (elements.inputNovaEquacaoTopico) elements.inputNovaEquacaoTopico.value = equation.topicId || "";
    if (elements.inputNovaEquacaoNome) elements.inputNovaEquacaoNome.value = equation.name || "";
    if (elements.inputNovaEquacaoModelo) elements.inputNovaEquacaoModelo.value = equation.model || "";
    if (elements.inputNovaEquacaoResposta) elements.inputNovaEquacaoResposta.value = equation.responseModel || "";
    if (elements.inputNovaEquacaoFormula) elements.inputNovaEquacaoFormula.value = equation.formulaResposta || "";

    // Change action button to indicate editing
    if (elements.botaoAdicionarEquacao) elements.botaoAdicionarEquacao.textContent = "Salvar alteração";

    // Ensure the Equações screen is visible
    navigateTo("equacoes");

    // Show the form panel
    if (elements.equacaoFormPanel) elements.equacaoFormPanel.style.display = "block";
    if (elements.botaoMostrarFormEquacao) elements.botaoMostrarFormEquacao.textContent = "Fechar formulário";

    // Update preview and focus the name input for quick editing
    requestAnimationFrame(() => {
        updateEquationPreview();
        elements.inputNovaEquacaoNome?.focus();
    });
}

// Debounce helper
function debounce(fn, wait) {
    let t = null;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}

function updateEquationPreview() {
    if (!elements.equacaoPreviewMath) return;
    const model = (elements.inputNovaEquacaoModelo?.value || "").trim();
    const response = (elements.inputNovaEquacaoResposta?.value || "").trim();
    const content = model || response ? `\\[${model || "?"} = ${response || "?"}\\]` : "&nbsp;";
    elements.equacaoPreviewMath.innerHTML = content;
    if (window.MathJax && window.MathJax.typesetPromise) {
        try {
            window.MathJax.typesetPromise([elements.equacaoPreviewMath]).catch((e) => console.warn(e));
        } catch (e) {
            console.warn(e);
        }
    }
}

const debouncedUpdateEquationPreview = debounce(updateEquationPreview, 80);

function renderEquations() {
    if (!elements.equationsList) {
        return;
    }

    const selectedTopicIds = getSelectedTopicIds();
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
            <span class="renderEquation">\\[${equation.model} = ${equation.responseModel}\\]</span>
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
            renderAll();
            saveState();
        });

        const editRestrictionsButton = card.querySelector(".editEquationRestrictionsButton");
        const deleteButton = card.querySelector(".deleteEquationButton");
        const viewRestrictionsLink = card.querySelector(".viewRestrictionsLink");

        editRestrictionsButton.addEventListener("click", (event) => {
            event.stopPropagation();
            startEditingEquation(equation.id);
        });

        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();
            removeEquation(equation.id);
        });

        viewRestrictionsLink.addEventListener("click", (event) => {
            event.stopPropagation();
            focusEquationRestrictions(equation.id);
        });

        elements.equationsList.appendChild(card);
    });

    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([elements.equationsList]).catch((error) => console.warn(error));
    }
}

function renderEquationTopicOptions() {
    if (!elements.inputNovaEquacaoTopico) {
        return;
    }

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

function updateActionAvailability() {
    const selectedTopics = state.topics.filter((topic) => topic.selected).length;
    const selectedEquations = state.equations.filter((equation) => equation.selected).length;
    const hasQuestions = state.generatedQuestions.length > 0;
    const hasCards = state.generatedCards.length > 0;
    const bingoValidationError = validateBingoParams();

    if (elements.botaoAdicionarEquacao) {
        elements.botaoAdicionarEquacao.disabled = selectedTopics === 0;
    }

    if (elements.botaoGerarQuestoes) {
        elements.botaoGerarQuestoes.disabled = selectedEquations === 0 || Boolean(bingoValidationError);
    }

    if (elements.botaoRegenerarQuestoes) {
        elements.botaoRegenerarQuestoes.disabled = selectedEquations === 0;
    }

    if (elements.botaoGerarCartelas) {
        elements.botaoGerarCartelas.disabled = !hasQuestions;
    }

    if (elements.botaoAlternarModoCartela) {
        elements.botaoAlternarModoCartela.disabled = !hasCards;
    }

    if (elements.botaoImprimirCartelas) {
        elements.botaoImprimirCartelas.disabled = !hasCards;
    }
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

    // Derive formulaResposta automatically when possible
    const formulaResposta = RESPONSE_FORMULA_BY_EQUATION[equationName] || elements.inputNovaEquacaoFormula?.value || "";

    // If we are editing an existing equation, update it instead of creating a new one
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
            // clear editing state
            state.editingEquationId = null;
            if (elements.botaoAdicionarEquacao) elements.botaoAdicionarEquacao.textContent = "Adicionar Equação";
            renderAll();
            saveState();
            showToast("Equação atualizada.");
        }
        // Clear form
        if (elements.inputNovaEquacaoNome) elements.inputNovaEquacaoNome.value = "";
        if (elements.inputNovaEquacaoModelo) elements.inputNovaEquacaoModelo.value = "";
        if (elements.inputNovaEquacaoResposta) elements.inputNovaEquacaoResposta.value = "";
        if (elements.inputNovaEquacaoFormula) elements.inputNovaEquacaoFormula.value = "";
        if (elements.equacaoFormPanel) elements.equacaoFormPanel.style.display = "none";
        if (elements.botaoMostrarFormEquacao) elements.botaoMostrarFormEquacao.textContent = "Novo Modelo de Equação";
        if (elements.equacaoPreviewMath) elements.equacaoPreviewMath.innerHTML = "&nbsp;";
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

    if (elements.inputNovaEquacaoNome) {
        elements.inputNovaEquacaoNome.value = "";
    }
    if (elements.inputNovaEquacaoModelo) {
        elements.inputNovaEquacaoModelo.value = "";
    }
    if (elements.inputNovaEquacaoResposta) {
        elements.inputNovaEquacaoResposta.value = "";
    }
    if (elements.inputNovaEquacaoFormula) {
        elements.inputNovaEquacaoFormula.value = "";
    }
    if (elements.equacaoFormPanel) elements.equacaoFormPanel.style.display = "none";
    if (elements.botaoMostrarFormEquacao) elements.botaoMostrarFormEquacao.textContent = "Novo Modelo de Equação";
    if (elements.equacaoPreviewMath) elements.equacaoPreviewMath.innerHTML = "&nbsp;";

    renderAll();
    saveState();
    showToast("Equação adicionada.");
}

function removeEquation(equationId) {
    const equation = state.equations.find((item) => item.id === equationId);

    if (!equation) {
        return;
    }

    const confirmed = confirm(`Remover a equação "${equation.name}"?`);

    if (!confirmed) {
        return;
    }

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

function renderRestricoes() {
    if (!elements.restricoesContainer) {
        return;
    }

    const selectedEquations = state.equations.filter((equation) => equation.selected);

    if (selectedEquations.length === 0) {
        elements.restricoesContainer.innerHTML = "<p class=\"empty-state\">Selecione equações para configurar restrições por variável.</p>";
        return;
    }

    const rows = [];

    selectedEquations.forEach((equation) => {
        equation.variables.forEach((variableName) => {
            const key = `${equation.id}::${variableName}`;
            const config = state.restrictions[key] || { min: 1, max: 10, tipo: "inteiro" };
            const rowClass = state.focusedRestrictionEquationId === equation.id ? "restriction-row-highlight" : "";

            rows.push(`
                <tr class="${rowClass}" data-equation-id="${equation.id}">
                    <td>${equation.name}</td>
                    <td><strong>${variableName}</strong></td>
                    <td>
                        <input type="number" data-key="${key}" data-field="min" value="${config.min}" min="-9999" max="9999">
                    </td>
                    <td>
                        <input type="number" data-key="${key}" data-field="max" value="${config.max}" min="-9999" max="9999">
                    </td>
                    <td>
                        <select data-key="${key}" data-field="tipo">
                            <option value="inteiro" ${config.tipo === "inteiro" ? "selected" : ""}>Inteiro</option>
                            <option value="racional" ${config.tipo === "racional" ? "selected" : ""}>Racional</option>
                        </select>
                    </td>
                </tr>
            `);
        });
    });

    elements.restricoesContainer.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Equação</th>
                    <th>Variável</th>
                    <th>Mín</th>
                    <th>Máx</th>
                    <th>Tipo</th>
                </tr>
            </thead>
            <tbody>${rows.join("")}</tbody>
        </table>
    `;

    elements.restricoesContainer
        .querySelectorAll("input, select")
        .forEach((inputElement) => {
            inputElement.addEventListener("change", onRestricaoChange);
        });
}

function onRestricaoChange(event) {
    const inputElement = event.target;
    const key = inputElement.dataset.key;
    const field = inputElement.dataset.field;

    if (!key || !field) {
        return;
    }

    const current = state.restrictions[key] || { min: 1, max: 10, tipo: "inteiro" };

    if (field === "min" || field === "max") {
        current[field] = Number(inputElement.value);
    } else {
        current[field] = inputElement.value;
    }

    state.restrictions[key] = current;
    saveState();
    renderInicioStatus();
    renderInicioFlow();
}

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

function renderBingo() {
    if (!elements.paramNumQuestoesUnicas) {
        return;
    }

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

function generateQuestions() {
    syncBingoParamsFromInputs();
    const validationError = validateBingoParams();

    if (validationError) {
        renderBingo();
        showToast(validationError);
        return;
    }

    const selectedEquations = state.equations.filter((equation) => equation.selected);
    const targetCount = state.bingoParams.numQuestoesUnicas;
    const generated = [];

    for (let index = 0; index < targetCount; index += 1) {
        const equation = selectedEquations[index % selectedEquations.length];
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

function renderQuestoes() {
    if (!elements.questoesContainer || !elements.questoesResumo) {
        return;
    }

    const questions = state.generatedQuestions;

    if (!questions.length) {
        elements.questoesResumo.textContent = "Nenhuma questão gerada ainda.";
        elements.questoesContainer.innerHTML = "<p class=\"empty-state\">Use a tela Bingo para gerar questões automaticamente.</p>";
        return;
    }

    const distribution = {};
    questions.forEach((question) => {
        distribution[question.equationName] = (distribution[question.equationName] || 0) + 1;
    });

    elements.questoesResumo.textContent = `Total gerado: ${questions.length} questões. ${Object.keys(distribution).length} tipo(s).`;

    const rows = questions.map((question, index) => `
        <tr>
            <td>#${String(index + 1).padStart(3, "0")}</td>
            <td>
                <div class="question-equation">\\[${question.enunciado}\\]</div>
                <div class="question-meta">${question.topicName} • ${question.equationName}</div>
            </td>
            <td><span class="badge">${question.resposta}</span></td>
        </tr>
    `);

    elements.questoesContainer.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Questão</th>
                    <th>Resposta</th>
                </tr>
            </thead>
            <tbody>${rows.join("")}</tbody>
        </table>
    `;

    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([elements.questoesContainer]).catch((error) => console.warn(error));
    }
}

function shuffleArray(array) {
    const list = [...array];

    for (let index = list.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [list[index], list[randomIndex]] = [list[randomIndex], list[index]];
    }

    return list;
}

function buildQuestionPool(questions, totalSlots, minRepeticoes, maxRepeticoes) {
    const pool = [];
    const usageCount = {};

    questions.forEach((question) => {
        usageCount[question.id] = 0;

        for (let repeat = 0; repeat < minRepeticoes; repeat += 1) {
            pool.push(question.id);
            usageCount[question.id] += 1;
        }
    });

    let safeGuard = 0;
    while (pool.length < totalSlots && safeGuard < 40000) {
        safeGuard += 1;
        const candidates = questions.filter((question) => usageCount[question.id] < maxRepeticoes);

        if (!candidates.length) {
            break;
        }

        const picked = candidates[Math.floor(Math.random() * candidates.length)];
        pool.push(picked.id);
        usageCount[picked.id] += 1;
    }

    return pool;
}

function createCardsFromPool(questionPool, numCartelas, numQuestoesPorCartela) {
    const shuffledPool = shuffleArray(questionPool);
    const cards = [];

    for (let cardIndex = 0; cardIndex < numCartelas; cardIndex += 1) {
        const questionsInCard = [];
        const usedInCard = new Set();
        let attempts = 0;

        while (questionsInCard.length < numQuestoesPorCartela && attempts < 3000) {
            attempts += 1;
            const pickedId = shuffledPool[Math.floor(Math.random() * shuffledPool.length)];

            if (!pickedId || usedInCard.has(pickedId)) {
                continue;
            }

            questionsInCard.push(pickedId);
            usedInCard.add(pickedId);
        }

        if (questionsInCard.length < numQuestoesPorCartela) {
            const fallback = shuffleArray(shuffledPool).filter((id) => !usedInCard.has(id));
            fallback.forEach((id) => {
                if (questionsInCard.length < numQuestoesPorCartela) {
                    questionsInCard.push(id);
                }
            });
        }

        cards.push({
            id: `cartela-${String(cardIndex + 1).padStart(3, "0")}`,
            questions: questionsInCard.slice(0, numQuestoesPorCartela)
        });
    }

    return cards;
}

function generateCards() {
    const questions = state.generatedQuestions;

    if (!questions.length) {
        showToast("Gere questões antes de montar cartelas.");
        return;
    }

    syncBingoParamsFromInputs();
    const validationError = validateBingoParams();

    if (validationError) {
        showToast(validationError);
        renderBingo();
        return;
    }

    const { numCartelas, numQuestoesPorCartela, minRepeticoes, maxRepeticoes } = state.bingoParams;
    const totalSlots = numCartelas * numQuestoesPorCartela;

    const questionPool = buildQuestionPool(questions, totalSlots, minRepeticoes, maxRepeticoes);

    if (questionPool.length < totalSlots) {
        showToast("Não foi possível preencher todas as cartelas com os limites atuais.");
        return;
    }

    state.generatedCards = createCardsFromPool(questionPool, numCartelas, numQuestoesPorCartela);
    saveState();
    renderAll();
    navigateTo("cartelas");
    showToast(`${state.generatedCards.length} cartelas geradas.`);
}

function toggleCardMode() {
    state.cardDisplayMode = state.cardDisplayMode === "professor" ? "aluno" : "professor";
    saveState();
    renderCartelas();
}

function renderCartelas() {
    if (!elements.cartelasContainer || !elements.cartelasResumo) {
        return;
    }

    if (elements.botaoAlternarModoCartela) {
        elements.botaoAlternarModoCartela.textContent = `Modo: ${state.cardDisplayMode === "professor" ? "Professor" : "Aluno"}`;
    }

    if (!state.generatedCards.length) {
        elements.cartelasResumo.textContent = "Nenhuma cartela gerada ainda.";
        elements.cartelasContainer.innerHTML = "<p class=\"empty-state\">Use o botão \"Gerar cartelas\" para montar as cartelas com base nas questões geradas.</p>";
        return;
    }

    const questionMap = new Map(state.generatedQuestions.map((question, index) => [question.id, { ...question, numero: index + 1 }]));
    elements.cartelasResumo.textContent = `Total de cartelas: ${state.generatedCards.length}. Visualização atual: ${state.cardDisplayMode}.`;

    const cardsMarkup = state.generatedCards.map((card, index) => {
        const itemMarkup = card.questions.map((questionId) => {
            const question = questionMap.get(questionId);

            if (!question) {
                return "";
            }

            const expression = state.cardDisplayMode === "professor"
                ? `${question.enunciado} = ${question.resposta}`
                : `${question.enunciado} = \\square`;

            return `
                <div class="cartela-item">
                    <span class="numero">Questão #${String(question.numero).padStart(3, "0")}</span>
                    <div class="question-equation">\\[${expression}\\]</div>
                </div>
            `;
        }).join("");

        return `
            <article class="cartela-card">
                <h3>Cartela #${String(index + 1).padStart(3, "0")}</h3>
                <div class="cartela-lista">${itemMarkup}</div>
            </article>
        `;
    }).join("");

    elements.cartelasContainer.innerHTML = cardsMarkup;

    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([elements.cartelasContainer]).catch((error) => console.warn(error));
    }
}

function printCards() {
    if (!state.generatedCards.length) {
        showToast("Nenhuma cartela para imprimir.");
        return;
    }

    navigateTo("cartelas");
    window.print();
}

function applyThemeToUI() {
    const root = document.documentElement;

    root.style.setProperty("--colorDarkBlue", state.visualTheme.corPrimaria);
    root.style.setProperty("--colorLightBlue", state.visualTheme.corDestaque);
    root.style.setProperty("--colorQuasiWhite", state.visualTheme.corFundo);
    root.style.setProperty("--bannerTopColor", state.visualTheme.corPrimaria);
    root.style.setProperty("--bannerBottomColor", state.visualTheme.corPrimaria);

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

function renderFinal() {
    if (!elements.temaNomeBingo || !elements.finalResumo) {
        return;
    }

    elements.temaNomeBingo.value = state.visualTheme.nomeBingo;
    elements.temaNomeInstituicao.value = state.visualTheme.nomeInstituicao;
    elements.temaCorPrimaria.value = state.visualTheme.corPrimaria;
    elements.temaCorDestaque.value = state.visualTheme.corDestaque;
    elements.temaCorFundo.value = state.visualTheme.corFundo;

    elements.finalResumo.textContent = `Tópicos: ${state.topics.length} | Equações: ${state.equations.length} | Questões: ${state.generatedQuestions.length} | Cartelas: ${state.generatedCards.length}`;
}

function exportConfiguration() {
    const payload = {
        exportedAt: new Date().toISOString(),
        app: "BingoAlgebrico",
        version: 1,
        data: {
            ...state
        }
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
    if (!data || typeof data !== "object") {
        return false;
    }

    state.currentScreen = typeof data.currentScreen === "string" ? data.currentScreen : "inicio";
    state.topics = Array.isArray(data.topics) ? data.topics : state.topics;
    state.equations = Array.isArray(data.equations) ? data.equations : state.equations;
    state.restrictions = data.restrictions && typeof data.restrictions === "object" ? data.restrictions : {};
    state.bingoParams = {
        ...state.bingoParams,
        ...(data.bingoParams || {})
    };
    state.generatedQuestions = Array.isArray(data.generatedQuestions) ? data.generatedQuestions : [];
    state.generatedCards = Array.isArray(data.generatedCards) ? data.generatedCards : [];
    state.cardDisplayMode = data.cardDisplayMode === "aluno" ? "aluno" : "professor";
    state.visualTheme = {
        ...state.visualTheme,
        ...(data.visualTheme || {})
    };
    state.customTopicCounter = Number(data.customTopicCounter || 0);
    state.customEquationCounter = Number(data.customEquationCounter || 0);
    state.questionCounter = Number(data.questionCounter || 0);

    return true;
}

async function importConfiguration(event) {
    const file = event.target.files?.[0];

    if (!file) {
        return;
    }

    try {
        const text = await file.text();
        const parsed = JSON.parse(text);
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

function wireActions() {
    elements.botaoAdicionarNovoTopico?.addEventListener("click", addTopic);
    elements.inputNovoTopicoNome?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addTopic();
        }
    });
    elements.botaoSalvarTopicos?.addEventListener("click", () => {
        saveState();
        showToast("Tópicos salvos.");
    });

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
    elements.botaoSalvarEquacoes?.addEventListener("click", () => {
        saveState();
        showToast("Equações salvas.");
    });

    // Live preview updates while typing
    [elements.inputNovaEquacaoModelo, elements.inputNovaEquacaoResposta].forEach((inputEl) => {
        inputEl?.addEventListener("input", () => debouncedUpdateEquationPreview());
    });

    // Toggle show/hide of the inline equation form
    elements.botaoMostrarFormEquacao?.addEventListener("click", () => {
        if (!elements.equacaoFormPanel) return;
        const isVisible = elements.equacaoFormPanel.style.display !== "none" && elements.equacaoFormPanel.style.display !== "";
        if (isVisible) {
            elements.equacaoFormPanel.style.display = "none";
            // reset editing state
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

    elements.botaoSalvarRestricoes?.addEventListener("click", () => {
        saveState();
        showToast("Restrições salvas.");
    });

    [
        elements.paramNumQuestoesUnicas,
        elements.paramNumCartelas,
        elements.paramNumQuestoesPorCartela,
        elements.paramMinRepeticoes,
        elements.paramMaxRepeticoes
    ].forEach((inputElement) => {
        inputElement?.addEventListener("input", () => {
            applyBingoInputLimits();
            renderBingo();
            saveState();
        });
    });

    elements.botaoSalvarParametrosBingo?.addEventListener("click", () => {
        syncBingoParamsFromInputs();
        const validationError = validateBingoParams();

        if (validationError) {
            renderBingo();
            showToast(validationError);
            return;
        }

        saveState();
        renderBingo();
        showToast("Parâmetros do bingo salvos.");
    });

    elements.botaoGerarQuestoes?.addEventListener("click", generateQuestions);
    elements.botaoRegenerarQuestoes?.addEventListener("click", generateQuestions);
    elements.botaoGerarCartelas?.addEventListener("click", generateCards);
    elements.botaoAlternarModoCartela?.addEventListener("click", toggleCardMode);
    elements.botaoImprimirCartelas?.addEventListener("click", printCards);

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
            renderFinal();
        });
    });

    elements.botaoAplicarTema?.addEventListener("click", () => {
        syncThemeFromInputs();
        applyThemeToUI();
        saveState();
        renderFinal();
        showToast("Tema aplicado.");
    });

    elements.botaoExportarConfiguracao?.addEventListener("click", exportConfiguration);
    elements.botaoImportarConfiguracao?.addEventListener("click", () => {
        elements.inputImportarConfiguracao?.click();
    });
    elements.inputImportarConfiguracao?.addEventListener("change", importConfiguration);
}

function renderAll() {
    renderInicioStatus();
    renderInicioFlow();
    renderTopics();
    renderEquationTopicOptions();
    renderEquations();
    renderRestricoes();
    renderBingo();
    renderQuestoes();
    renderCartelas();
    renderFinal();
    updateActionAvailability();
}

async function initialize() {
    try {
        bindDOMElements();
        const loaded = await DataLoader.loadDefaultEquations();
        if (!loaded || loaded.length < DEFAULT_DATA_FILES.length) {
            showPersistentMessage(
                "Alguns dados iniciais falharam ao carregar.",
                "Tentar novamente",
                () => {
                    clearPersistentMessage();
                    initialize();
                }
            );
        } else {
            clearPersistentMessage();
        }
        const defaultTopics = [];
        const defaultEquations = [];
        const usedTopicIds = new Set();

        loaded.forEach((item) => {
            if (!usedTopicIds.has(item.topic.id)) {
                usedTopicIds.add(item.topic.id);
                defaultTopics.push(item.topic);
            }

            defaultEquations.push(item.equation);
        });

        mergeState(defaultTopics, defaultEquations);
        applyThemeToUI();
        setupNavigation();
        wireActions();
        renderAll();
        // honor deep-linking hash if present
        const { screen, params } = parseHash(location.hash);
        const target = screen || state.currentScreen || "inicio";
        navigateTo(target);
        // apply params (deep-link behavior)
        if (params.mode && target === "cartelas") {
            state.cardDisplayMode = params.mode;
            renderCartelas();
        }
        showToast("Aplicação inicializada.");
    } catch (error) {
        console.error(error);
        showToast("Erro ao carregar dados iniciais.");
    }
}

initialize();
